import _ from 'lodash'
import assign from 'lodash/assign'
import { JWT } from 'google-auth-library'
import type { GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { SheetNames, loadLocalDb, saveLocalDb } from './localDb'
import { pick } from '@/utils'

export { SheetNames } from './localDb'

// Test write attack with: wget --header='Content-Type:application/json' --post-data='{"prenom":"Pierre","nom":"SCELLES","email":"test@gmail.com","telephone":"0601010101","dejaBenevole":false,"commentaire":""}' http://localhost:3000/PostulantAdd

const REMOTE_UPDATE_DELAY = 120000
const DELAY_BETWEEN_ATTEMPTS = 30000
const DELAY_BETWEEN_FIRST_LOAD = 1500

export type ElementWithId<ElementNoId> = { id: number } & ElementNoId
export const sheetNames = new SheetNames()

type SheetList = {
  [sheetName in keyof SheetNames]?: Sheet<object, ElementWithId<object>>
}
const sheetList: SheetList = {}

type TKey<T> = keyof T
type TKeys<T> = (keyof T)[]
type TStringified<T> = { [k in TKey<T>]: string }

export async function getSheet<ElementNoId extends object, Element extends ElementNoId & ElementWithId<ElementNoId>>(
  sheetName: keyof SheetNames,
  specimen: Element,
  translation: { [k in TKey<Element>]: string },
): Promise<Sheet<ElementNoId, Element>> {
  let sheet: Sheet<ElementNoId, Element>

  if (!sheetList[sheetName]) {
    sheet = new Sheet<ElementNoId, Element>(sheetName, specimen, translation)
    await sheet.waitForFirstLoad()
    sheetList[sheetName] = sheet
    setInterval(() => sheet.dbUpdate(), REMOTE_UPDATE_DELAY * (1 + Math.random() / 10))
  } else {
    sheet = sheetList[sheetName] as Sheet<ElementNoId, Element>
  }

  return sheet
}

export class Sheet<ElementNoId extends object, Element extends ElementWithId<ElementNoId>> {
  sheetName: string
  _state: Element[] | undefined
  _type: TStringified<Element> | undefined
  toRunAfterLoad: (() => void)[] | undefined = []
  saveTimestamp = 0
  modifiedSinceSave = false
  frenchSpecimen: Element
  invertedTranslation: { [k: string]: string }

  constructor(
    readonly name: keyof SheetNames,
    readonly specimen: Element,
    readonly translation: { [k in TKey<Element>]: string },
  ) {
    this.invertedTranslation = _.invert(this.translation)
    this.sheetName = sheetNames[name] || name
    this.frenchSpecimen = _.mapValues(
      _.invert(translation),
      (englishProp: string) => (specimen as any)[englishProp],
    ) as Element
  }

  async getList(): Promise<Element[] | undefined> {
    await this.waitForLoad()

    return JSON.parse(JSON.stringify(this._state))
  }

  async setList(newState: Element[] | undefined): Promise<void> {
    this._state = JSON.parse(JSON.stringify(newState))
    this.modifiedSinceSave = true
    this.saveLocalDb()
  }

  async nextId(): Promise<number> {
    const list = await this.getList()

    if (!list) {
      return 1
    }

    const ids = _.map(list, 'id')

    return (_.max(ids) || 0) + 1
  }

  async add(elementWithoutId: Omit<Element, 'id'>): Promise<Element> {
    const elements: Element[] = (await this.getList()) || []
    const element: Element = {
      id: await this.nextId(),
      ...elementWithoutId,
    } as Element

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

  async waitForFirstLoad(): Promise<void> {
    setTimeout(() => this.dbFirstLoad(), DELAY_BETWEEN_FIRST_LOAD * Object.values(sheetList).length)

    await this.waitForLoad()
  }

  private async waitForLoad(): Promise<void> {
    return new Promise((resolve, _reject) => {
      this.addToRunAfterLoad(() => resolve(undefined))
    })
  }

  async dbUpdate(): Promise<void> {
    if (import.meta.env.GOOGLE_SHEET_ID) {
      if (this.modifiedSinceSave) {
        this.dbSave()
      } else {
        this.dbLoad()
      }
    }
  }

  async saveLocalDb(): Promise<void> {
    await saveLocalDb(this.name, this._state, this._type)
  }

  async loadLocalDb(): Promise<void> {
    const db = await loadLocalDb(this.name)

    this._state = db.state as Element[]
    this._type = db.type as TStringified<Element>
  }

  parseRawPartialElement(rawPartialElement: Partial<TStringified<Element>>): Partial<Element> | undefined {
    if (this._type === undefined) {
      return undefined
    }

    // else

    const rawPartialFrenchElement = _.mapValues(
      this.invertedTranslation,
      (englishProp: string) => (rawPartialElement as any)[englishProp],
    ) as Element

    const rawFrenchElement = this.stringifyElement(this.frenchSpecimen, this._type)

    assign(rawFrenchElement, rawPartialFrenchElement)

    const frenchElement = this.parseElement(rawFrenchElement, this._type)

    const element = _.mapValues(this.translation, (frenchProp: string) => (frenchElement as any)[frenchProp]) as Element

    return pick(element, ...(Object.keys(rawPartialElement) as TKeys<Element>))
  }

  dbSave(): void {
    this.saveTimestamp = +new Date()

    try {
      this.dbSaveAsync()
      this.modifiedSinceSave = false
    } catch (e) {
      console.error('Error in dbSave: ', e)
    }
  }

  async dbLoad(): Promise<void> {
    try {
      if (import.meta.env.GOOGLE_SHEET_ID) {
        await this.dbLoadAsync()
      }

      this.doRunAfterLoad()
    } catch (e) {
      console.error('Error in dbLoad: ', e)
    }
  }

  doRunAfterLoad(): void {
    if (this.toRunAfterLoad) {
      this.toRunAfterLoad.map(func => func())
      this.toRunAfterLoad = undefined
    }
  }

  async dbFirstLoad(): Promise<void> {
    if (!import.meta.env.GOOGLE_SHEET_ID) {
      await this.loadLocalDb()
    } else if (this.toRunAfterLoad) {
      // Save once

      this.toRunAfterLoad.push(() => this.saveLocalDb())
    }

    await this.dbLoad()
  }

  private async dbSaveAsync(): Promise<void> {
    if (!this._state) {
      return
    }

    const sheet = await this.getGSheet()

    if (!sheet) {
      return
    }

    await tryNTimesVoidReturn(async () => {
      console.info(`dbSaveAsync on ${this.name} at ${new Date()}`)

      // Load sheet into an array of objects

      const rows = await sheet.getRows<TStringified<Element>>()

      if (!rows[0]) {
        throw new Error(`No column types defined in sheet ${this.name}`)
      }

      const elements = this._state as Element[]

      this._type = pick(
        rows[0].toObject() as TStringified<Element>,
        ...(Object.values(this.translation) as TKeys<Element>),
      )

      // Update received rows

      let rowid = 1

      for (const element of elements) {
        const row = rows[rowid]
        const frenchElement = _.mapValues(
          this.invertedTranslation,
          (englishProp: string) => (element as any)[englishProp],
        ) as Element
        const stringifiedRow: TStringified<Element> = this.stringifyElement(frenchElement, this._type)

        if (!row) {
          await sheet.addRow(stringifiedRow)
        } else {
          const keys = Object.keys(stringifiedRow) as TKeys<Element>
          const sameCells = _.every(keys, (key: TKey<Element>) => {
            const rawVal = row.get(key)
            const val: string = rawVal === undefined ? '' : rawVal

            return val === stringifiedRow[key]
          })

          if (!sameCells) {
            keys.forEach(key => {
              row.set(key, stringifiedRow[key])
            })

            await row.save()
          }
        }

        rowid += 1
      }

      // Delete all following rows

      for (let rowToDelete = sheet.rowCount - 1; rowToDelete >= rowid; rowToDelete -= 1) {
        if (rows[rowToDelete]) {
          await rows[rowToDelete].delete()
        }
      }

      console.info(`dbSaveAsync successful on ${this.name} at ${new Date()}`)
    })
  }

  private async dbLoadAsync(): Promise<void> {
    const sheet = await this.getGSheet(20)

    if (!sheet) {
      return
    }

    await tryNTimesVoidReturn(async () => {
      // Load sheet into an array of objects

      console.info(`dbLoadAsync on ${this.name} at ${new Date()}`)

      const rows = await sheet.getRows<TStringified<Element>>()
      const elements: Element[] = []

      if (!rows[0]) {
        throw new Error(`No column types defined in sheet ${this.name}`)
      }

      const typeList = pick(
        rows[0].toObject() as TStringified<Element>,
        ...(Object.values(this.translation) as TKeys<Element>),
      )

      this._type = typeList
      rows.shift()
      rows.forEach(row => {
        const stringifiedElement = pick(
          row.toObject() as TStringified<Element>,
          ...(Object.values(this.translation) as TKeys<Element>),
        )
        const frenchData: any = this.parseElement(stringifiedElement, typeList)

        if (frenchData !== undefined) {
          const englishElement = _.mapValues(
            this.translation,
            (frenchProp: string) => frenchData[frenchProp],
          ) as Element

          elements.push(englishElement)
        }
      })

      this._state = elements

      console.info(`dbLoadAsync successful on ${this.name} at ${new Date()}`)
    })
  }

  private async getGSheet(attempts = 3): Promise<GoogleSpreadsheetWorksheet | null> {
    return tryNTimes(
      async () => {
        if (!import.meta.env.GOOGLE_SHEET_ID) {
          return null
        }

        // Authentication

        const serviceAccountJWT = new JWT({
          email: import.meta.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          key: import.meta.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
          scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.file'],
        })

        const doc = new GoogleSpreadsheet(import.meta.env.GOOGLE_SHEET_ID, serviceAccountJWT)

        await doc.loadInfo() // loads sheets

        return doc.sheetsByTitle[this.sheetName]
      },
      () => null,
      attempts,
      DELAY_BETWEEN_ATTEMPTS / 5,
    )
  }

  private parseElement(rawElement: TStringified<Element>, typeList: TStringified<Element>): Element {
    const fullElement = Object.entries(typeList).reduce(
      (element, [type, prop]) => {
        const rawProp: string = rawElement[prop as TKey<Element>]

        switch (type) {
          case 'string':
            if (rawProp === undefined) {
              element[prop] = ''
            } else {
              element[prop] = rawProp
            }

            break

          case 'number':
            if (rawProp === undefined) {
              element[prop] = undefined
            } else {
              element[prop] = +rawProp
            }

            break

          case 'boolean':
            if (rawProp === undefined) {
              element[prop] = false
            } else {
              element[prop] = rawProp !== '0' && rawProp !== ''
            }

            break

          case 'date':
            if (rawProp === undefined) {
              element[prop] = undefined
            } else {
              try {
                element[prop] = parseDate(rawProp)
              } catch (e: any) {
                throw new Error(`${e.message} in sheet ${this.name} at prop ${prop}`)
              }
            }
            break

          default: {
            const matchArrayType = type.match(/^(number|string|boolean|date)\[([^\]]+)\]$/)

            if (!matchArrayType) {
              throw new Error(`Unknown array type for ${type} in sheet ${this.name} at prop ${prop}`)
            }
            if (rawProp === undefined || rawProp === '') {
              element[prop] = []
            } else {
              const arrayType = matchArrayType[1]
              const delimiter = matchArrayType[2]

              switch (arrayType) {
                case 'string':
                  element[prop] = rawProp.split(delimiter)
                  break

                case 'number':
                  element[prop] = _.map(rawProp.split(delimiter), val => +val)
                  break

                case 'boolean':
                  element[prop] = _.map(rawProp.split(delimiter), val => val !== '0' && val !== '')
                  break

                case 'date': {
                  const rawDates = rawProp.split(delimiter)

                  element[prop] = []
                  rawDates.forEach(rawDate => {
                    try {
                      element[prop].push(parseDate(rawDate))
                    } catch (e: any) {
                      throw new Error(`${e.message} in sheet ${this.name} at prop ${prop}`)
                    }
                  })
                  break
                }
                default:
                  throw new Error(`Unknown array type ${arrayType} in sheet ${this.name} at prop ${prop}`)
              }
            }
          }
        }

        return element
      },
      structuredClone(this.frenchSpecimen) as Element,
    )

    return fullElement
  }

  private stringifyElement(element: Element, typeList: TStringified<Element>): TStringified<Element> {
    const rawElement: TStringified<Element> = Object.entries(typeList).reduce(
      (stringifiedElement, [type, prop]) => {
        const value = element[prop as TKey<Element>]

        switch (type) {
          case 'string':
            stringifiedElement[prop as TKey<Element>] = formulaSafe(`${value}`)
            break

          case 'number':
            stringifiedElement[prop as TKey<Element>] = `${value}`
            break

          case 'boolean':
            stringifiedElement[prop as TKey<Element>] = value ? 'X' : ''
            break

          case 'date':
            stringifiedElement[prop as TKey<Element>] = stringifiedDate(value)
            break

          default: {
            const matchArrayType = type.match(/^(number|string|boolean|date)\[([^\]]+)\]$/)

            if (!matchArrayType || !_.isArray(value)) {
              throw new Error(
                `Unknown matchArrayType ${JSON.stringify(
                  matchArrayType,
                )} or not an array in stringifyElement for prop ${prop} and value ${JSON.stringify(
                  value,
                )}, ${JSON.stringify(element)}`,
              )
            }
            const arrayType = matchArrayType[1]
            const delimiter = matchArrayType[2]

            switch (arrayType) {
              case 'string':
                if (!_.every(value, _.isString)) {
                  throw new Error(`In ${prop}, each item of ${value} is not a string`)
                }
                stringifiedElement[prop as TKey<Element>] = formulaSafe(value.join(delimiter))
                break

              case 'number':
                if (!_.every(value, _.isNumber)) {
                  throw new Error(`In ${prop}, each item of ${value} is not a number`)
                }
                stringifiedElement[prop as TKey<Element>] = value.join(delimiter)
                break

              case 'boolean':
                if (!_.every(value, _.isBoolean)) {
                  throw new Error(`In ${prop}, each item of ${value} is not a boolean`)
                }
                stringifiedElement[prop as TKey<Element>] = _.map(value, val => (val ? 'X' : '')).join(delimiter)
                break

              case 'date':
                if (!_.every(value, _.isDate)) {
                  throw new Error(`In ${prop}, each item of ${value} is not a date`)
                }
                stringifiedElement[prop as TKey<Element>] = _.map(value, stringifiedDate).join(delimiter)
                break

              default:
                throw new Error(`Unknown array type ${arrayType}`)
            }
          }
        }

        return stringifiedElement
      },
      structuredClone(this.frenchSpecimen) as TStringified<Element>,
    )

    return rawElement
  }
}

