// eslint-disable-next-line max-classes-per-file
import path from "path"
import _ from "lodash"
import { promises as fs } from "fs"
import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from "google-spreadsheet"

// Test write attack with: wget --header='Content-Type:application/json' --post-data='{"prenom":"Pierre","nom":"SCELLES","email":"test@gmail.com","telephone":"0601010101","dejaBenevole":false,"commentaire":""}' http://localhost:3000/PreVolunteerAdd

const CRED_PATH = path.resolve(process.cwd(), "access/gsheets.json")

const REMOTE_UPDATE_DELAY = 20000

export type ElementWithId<ElementNoId> = { id: number } & ElementNoId

export class SheetNames {
    JavGames = "Jeux JAV"

    Volunteers = "Membres"

    PreVolunteers = "PreMembres"

    Wishes = "Envies d'aider"
}
export const sheetNames = new SheetNames()

// eslint-disable-next-line @typescript-eslint/ban-types
type SheetList = { [sheetName in keyof SheetNames]?: Sheet<object, ElementWithId<object>> }
const sheetList: SheetList = {}
setInterval(
    () =>
        // eslint-disable-next-line @typescript-eslint/ban-types
        Object.values(sheetList).forEach((sheet: Sheet<object, ElementWithId<object>>) =>
            sheet.dbUpdate()
        ),
    REMOTE_UPDATE_DELAY
)

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

    return sheetList[sheetName] as Sheet<ElementNoId, Element>
}

export class Sheet<
    // eslint-disable-next-line @typescript-eslint/ban-types
    ElementNoId extends object,
    Element extends ElementWithId<ElementNoId>
> {
    sheetName: string

    _state: Element[] | undefined

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
        this.sheetName = sheetNames[name]
        this.frenchSpecimen = _.mapValues(
            _.invert(translation),
            (englishProp: string) => (specimen as any)[englishProp]
        ) as Element

        this.dbLoad()
    }

    async getList(): Promise<Element[] | undefined> {
        await this.waitForLoad()
        return JSON.parse(JSON.stringify(this._state))
    }

    setList(newState: Element[] | undefined): void {
        this._state = JSON.parse(JSON.stringify(newState))
        this.modifiedSinceSave = true
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

    runAfterLoad(func: () => void): void {
        if (this.toRunAfterLoad) {
            this.toRunAfterLoad.push(func)
        } else {
            func()
        }
    }

    private async waitForLoad(): Promise<void> {
        return new Promise((resolve, _reject) => {
            this.runAfterLoad(() => resolve(undefined))
        })
    }

    dbUpdate(): void {
        if (this.modifiedSinceSave) {
            this.dbSave()
        } else {
            this.dbLoad()
        }
    }

    dbSave(): void {
        this.modifiedSinceSave = false
        this.saveTimestamp = +new Date()

        this.dbSaveAsync()
    }

    dbLoad(): void {
        this.toRunAfterLoad = []
        this.dbLoadAsync().then(() => {
            if (this.toRunAfterLoad) {
                this.toRunAfterLoad.map((func) => func())
                this.toRunAfterLoad = undefined
            }
        })
    }

    private async dbSaveAsync(): Promise<void> {
        if (!this._state) {
            return
        }
        const sheet = await this.getGSheet()

        // Load sheet into an array of objects
        const rows = await sheet.getRows()
        if (!rows[0]) {
            throw new Error(`No column types defined in sheet ${this.name}`)
        }
        // eslint-disable-next-line @typescript-eslint/ban-types
        const elements = this._state as Element[]
        const types = _.pick(rows[0], Object.values(this.translation)) as Record<
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
            const stringifiedRow = this.stringifyElement(frenchElement, types)

            if (!row) {
                // eslint-disable-next-line no-await-in-loop
                await sheet.addRow(stringifiedRow)
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
                }
            }

            rowid += 1
        }

        // Delete all following rows
        for (let rowToDelete = sheet.rowCount - 1; rowToDelete >= rowid; rowToDelete -= 1) {
            if (rows[rowToDelete]) {
                // eslint-disable-next-line no-await-in-loop
                await rows[rowToDelete].delete()
            }
        }
    }

    private async dbLoadAsync(): Promise<void> {
        type StringifiedElement = Record<keyof Element, string>

        const sheet = await this.getGSheet()

        // Load sheet into an array of objects
        const rows = (await sheet.getRows()) as StringifiedElement[]
        const elements: Element[] = []
        if (!rows[0]) {
            throw new Error(`No column types defined in sheet ${this.name}`)
        }
        const types = _.pick(rows[0], Object.values(this.translation)) as Record<
            keyof Element,
            string
        >
        rows.shift()
        rows.forEach((row) => {
            const stringifiedElement = _.pick(row, Object.values(this.translation)) as Record<
                keyof Element,
                string
            >
            const frenchData: any = this.parseElement(stringifiedElement, types)
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

    private async getGSheet(): Promise<GoogleSpreadsheetWorksheet> {
        const doc = new GoogleSpreadsheet("1pMMKcYx6NXLOqNn6pLHJTPMTOLRYZmSNg2QQcAu7-Pw")
        const creds = await fs.readFile(CRED_PATH)
        // Authentication
        await doc.useServiceAccountAuth(JSON.parse(creds.toString()))
        await doc.loadInfo()
        return doc.sheetsByTitle[this.sheetName]
    }

    private parseElement(
        rawElement: Record<keyof Element, string>,
        types: Record<keyof Element, string>
    ): Element {
        const fullElement = _.reduce(
            types,
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
        types: Record<keyof Element, string>
    ): Record<keyof Element, string> {
        const rawElement: Record<keyof Element, string> = _.reduce(
            types,
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
