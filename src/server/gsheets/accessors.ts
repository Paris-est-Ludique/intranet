// eslint-disable-next-line max-classes-per-file
import path from "path"
import _ from "lodash"
import { promises as fs, constants } from "fs"
import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from "google-spreadsheet"

// Test write attack with: wget --header='Content-Type:application/json' --post-data='{"prenom":"Pierre","nom":"SCELLES","email":"test@gmail.com","telephone":"0601010101","dejaBenevole":false,"commentaire":""}' http://localhost:3000/PreVolunteerAdd

const CRED_PATH = path.resolve(process.cwd(), "access/gsheets.json")
const DB_PATH = path.resolve(process.cwd(), "access/db.json")
const DB_TO_LOAD_PATH = path.resolve(process.cwd(), "access/dbToLoad.json")

const REMOTE_UPDATE_DELAY = 40000
const DELAY_AFTER_QUERY = 2000

let creds: string | undefined | null
// eslint-disable-next-line @typescript-eslint/ban-types
let states: { [sheetName in keyof SheetNames]?: object[] | undefined } = {}
// eslint-disable-next-line @typescript-eslint/ban-types
let types: { [sheetName in keyof SheetNames]?: object | undefined } = {}

export type ElementWithId<ElementNoId> = { id: number } & ElementNoId

export class SheetNames {
    JavGames = "Jeux JAV"

    PreVolunteers = "PreMembres"

    Teams = "Equipes"

    Volunteers = "Membres"

    Wishes = "Envies d'aider"
}
export const sheetNames = new SheetNames()

// eslint-disable-next-line @typescript-eslint/ban-types
type SheetList = { [sheetName in keyof SheetNames]?: Sheet<object, ElementWithId<object>> }
const sheetList: SheetList = {}

let hasGSheetsAccessReturn: boolean | undefined
export async function hasGSheetsAccess(): Promise<boolean> {
    if (hasGSheetsAccessReturn !== undefined) {
        return hasGSheetsAccessReturn
    }
    try {
        // eslint-disable-next-line no-bitwise
        await fs.access(CRED_PATH, constants.R_OK | constants.W_OK)
        hasGSheetsAccessReturn = true
    } catch {
        hasGSheetsAccessReturn = false
    }
    return hasGSheetsAccessReturn
}

export async function checkGSheetsAccess(): Promise<void> {
    if (!(await hasGSheetsAccess())) {
        console.error(`Google Sheets: no creds found, loading local database ${DB_PATH} instead`)
    }
}
export function getSheet<
    // eslint-disable-next-line @typescript-eslint/ban-types
    ElementNoId extends object,
    Element extends ElementNoId & ElementWithId<ElementNoId>
>(
    sheetName: keyof SheetNames,
    specimen: Element,
    translation: { [k in keyof Element]: string }
): Sheet<ElementNoId, Element> {
    if (!sheetList[sheetName]) {
        sheetList[sheetName] = new Sheet<ElementNoId, Element>(sheetName, specimen, translation)
    }

    const sheet = sheetList[sheetName] as Sheet<ElementNoId, Element>

    setTimeout(
        () => setInterval(() => sheet.dbUpdate(), REMOTE_UPDATE_DELAY),
        1000 * Object.values(sheetList).length
    )

    return sheet
}

export class Sheet<
    // eslint-disable-next-line @typescript-eslint/ban-types
    ElementNoId extends object,
    Element extends ElementWithId<ElementNoId>