function formulaSafe(value: string): string {
  return value === undefined ? '' : value.replace(/^=+/, '')
}

function stringifiedDate(value: unknown): string {
  let date: Date

  if (value instanceof Date) {
    date = value
  } else if (typeof value === 'string') {
    try {
      date = new Date(value)
    } catch (e) {
      throw new Error('Wrong date string format in stringifyElement')
    }
  } else {
    throw new TypeError('Wrong date format in stringifyElement')
  }

  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
}

function parseDate(value: string): Date {
  const matchDate = value.match(/^([0-9]+)\/([0-9]+)\/([0-9]+)$/)

  if (!matchDate) {
    throw new Error(`Unable to read date from val ${value}`)
  }

  return new Date(+matchDate[1], +matchDate[2] - 1, +matchDate[3])
}

async function tryNTimes<T>(
  func: () => Promise<T> | T,
  failFunc?: () => Promise<T> | T,
  repeatCount = 2,
  delayBetweenAttempts = DELAY_BETWEEN_ATTEMPTS,
): Promise<T> {
  try {
    return await func()
  } catch (e: any) {
    console.error(e?.error || e?.message || e)
    console.error(`${repeatCount} attempts left every ${delayBetweenAttempts}`)

    await new Promise<void>(resolve => {
      setTimeout(() => resolve(), delayBetweenAttempts)
    })

    if (repeatCount <= 1) {
      console.error(`No more attempts left every ${delayBetweenAttempts}`)

      if (failFunc) {
        return failFunc()
      }

      throw new Error(e)
    }

    return tryNTimes(func, failFunc, repeatCount - 1, delayBetweenAttempts)
  }
}

async function tryNTimesVoidReturn(
  func: () => Promise<void> | void,
  repeatCount = 2,
  delayBetweenAttempts = DELAY_BETWEEN_ATTEMPTS,
): Promise<void> {
  return tryNTimes(func, () => undefined, repeatCount, delayBetweenAttempts)
}
