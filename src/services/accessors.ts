import axios from "axios"

import config from "../config"

export type ElementWithId = unknown & { id: number }

export function get<Element>(elementName: string): (id: number) => Promise<{
    data?: Element
    error?: Error
}> {
    interface ElementGetResponse {
        data?: Element
        error?: Error
    }
    return async (id: number): Promise<ElementGetResponse> => {
        try {
            const { data } = await axios.get(`${config.API_URL}/${elementName}Get`, {
                params: { id },
            })
            return { data }
        } catch (error) {
            return { error: error as Error }
        }
    }
}

export function listGet<Element>(elementName: string): () => Promise<{
    data?: Element[]
    error?: Error
}> {
    interface ElementListGetResponse {
        data?: Element[]
        error?: Error
    }
    return async (): Promise<ElementListGetResponse> => {
        try {
            const { data } = await axios.get(`${config.API_URL}/${elementName}ListGet`)
            return { data }
        } catch (error) {
            return { error: error as Error }
        }
    }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function add<ElementNoId extends object, Element extends ElementNoId & ElementWithId>(
    elementName: string
): (membreWithoutId: ElementNoId) => Promise<{
    data?: Element
    error?: Error
}> {
    interface ElementGetResponse {
        data?: Element
        error?: Error
    }
    return async (membreWithoutId: ElementNoId): Promise<ElementGetResponse> => {
        try {
            const { data } = await axios.post(
                `${config.API_URL}/${elementName}Add`,
                membreWithoutId
            )
            return { data }
        } catch (error) {
            return { error: error as Error }
        }
    }
}

export function set<Element>(elementName: string): (membre: Element) => Promise<{
    data?: Element
    error?: Error
}> {
    interface ElementGetResponse {
        data?: Element
        error?: Error
    }
    return async (membre: Element): Promise<ElementGetResponse> => {
        try {
            const { data } = await axios.post(`${config.API_URL}/${elementName}Set`, membre)
            return { data }
        } catch (error) {
            return { error: error as Error }
        }
    }
}
