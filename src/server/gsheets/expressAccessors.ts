import { Request, Response, NextFunction } from "express"
import { SheetNames, ElementWithId, getSheet } from "./accessors"

export default function getExpressAccessors<
    // eslint-disable-next-line @typescript-eslint/ban-types
    ElementNoId extends object,
    Element extends ElementWithId<ElementNoId>
>(
    sheetName: keyof SheetNames,
    specimen: Element,
    translation: { [k in keyof Element]: string }
): any {
    const sheet = getSheet<ElementNoId, Element>(sheetName, specimen, translation)

    function listGetRequest() {
        return async (
            _request: Request,
            response: Response,
            _next: NextFunction
        ): Promise<void> => {
            try {
                const elements = await sheet.getList()
                if (elements) {
                    response.status(200).json(elements)
                }
            } catch (e: unknown) {
                response.status(400).json(e)
            }
        }
    }

    function getRequest() {
        return async (request: Request, response: Response, _next: NextFunction): Promise<void> => {
            try {
                const id = parseInt(request.query.id as string, 10) || -1
                const elements = await sheet.getList()
                if (elements) {
                    const element = elements.find((e: Element) => e.id === id)
                    response.status(200).json(element)
                }
            } catch (e: unknown) {
                response.status(400).json(e)
            }
        }
    }

    function addRequest() {
        return async (request: Request, response: Response, _next: NextFunction): Promise<void> => {
            try {
                sheet.add(request.body)
                const elements: Element[] = (await sheet.getList()) || []
                const element: Element = { id: await sheet.nextId(), ...request.body }
                elements.push(element)
                await sheet.setList(elements)
                if (element) {
                    response.status(200).json(element)
                }
            } catch (e: unknown) {
                response.status(400).json(e)
            }
        }
    }

    function setRequest() {
        return async (request: Request, response: Response, _next: NextFunction): Promise<void> => {
            try {
                await sheet.set(request.body)
                response.status(200)
            } catch (e: unknown) {
                response.status(400).json(e)
            }
        }
    }

    return { getRequest, addRequest, listGetRequest, setRequest }
}
