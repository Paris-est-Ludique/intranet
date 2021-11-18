import path from "path"
import _ from "lodash"
import { promises as fs } from "fs"
import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from "google-spreadsheet"

import DBManager from "./DBManager"

const CRED_PATH = path.resolve(process.cwd(), "access/gsheets.json")

export type ElementWithId = unknown & { id: number }

export default function getAccessors<
    // eslint-disable-next-line @typescript-eslint/ban-types
    ElementNoId extends object,
    Element extends ElementNoId & ElementWithId
>(sheetName: string, specimen: Element): any {
    const addDBOperation = DBManager(sheetName)

    async function listGet(): Promise<Element[]> {
        type StringifiedElement = Record<keyof Element, string>
        return addDBOperation("list", async () => {
            const sheet = await getGSheet()

            // Load sheet into an array of objects
            const rows = (await sheet.getRows()) as StringifiedElement[]
            const elements: Element[] = []
            if (!rows[0]) {
                throw new Error(`No column types defined in sheet ${sheetName}`)
            }
            const types = _.pick(rows[0], Object.keys(specimen)) as Record<keyof Element, string>
            rows.shift()
            rows.forEach((row) => {
                const stringifiedElement = _.pick(row, Object.keys(specimen)) as Record<
                    keyof Element,
                    string
                >
                const element = parseElement(stringifiedElement, types)
                if (element !== undefined) {
                    elements.push(element)
                }
            })

            return elements
        })
    }

    async function get(membreId: number): Promise<Element | undefined> {
        // No need to addDBOperation here, since listGet does it already
        const list = await listGet()
        return list.find((element) => element.id === membreId)
    }

    async function setList(elements: Element[]): Promise<true | undefined> {
        return addDBOperation("listSet", async () => {
            const sheet = await getGSheet()

            // Load sheet into an array of objects
            const rows = await sheet.getRows()
            if (!rows[0]) {
                throw new Error(`No column types defined in sheet ${sheetName}`)
            }
            const types = _.pick(rows[0], Object.keys(elements[0] || {})) as Record<
                keyof Element,
                string
            >

            // Update received rows
            let rowid = 1
            // eslint-disable-next-line no-restricted-syntax
            for (const element of elements) {
                const row = rows[rowid]
                const stringifiedRow = stringifyElement(element, types)

                if (!row) {
                    // eslint-disable-next-line no-await-in-loop
                    await sheet.addRow(stringifiedRow)
                } else {
                    const keys = Object.keys(stringifiedRow)
                    const sameCells = _.every(
                        keys,
                        (key: keyof Element) => row[key as string] === stringifiedRow[key]
                    )
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

            return true
        })
    }

    async function set(element: Element): Promise<Element | undefined> {
        if (!element) {
            return undefined
        }
        return addDBOperation("set", async () => {
            const sheet = await getGSheet()

            // Load sheet into an array of objects
            const rows = await sheet.getRows()
            if (!rows[0]) {
                throw new Error(`No column types defined in sheet ${sheetName}`)
            }
            const types = _.pick(rows[0], Object.keys(element || {})) as Record<
                keyof Element,
                string
            >
            rows.shift()

            // Replace previous row
            const stringifiedRow = stringifyElement(element, types)
            const row = rows.find((rowItem) => +rowItem.id === element.id)
            if (!row) {
                return undefined
            }
            Object.assign(row, stringifiedRow)
            await row.save()
            return element
        })
    }

    async function add(partialElement: Partial<ElementNoId>): Promise<Element | undefined> {
        if (!partialElement) {
            return undefined
        }
        return addDBOperation("add", async () => {
            const sheet = await getGSheet()

            // Load sheet into an array of objects
            const rows = await sheet.getRows()
            if (!rows[0]) {
                throw new Error(`No column types defined in sheet ${sheetName}`)
            }
            const types = {
                id: "number",
                ...(_.pick(rows[0], Object.keys(partialElement || {})) as Record<
                    keyof ElementNoId,
                    string
                >),
            }

            // Create full element
            rows.shift()
            const highestId = rows.reduce((id: number, row) => Math.max(id, +row.id || 0), 0)
            const element = { id: highestId + 1, ...partialElement } as Element

            // Add element
            const stringifiedRow = stringifyElement(element, types)
            await sheet.addRow(stringifiedRow)

            return element
        })
    }

    async function getGSheet(): Promise<GoogleSpreadsheetWorksheet> {
        const doc = new GoogleSpreadsheet("1pMMKcYx6NXLOqNn6pLHJTPMTOLRYZmSNg2QQcAu7-Pw")
        const creds = await fs.readFile(CRED_PATH)
        // Authentication
        await doc.useServiceAccountAuth(JSON.parse(creds.toString()))
        await doc.loadInfo()
        return doc.sheetsByTitle[sheetName]
    }

    function parseElement(
        rawElement: Record<keyof Element, string>,
        types: Record<keyof Element, string>
    ): Element {
        const fullElement = _.reduce(
            types,
            (element: any, type: string, prop: string) => {
                const rawProp: string = rawElement[prop as keyof Element]
                switch (type) {
                    case "string":
                        element[prop] = rawProp
                        break

                    case "number":
                        element[prop] = +rawProp
                        break

                    case "boolean":
                        element[prop] = rawProp !== "0" && rawProp !== ""
                        break

                    case "date":
                        // eslint-disable-next-line no-case-declarations
                        const matchDate = rawProp.match(/^([0-9]+)\/([0-9]+)\/([0-9]+)$/)
                        if (matchDate) {
                            element[prop] = new Date(
                                +matchDate[3],
                                +matchDate[2] - 1,
                                +matchDate[1]
                            )
                            break
                        }
                        throw new Error(`Unable to read date from ${rawProp}`)

                    default:
                        // eslint-disable-next-line no-case-declarations
                        const matchArrayType = type.match(
                            /^(number|string|boolean|date)\[([^\]]+)\]$/
                        )
                        if (!matchArrayType) {
                            throw new Error(`Unknown array type for ${type}`)
                        }
                        if (!rawProp) {
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
                                    const rightFormat = rawDates.every((rawDate) => {
                                        const matchDateArray = rawDate.match(
                                            /^([0-9]+)\/([0-9]+)\/([0-9]+)$/
                                        )
                                        if (!matchDateArray) {
                                            return false
                                        }
                                        element[prop].push(
                                            new Date(
                                                +matchDateArray[3],
                                                +matchDateArray[2] - 1,
                                                +matchDateArray[1]
                                            )
                                        )
                                        return true
                                    })
                                    if (!rightFormat) {
                                        throw new Error(
                                            `One array item is not a date in ${rawProp}`
                                        )
                                    }
                                    break
                                default:
                                    throw new Error(`Unknown array type ${arrayType}`)
                            }
                        }
                }
                return element
            },
            JSON.parse(JSON.stringify(specimen))
        )
        return fullElement
    }

    function stringifyElement(
        element: Element,
        types: { id: string } & Record<keyof ElementNoId, string>
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
                                    (val) =>
                                        `${val.getDate()}/${
                                            val.getMonth() + 1
                                        }/${val.getFullYear()}`
                                ).join(delimiter)
                                break

                            default:
                                throw new Error(`Unknown array type ${arrayType}`)
                        }
                }

                return stringifiedElement
            },
            JSON.parse(JSON.stringify(element))
        )

        return rawElement
    }

    function formulaSafe(value: string): string {
        return value.replace(/^=+/, "")
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
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    }

    return { listGet, get, setList, set, add }
}
