import { Request, Response, NextFunction } from "express"
import { ElementWithId, getAccessors } from "./accessors"

export default function getExpressAccessors<
    // eslint-disable-next-line @typescript-eslint/ban-types
    ElementNoId extends object,
    Element extends ElementNoId & ElementWithId
>(sheetName: string, specimen: Element, translation: { [k in keyof Element]: string }): any {
    const { get, listGet, add, set } = getAccessors(sheetName, specimen, translation)

    function listGetRequest() {
        return async (
            _request: Request,
            response: Response,
            _next: NextFunction
        ): Promise<void> => {
            try {
                const elements = await listGet()
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
                const elements = await get(id)
                if (elements) {
                    response.status(200).json(elements)
                }
            } catch (e: unknown) {
                response.status(400).json(e)
            }
        }
    }

    function addRequest() {
        return async (request: Request, response: Response, _next: NextFunction): Promise<void> => {
            try {
                const element = await add(request.body)
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
                const element = await set(request.body)
                if (element) {
                    response.status(200).json(element)
                }
            } catch (e: unknown) {
                response.status(400).json(e)
            }
        }
    }

    return { getRequest, addRequest, listGetRequest, setRequest }
}
