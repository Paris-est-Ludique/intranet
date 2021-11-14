import axios from "axios"

import config from "../config"

export class Envie {
    id = 0

    domaine = ""

    envies = ""

    precisions = ""

    equipes: string[] = []

    dateAjout = ""
}
export type EnvieWithoutId = Omit<Envie, "id">

export interface EnvieListGetResponse {
    data?: Envie[]
    error?: Error
}
export const envieListGet = async (): Promise<EnvieListGetResponse> => {
    try {
        const { data } = await axios.get(`${config.API_URL}/EnvieListGet`)
        return { data }
    } catch (error) {
        return { error: error as Error }
    }
}

export interface EnvieAddResponse {
    data?: Envie
    error?: Error
}
export const envieAdd = async (envieWithoutId: EnvieWithoutId): Promise<EnvieAddResponse> => {
    try {
        const { data } = await axios.post(`${config.API_URL}/EnvieAdd`, envieWithoutId)
        return { data }
    } catch (error) {
        return { error: error as Error }
    }
}
