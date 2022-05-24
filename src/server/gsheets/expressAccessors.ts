import { Request, Response, NextFunction } from "express"
import { SheetNames, ElementWithId, getSheet, Sheet } from "./accessors"

export type RequestBody = Request["body"]
export type CustomSetReturn<Element> = { toDatabase: Element; toCaller: any }
export type CustomAddReturn<Element> = { toDatabase: Omit<Element, "id">; toCaller: any }

export default class ExpressAccessors<
    // eslint-disable-next-line @typescript-eslint/ban-types
    ElementNoId extends object,
    Element extends ElementWithId<ElementNoId>
> {
    sheet?: Sheet<ElementNoId, Element>

    runAfterLoad: ((value: Sheet<ElementNoId, Element>) => void)[] = []

    isLoaded = false

    constructor(
        readonly sheetName: keyof SheetNames,
        readonly specimen: Element,
        readonly translation: { [k in keyof Element]: string }
    ) {
        getSheet<ElementNoId, Element>(this.sheetName, this.specimen, this.translation).then(
            (sheet) => {
                this.sheet = sheet
                this.isLoaded = true
                this.runAfterLoad.map((f) => f(sheet))
            }
        )
    }

    async getSheet(): Promise<Sheet<ElementNoId, Element>> {
        if (!this.isLoaded) {
            await new Promise((resolve) => {
                this.runAfterLoad.push(resolve)
            })
        }
        return this.sheet as Sheet<ElementNoId, Element>
    }

    parseRawPartialElement(
        rawPartialElement: Partial<Record<keyof Element, string>>
    ): Partial<Element> | undefined {
        return this.sheet?.parseRawPartialElement(rawPartialElement)
    }

    listGet() {
        return async (
            _request: Request,
            response: Response,
            _next: NextFunction
        ): Promise<void> => {
            try {
                const elements = await (await this.getSheet()).getList()
                if (elements) {
                    response.status(200).json(elements)
                }
            } catch (e: any) {
                response.status(200).json({ error: e.message })
            }
        }
    }

    listSet(
        custom?: (
            list: Element[],
            body: RequestBody,
            id: number,
            roles: string[]
        ) => Promise<CustomSetReturn<Element[]>> | CustomSetReturn<Element[]>
    ) {
        return async (request: Request, response: Response, _next: NextFunction): Promise<void> => {
            try {
                const sheet = await this.getSheet()
                if (!custom) {
                    await sheet.setList(request.body)
                    response.status(200)
                } else {
                    const memberId = response?.locals?.jwt?.id || -1
                    const roles: string[] = response?.locals?.jwt?.roles || []
                    const list = (await sheet.getList()) || []
                    const { toDatabase, toCaller } = await custom(
                        list,
                        request.body,
                        memberId,
                        roles
                    )
                    if (toDatabase !== undefined) {
                        await sheet.setList(toDatabase)
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

    // custom can be async
    get<Ret = Element>(
        custom?: (
            list: Element[],
            body: Request["body"],
            id: number,
            roles: string[]
        ) => Promise<Ret> | Ret
    ) {
        return async (request: Request, response: Response, _next: NextFunction): Promise<void> => {
            try {
                const sheet = await this.getSheet()
                const list = (await sheet.getList()) || []
                let toCaller: any
                if (!custom) {
                    const id = parseInt(request.query.id as string, 10) || -1
                    toCaller = list.find((e: Element) => e.id === id)
                } else {
                    const memberId = response?.locals?.jwt?.id || -1
                    const roles: string[] = response?.locals?.jwt?.roles || []
                    toCaller = await custom(list, request.body, memberId, roles)
                    if (toCaller?.jwt && toCaller?.id) {
                        response.cookie("jwt", toCaller.jwt, { maxAge: 365 * 24 * 60 * 60 })
                        response.cookie("id", toCaller.id, { maxAge: 365 * 24 * 60 * 60 })
                    }
                }
                response.status(200).json(toCaller)
            } catch (e: any) {
                response.status(200).json({ error: e.message })
            }
        }
    }

    add(
        custom?: (
            list: Element[],
            body: RequestBody,
            id: number,
            roles: string[]
        ) => Promise<CustomAddReturn<Element>> | CustomAddReturn<Element>
    ) {
        return async (request: Request, response: Response, _next: NextFunction): Promise<void> => {
            try {
                const sheet = await this.getSheet()
                if (!custom) {
                    await sheet.add(request.body)
                    response.status(200)
                } else {
                    const memberId = response?.locals?.jwt?.id || -1
                    const roles: string[] = response?.locals?.jwt?.roles || []
                    const list = (await sheet.getList()) || []
                    const { toDatabase, toCaller } = await custom(
                        list,
                        request.body,
                        memberId,
                        roles
                    )
                    let toReturn = toCaller

                    if (toDatabase !== undefined) {
                        const element: Element = await sheet.add(toDatabase)
                        toCaller.id = element.id
                        if (!toCaller) {
                            toReturn = element
                        }
                    }
                    if (toReturn !== undefined) {
                        response.status(200).json(toReturn)
                    } else {
                        response.status(200)
                    }
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
            body: RequestBody,
            id: number,
            roles: string[]
        ) => Promise<CustomSetReturn<Element>> | CustomSetReturn<Element>
    ) {
        return async (request: Request, response: Response, _next: NextFunction): Promise<void> => {
            try {
                const sheet = await this.getSheet()
                if (!custom) {
                    await sheet.set(request.body)
                    response.status(200)
                } else {
                    const memberId = response?.locals?.jwt?.id || -1
                    const roles: string[] = response?.locals?.jwt?.roles || []
                    const list = (await sheet.getList()) || []
                    const { toDatabase, toCaller } = await custom(
                        list,
                        request.body,
                        memberId,
                        roles
                    )
                    if (toDatabase !== undefined) {
                        await sheet.set(toDatabase)
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
