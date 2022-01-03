import axios from "axios"

import config from "../config"
import { axiosConfig } from "./auth"

export type ElementWithId = unknown & { id: number }

export type ElementTranslation<Element> = { [k in keyof Element]: string }

export default function getServiceAccessors<
    // eslint-disable-next-line @typescript-eslint/ban-types
    ElementNoId extends object,
    Element extends ElementNoId & ElementWithId
>(elementName: string): any {
    function get(): (id: number) => Promise<{
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
                    ...axiosConfig,
                    params: { id },
                })
                return { data }
            } catch (error) {
                return { error: error as Error }
            }
        }
    }

    function listGet(): () => Promise<{
        data?: Element[]
        error?: Error
    }> {
        interface ElementListGetResponse {
            data?: Element[]
            error?: Error
        }
        return async (): Promise<ElementListGetResponse> => {
            try {
                const { data } = await axios.get(
                    `${config.API_URL}/${elementName}ListGet`,
                    axiosConfig
                )
                return { data }
            } catch (error) {
                return { error: error as Error }
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    function add(): (volunteerWithoutId: ElementNoId) => Promise<{
        data?: Element
        error?: Error
    }> {
        interface ElementGetResponse {
            data?: Element
            error?: Error
        }
        return async (volunteerWithoutId: ElementNoId): Promise<ElementGetResponse> => {
            try {
                const { data } = await axios.post(
                    `${config.API_URL}/${elementName}Add`,
                    volunteerWithoutId,
                    axiosConfig
                )
                return { data }
            } catch (error) {
                return { error: error as Error }
            }
        }
    }

    function set(): (volunteer: Element) => Promise<{
        data?: Element
        error?: Error
    }> {
        interface ElementGetResponse {
            data?: Element
            error?: Error
        }
        return async (volunteer: Element): Promise<ElementGetResponse> => {
            try {
                const { data } = await axios.post(
                    `${config.API_URL}/${elementName}Set`,
                    volunteer,
                    axiosConfig
                )
                return { data }
            } catch (error) {
                return { error: error as Error }
            }
        }
    }

    function countGet(): () => Promise<{
        data?: number
        error?: Error
    }> {
        interface ElementCountGetResponse {
            data?: number
            error?: Error
        }
        return async (): Promise<ElementCountGetResponse> => {
            try {
                const { data } = await axios.get(
                    `${config.API_URL}/${elementName}CountGet`,
                    axiosConfig
                )
                return { data }
            } catch (error) {
                return { error: error as Error }
            }
        }
    }

    function customPost(apiName: string): (params: any) => Promise<{
        data?: Element
        error?: Error
    }> {
        interface ElementGetResponse {
            data?: Element
            error?: Error
        }
        return async (params: any): Promise<ElementGetResponse> => {
            try {
                const { data } = await axios.post(
                    `${config.API_URL}/${elementName}${apiName}`,
                    params,
                    axiosConfig
                )
                if (data.error) {
                    throw Error(data.error)
                }
                return { data }
            } catch (error) {
                return { error: error as Error }
            }
        }
    }

    return { listGet, get, set, add, countGet, customPost }
}