> {
    sheetName: string

    _state: Element[] | undefined

    _type: Record<keyof Element, string> | undefined

    toRunAfterLoad: (() => void)[] | undefined = []

    saveTimestamp = 0

    modifiedSinceSave = false

    frenchSpecimen: Element

    invertedTranslation: { [k: string]: string }

    // eslint-disable-next-line no-useless-constructor
    constructor(
        readonly name: keyof SheetNames,
        readonly specimen: Element,
        readonly translation: { [k in keyof Element]: string }
    ) {
        this.invertedTranslation = _.invert(this.translation)
        this.sheetName = sheetNames[name] || name
        this.frenchSpecimen = _.mapValues(
            _.invert(translation),
            (englishProp: string) => (specimen as any)[englishProp]
        ) as Element

        setTimeout(() => this.dbFirstLoad(), 100 * Object.values(sheetList).length)
    }

    async getList(): Promise<Element[] | undefined> {
        await this.waitForLoad()
        return JSON.parse(JSON.stringify(this._state))
    }

    async setList(newState: Element[] | undefined): Promise<void> {
        this._state = JSON.parse(JSON.stringify(newState))
        this.modifiedSinceSave = true
        this.localDbSave()
    }

    async nextId(): Promise<number> {
        const list = await this.getList()
        if (!list) {
            return 1
        }
        const ids = _.map(list, "id")
        return (_.max(ids) || 0) + 1
    }

    async add(elementWithoutId: ElementNoId): Promise<Element> {
        const elements: Element[] = (await this.getList()) || []
        // eslint-disable-next-line @typescript-eslint/ban-types
        const element: Element = { id: await this.nextId(), ...elementWithoutId } as Element
        elements.push(element)
        await this.setList(elements)
        return element
    }

    async set(element: Element): Promise<void> {
        const elements: Element[] = (await this.getList()) || []
        const foundElement: Element | undefined = elements.find((e: Element) => e.id === element.id)
        if (!foundElement) {
            throw new Error(`No element found to be set in ${this.name} at id ${element.id}`)
        }

        if (!_.isEqual(foundElement, element)) {
            Object.assign(foundElement, element)
            await this.setList(elements)
        }
    }

    addToRunAfterLoad(func: () => void): void {
        if (this.toRunAfterLoad) {
            this.toRunAfterLoad.push(func)
        } else {
            func()
        }
    }

    private async waitForLoad(): Promise<void> {
        return new Promise((resolve, _reject) => {
            this.addToRunAfterLoad(() => resolve(undefined))
        })
    }

    async dbUpdate(): Promise<void> {
        if (await hasGSheetsAccess()) {
            if (this.modifiedSinceSave) {
                this.dbSave()
            } else {
                this.dbLoad()
            }
        }
        if (__DEV__) {
            this.localDbSave()
        }
    }

    async localDbSave(): Promise<void> {
        states[this.name] = this._state
        types[this.name] = this._type
        const toSave = { states, types }
        const jsonDB = __DEV__ ? JSON.stringify(toSave, null, 2) : JSON.stringify(toSave)
        await fs.writeFile(DB_PATH, jsonDB)
    }

    async localDbLoad(): Promise<void> {
        if (_.isEmpty(states)) {
            let stringifiedDb
            try {
                stringifiedDb = await fs.readFile(DB_TO_LOAD_PATH)
            } catch {
                console.error(`No local database save found in ${DB_TO_LOAD_PATH}`)
                process.exit()
            }
            if (stringifiedDb) {
                const db = JSON.parse(stringifiedDb.toString())
                states = db.states
                types = db.types
            }
        }

        if (!states[this.name]) {
            console.error(`Sheet ${this.name} couldn't be found in localDb`)
            process.exit()
        }
        this._state = states[this.name] as Element[]
        this._type = types[this.name] as Record<keyof Element, string>
    }

    dbSave(): void {
        this.saveTimestamp = +new Date()

        try {
            this.dbSaveAsync()
            this.modifiedSinceSave = false
        } catch (e) {
            console.error("Error in dbSave: ", e)
        }
    }

    async dbLoad(): Promise<void> {
        try {
            if (await hasGSheetsAccess()) {
                this.dbLoadAsync().then(() => this.doRunAfterLoad())
            } else {
                this.doRunAfterLoad()
            }
        } catch (e) {
            console.error("Error in dbLoad: ", e)
        }
    }

    doRunAfterLoad(): void {
        if (this.toRunAfterLoad) {
            this.toRunAfterLoad.map((func) => func())
            this.toRunAfterLoad = undefined
        }
    }

    async dbFirstLoad(): Promise<void> {
        if (!(await hasGSheetsAccess()) && _.isEmpty(states)) {
            this.localDbLoad()
        }
        this.dbLoad()
    }

    private async dbSaveAsync(): Promise<void> {
        if (!this._state) {
            return
        }
        const sheet = await this.getGSheet()

        if (!sheet) {
            return
        }

        // Load sheet into an array of objects
        const rows = await sheet.getRows()
        await delayDBAccess()
        if (!rows[0]) {
            throw new Error(`No column types defined in sheet ${this.name}`)
        }
        // eslint-disable-next-line @typescript-eslint/ban-types
        const elements = this._state as Element[]
        this._type = _.pick(rows[0], Object.values(this.translation)) as Record<
            keyof Element,
            string
        >

        // Update received rows
        let rowid = 1
        // eslint-disable-next-line no-restricted-syntax
        for (const element of elements) {
            const row = rows[rowid]
            const frenchElement = _.mapValues(
                this.invertedTranslation,
                (englishProp: string) => (element as any)[englishProp]
            ) as Element
            const stringifiedRow = this.stringifyElement(frenchElement, this._type)

            if (!row) {
                // eslint-disable-next-line no-await-in-loop
                await sheet.addRow(stringifiedRow)
                // eslint-disable-next-line no-await-in-loop
                await delayDBAccess()
            } else {
                const keys = Object.keys(stringifiedRow)
                const sameCells = _.every(keys, (key: keyof Element) => {
                    const rawVal = row[key as string]
                    const val: string = rawVal === undefined ? "" : rawVal
                    return val === stringifiedRow[key]
                })
                if (!sameCells) {
                    keys.forEach((key) => {
                        row[key] = stringifiedRow[key as keyof Element]
                    })
                    // eslint-disable-next-line no-await-in-loop
                    await row.save()
                    // eslint-disable-next-line no-await-in-loop
                    await delayDBAccess()
                }
            }

            rowid += 1
        }

        // Delete all following rows
        for (let rowToDelete = sheet.rowCount - 1; rowToDelete >= rowid; rowToDelete -= 1) {
            if (rows[rowToDelete]) {
                // eslint-disable-next-line no-await-in-loop
                await rows[rowToDelete].delete()
                // eslint-disable-next-line no-await-in-loop
                await delayDBAccess()
            }
        }
    }

    private async dbLoadAsync(): Promise<void> {
        type StringifiedElement = Record<keyof Element, string>
        const sheet = await this.getGSheet()

        if (!sheet) {
            return
        }

        // Load sheet into an array of objects
        const rows = (await sheet.getRows()) as StringifiedElement[]
        await delayDBAccess()
        const elements: Element[] = []
        if (!rows[0]) {
            throw new Error(`No column types defined in sheet ${this.name}`)
        }
        const typeList = _.pick(rows[0], Object.values(this.translation)) as Record<
            keyof Element,
            string
        >
        this._type = typeList
        rows.shift()
        rows.forEach((row) => {
            const stringifiedElement = _.pick(row, Object.values(this.translation)) as Record<
                keyof Element,
                string
            >
            const frenchData: any = this.parseElement(stringifiedElement, typeList)
            if (frenchData !== undefined) {
                const englishElement = _.mapValues(
                    this.translation,
                    (frenchProp: string) => frenchData[frenchProp]
                ) as Element
                elements.push(englishElement)
            }
        })

        this._state = elements
    }

    private async getGSheet(): Promise<GoogleSpreadsheetWorksheet | null> {
        if (creds === undefined) {
            if (await hasGSheetsAccess()) {
                const credsBuffer = await fs.readFile(CRED_PATH)
                creds = credsBuffer?.toString() || null
            } else {
                creds = null
            }
        }
        if (creds === null) {
            return null
        }
        // Authentication
        const doc = new GoogleSpreadsheet("1pMMKcYx6NXLOqNn6pLHJTPMTOLRYZmSNg2QQcAu7-Pw")
        await doc.useServiceAccountAuth(JSON.parse(creds))
        await doc.loadInfo()
        return doc.sheetsByTitle[this.sheetName]
    }

    private parseElement(
        rawElement: Record<keyof Element, string>,
        typeList: Record<keyof Element, string>
    ): Element {
        const fullElement = _.reduce(
            typeList,
            (element: any, type: string, prop: string) => {
                const rawProp: string = rawElement[prop as keyof Element]
                switch (type) {
                    case "string":
                        if (rawProp === undefined) {
                            element[prop] = ""
                        } else {
                            element[prop] = rawProp
                        }
                        break

                    case "number":
                        if (rawProp === undefined) {
                            element[prop] = undefined
                        } else {
                            element[prop] = +rawProp
                        }
                        break

                    case "boolean":
                        if (rawProp === undefined) {
                            element[prop] = false
                        } else {
                            element[prop] = rawProp !== "0" && rawProp !== ""
                        }
                        break

                    case "date":
                        if (rawProp === undefined) {
                            element[prop] = undefined
                        } else {
                            try {
                                element[prop] = parseDate(rawProp)
                            } catch (e: any) {
                                throw new Error(
                                    `${e.message} in sheet ${this.name} at prop ${prop}`
                                )
                            }
                        }
                        break

                    default:
                        // eslint-disable-next-line no-case-declarations
                        const matchArrayType = type.match(
                            /^(number|string|boolean|date)\[([^\]]+)\]$/
                        )
                        if (!matchArrayType) {
                            throw new Error(
                                `Unknown array type for ${type} in sheet ${this.name} at prop ${prop}`
                            )
                        }
                        if (rawProp === undefined || rawProp === "") {
                            element[prop] = []
                        } else {
                            const arrayType = matchArrayType[1]
                            const delimiter = matchArrayType[2]

                            switch (arrayType) {
                                case "string":
                                    element[prop] = rawProp.split(delimiter)
                                    break

                                case "number":
                                    element[prop] = _.map(rawProp.split(delimiter), (val) => +val)
                                    break

                                case "boolean":
                                    element[prop] = _.map(
                                        rawProp.split(delimiter),
                                        (val) => val !== "0" && val !== ""
                                    )
                                    break

                                case "date":
                                    // eslint-disable-next-line no-case-declarations
                                    const rawDates = rawProp.split(delimiter)
                                    element[prop] = []
                                    // eslint-disable-next-line no-case-declarations
                                    rawDates.forEach((rawDate) => {
                                        try {
                                            element[prop].push(parseDate(rawDate))
                                        } catch (e: any) {
                                            throw new Error(
                                                `${e.message} in sheet ${this.name} at prop ${prop}`
                                            )
                                        }
                                    })
                                    break
                                default:
                                    throw new Error(
                                        `Unknown array type ${arrayType} in sheet ${this.name} at prop ${prop}`
                                    )
                            }
                        }
                }
                return element
            },
            JSON.parse(JSON.stringify(this.frenchSpecimen))
        )
        return fullElement
    }

    private stringifyElement(
        element: Element,
        typeList: Record<keyof Element, string>
    ): Record<keyof Element, string> {
        const rawElement: Record<keyof Element, string> = _.reduce(
            typeList,
            (stringifiedElement: Record<keyof Element, string>, type: string, prop: string) => {
                const value = element[prop as keyof Element]
                switch (type) {
                    case "string":
                        stringifiedElement[prop as keyof Element] = formulaSafe(`${value}`)
                        break

                    case "number":
                        stringifiedElement[prop as keyof Element] = `${value}`
                        break

                    case "boolean":
                        stringifiedElement[prop as keyof Element] = value ? "X" : ""
                        break

                    case "date":
                        stringifiedElement[prop as keyof Element] = stringifiedDate(value)
                        break

                    default:
                        // eslint-disable-next-line no-case-declarations
                        const matchArrayType = type.match(
                            /^(number|string|boolean|date)\[([^\]]+)\]$/
                        )
                        if (!matchArrayType || !_.isArray(value)) {
                            throw new Error(
                                "Unknown matchArrayType or not an array in stringifyElement"
                            )
                        }
                        // eslint-disable-next-line no-case-declarations
                        const arrayType = matchArrayType[1]
                        // eslint-disable-next-line no-case-declarations
                        const delimiter = matchArrayType[2]

                        switch (arrayType) {
                            case "string":
                                if (!_.every(value, _.isString)) {
                                    throw new Error(`Each date of ${value} is not a string`)
                                }
                                stringifiedElement[prop as keyof Element] = formulaSafe(
                                    value.join(delimiter)
                                )
                                break

                            case "number":
                                if (!_.every(value, _.isNumber)) {
                                    throw new Error(`Each date of ${value} is not a number`)
                                }
                                stringifiedElement[prop as keyof Element] = value.join(delimiter)
                                break

                            case "boolean":
                                if (!_.every(value, _.isBoolean)) {
                                    throw new Error(`Each date of ${value} is not a boolean`)
                                }
                                stringifiedElement[prop as keyof Element] = _.map(value, (val) =>
                                    val ? "X" : ""
                                ).join(delimiter)
                                break

                            case "date":
                                if (!_.every(value, _.isDate)) {
                                    throw new Error(`Each date of ${value} is not a date`)
                                }
                                stringifiedElement[prop as keyof Element] = _.map(
                                    value,
                                    stringifiedDate
                                ).join(delimiter)
                                break

                            default:
                                throw new Error(`Unknown array type ${arrayType}`)
                        }
                }

                return stringifiedElement
            },
            JSON.parse(JSON.stringify(this.frenchSpecimen))
        )

        return rawElement
    }
}

function formulaSafe(value: string): string {
    return value === undefined ? "" : value.replace(/^=+/, "")
}

function stringifiedDate(value: unknown): string {
    let date: Date
    if (value instanceof Date) {
        date = value
    } else if (typeof value === "string") {
        try {
            date = new Date(value)
        } catch (e) {
            throw new Error("Wrong date string format in stringifyElement")
        }
    } else {
        throw new Error("Wrong date format in stringifyElement")
    }
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
}

function parseDate(value: string): Date {
    // eslint-disable-next-line no-case-declarations
    const matchDate = value.match(/^([0-9]+)\/([0-9]+)\/([0-9]+)$/)
    if (!matchDate) {
        throw new Error(`Unable to read date from val ${value}`)
    }
    return new Date(+matchDate[1], +matchDate[2] - 1, +matchDate[3])
}

async function delayDBAccess(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, DELAY_AFTER_QUERY))
}
