import axios from "axios"
import _ from "lodash"

import config from "../config"
import { axiosConfig } from "./auth"

export type ElementWithId = unknown & { id: number }

export type ElementTranslation = { [englishProp: string]: string }

export function get<Element>(
    elementName: string,
    translation: ElementTranslation
): (id: number) => Promise<{
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

export function listGet<Element>(
    elementName: string,
    translation: ElementTranslation
): () => Promise<{
    data?: Element[]
    error?: Error
}> {
    interface ElementListGetResponse {
        data?: Element[]
        error?: Error
    }
    return async (): Promise<ElementListGetResponse> => {
        try {
            const { data } = await axios.get(`${config.API_URL}/${elementName}ListGet`, axiosConfig)
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
export function add<ElementNoId extends object, Element extends ElementNoId & ElementWithId>(
    elementName: string,
    translation: ElementTranslation
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
            const invertedTranslationWithoutId = _.invert(_.omit(translation, "id"))
            const frenchDataWithoutId = _.mapValues(
                invertedTranslationWithoutId,
                (englishProp: string, _frenchProp: string) => (membreWithoutId as any)[englishProp]
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

export function set<Element>(
    elementName: string,
    translation: ElementTranslation
): (membre: Element) => Promise<{
    data?: Element
    error?: Error
}> {
    interface ElementGetResponse {
        data?: Element
        error?: Error
    }
    return async (membre: Element): Promise<ElementGetResponse> => {
        try {
            const invertedTranslation = _.invert(translation)
            const frenchData = _.mapValues(
                invertedTranslation,
                (englishProp: string) => (membre as any)[englishProp]
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
