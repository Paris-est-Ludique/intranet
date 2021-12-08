import axios from "axios"
import _ from "lodash"

import config from "../config"
import { axiosConfig } from "./auth"

export type ElementWithId = unknown & { id: number }

export type ElementTranslation<Element> = { [k in keyof Element]: string }

export default function getServiceAccessors<
    // eslint-disable-next-line @typescript-eslint/ban-types
    ElementNoId extends object,
    Element extends ElementNoId & ElementWithId
>(elementName: string, translation: { [k in keyof Element]: string }): any {
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
                if (!data) {
                    return { data }
                }
                const englishData = _.mapValues(
                    translation,
                    (frenchProp: string) => data[frenchProp]
                ) as Element
                return { data: englishData }
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
                if (!data) {
                    return { data }
                }

                const englishDataList = data.map(
                    (frenchData: any) =>
                        _.mapValues(
                            translation,
                            (frenchProp: string) => frenchData[frenchProp]
                        ) as Element
                )
                return { data: englishDataList }
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
                const invertedTranslationWithoutId = _.invert(_.omit(translation, "id"))
                const frenchDataWithoutId = _.mapValues(
                    invertedTranslationWithoutId,
                    (englishProp: string, _frenchProp: string) =>
                        (volunteerWithoutId as any)[englishProp]
                )

                const { data } = await axios.post(
                    `${config.API_URL}/${elementName}Add`,
                    frenchDataWithoutId,
                    axiosConfig
                )
                if (!data) {
                    return { data }
                }

                const englishData = _.mapValues(
                    translation,
                    (frenchProp: string) => data[frenchProp]
                ) as Element
                return { data: englishData }
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
                const invertedTranslation = _.invert(translation)
                const frenchData = _.mapValues(
                    invertedTranslation,
                    (englishProp: string) => (volunteer as any)[englishProp]
                )

                const { data } = await axios.post(
                    `${config.API_URL}/${elementName}Set`,
                    frenchData,
                    axiosConfig
                )
                if (!data) {
                    return { data }
                }

                const englishData = _.mapValues(
                    translation,
                    (frenchProp: string) => data[frenchProp]
                ) as Element
                return { data: englishData }
            } catch (error) {
                return { error: error as Error }
            }
        }
    }

    return { listGet, get, set, add }
}
