import { Request, Response, NextFunction } from "express"
import { ElementWithId, get, listGet, add, set } from "./accessors"

export function getRequest<Element extends { id: number }>(sheetName: string, specimen: Element) {
    return async (request: Request, response: Response, _next: NextFunction): Promise<void> => {
        try {
            const id = parseInt(request.query.id as string, 10) || -1
            const elements = await get<Element>(sheetName, id, specimen)
            if (elements) {
                response.status(200).json(elements)
            }
        } catch (e: unknown) {
            response.status(400).json(e)
        }
    }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function addRequest<ElementNoId extends object, Element extends ElementNoId & ElementWithId>(
    sheetName: string
) {
    return async (request: Request, response: Response, _next: NextFunction): Promise<void> => {
        try {
            const element = await add<ElementNoId, Element>(sheetName, request.body)
            if (element) {
                response.status(200).json(element)
            }
        } catch (e: unknown) {
            response.status(400).json(e)
        }
    }
}

export function listGetRequest<Element extends { id: number }>(
    sheetName: string,
    specimen: Element
) {
    return async (_request: Request, response: Response, _next: NextFunction): Promise<void> => {
        try {
            const elements = await listGet<Element>(sheetName, specimen)
            if (elements) {
                response.status(200).json(elements)
            }
        } catch (e: unknown) {
            response.status(400).json(e)
        }
    }
}

export function setRequest<Element extends { id: number }>(sheetName: string) {
    return async (request: Request, response: Response, _next: NextFunction): Promise<void> => {
        try {
            const element = await set<Element>(sheetName, request.body)
            if (element) {
                response.status(200).json(element)
            }
        } catch (e: unknown) {
            response.status(400).json(e)
        }
    }
}
