import { Request, Response, NextFunction } from "express"
import { SheetNames, ElementWithId, getSheet, Sheet } from "./accessors"

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
            } catch (e: unknown) {
                response.status(400).json(e)
            }
        }
    }

    get() {
        return async (request: Request, response: Response, _next: NextFunction): Promise<void> => {
            try {
                const id = parseInt(request.query.id as string, 10) || -1
                const elements = await this.sheet.getList()
                if (elements) {
                    const element = elements.find((e: Element) => e.id === id)
                    response.status(200).json(element)
                }
            } catch (e: unknown) {
                response.status(400).json(e)
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
            } catch (e: unknown) {
                response.status(400).json(e)
            }
        }
    }

    set() {
        return async (request: Request, response: Response, _next: NextFunction): Promise<void> => {
            try {
                await this.sheet.set(request.body)
                response.status(200)
            } catch (e: unknown) {
                response.status(400).json(e)
            }
        }
    }

    // transformer can be an async function
    customGet(
        transformer: (list: Element[] | undefined, body?: Request["body"]) => Promise<any> | any
    ) {
        return async (request: Request, response: Response, _next: NextFunction): Promise<void> => {
            try {
                const elements = await this.sheet.getList()
                response.status(200).json(await transformer(elements, request.body))
            } catch (e: any) {
                response.status(200).json({ error: e.message })
            }
        }
    }
}
