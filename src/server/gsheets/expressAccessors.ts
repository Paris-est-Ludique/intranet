import { Request, Response, NextFunction } from "express"
import { SheetNames, ElementWithId, getSheet, Sheet } from "./accessors"

export type RequestBody = Request["body"]
export type CustomSetReturn<Element> = { toDatabase: Element; toCaller: any }

export default class ExpressAccessors<
    // eslint-disable-next-line @typescript-eslint/ban-types
    ElementNoId extends object,
    Element extends ElementWithId<ElementNoId>
> {
    sheet: Sheet<ElementNoId, Element>

    constructor(
        readonly sheetName: keyof SheetNames,
        readonly specimen: Element,
        readonly translation: { [k in keyof Element]: string }
    ) {
        this.sheet = getSheet<ElementNoId, Element>(sheetName, specimen, translation)
    }

    listGet() {
        return async (
            _request: Request,
            response: Response,
            _next: NextFunction
        ): Promise<void> => {
            try {
                const elements = await this.sheet.getList()
                if (elements) {
                    response.status(200).json(elements)
                }
            } catch (e: any) {
                response.status(200).json({ error: e.message })
            }
        }
    }

    // custom can be async
    get(custom?: (list: Element[], body: Request["body"]) => Promise<any> | any) {
        return async (request: Request, response: Response, _next: NextFunction): Promise<void> => {
            try {
                const list = (await this.sheet.getList()) || []
                let toCaller: any
                if (!custom) {
                    const id = parseInt(request.query.id as string, 10) || -1
                    toCaller = list.find((e: Element) => e.id === id)
                } else {
                    toCaller = await custom(list, request.body)
                }
                response.status(200).json(toCaller)
            } catch (e: any) {
                response.status(200).json({ error: e.message })
            }
        }
    }

    add() {
        return async (request: Request, response: Response, _next: NextFunction): Promise<void> => {
            try {
                const element: Element = await this.sheet.add(request.body)
                if (element) {
                    response.status(200).json(element)
                }
            } catch (e: any) {
                response.status(200).json({ error: e.message })
            }
        }
    }

    // custom can be async
    set(
        custom?: (
            list: Element[],
            body: RequestBody
        ) => Promise<CustomSetReturn<Element>> | CustomSetReturn<Element>
    ) {
        return async (request: Request, response: Response, _next: NextFunction): Promise<void> => {
            try {
                if (!custom) {
                    await this.sheet.set(request.body)
                    response.status(200)
                } else {
                    const list = (await this.sheet.getList()) || []
                    const { toDatabase, toCaller } = await custom(list, request.body)
                    if (toDatabase !== undefined) {
                        await this.sheet.set(toDatabase)
                    }
                    if (toCaller !== undefined) {
                        response.status(200).json(toCaller)
                    } else {
                        response.status(200)
                    }
                }
            } catch (e: any) {
                response.status(200).json({ error: e.message })
            }
        }
    }
}
