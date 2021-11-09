import axios from "axios"

import config from "../config"

export class Envie {
    envieId = 0

    domaine = ""

    envies = ""

    precisions = ""

    equipes: string[] = []

    dateAjout = ""
}
export type EnvieWithoutId = Omit<Envie, "envieId">

export interface GetEnvieListResponse {
    data?: Envie[]
    error?: Error
}
export const getEnvieList = async (): Promise<GetEnvieListResponse> => {
    try {
        const { data } = await axios.get(`${config.API_URL}/GetEnvieList`)
        return { data }
    } catch (error) {
        return { error: error as Error }
    }
}

export interface AddEnvieResponse {
    data?: Envie
    error?: Error
}
export const addEnvie = async (envieWithoutId: EnvieWithoutId): Promise<AddEnvieResponse> => {
    try {
        const { data } = await axios.post(`${config.API_URL}/AddEnvie`, envieWithoutId)
        return { data }
    } catch (error) {
        return { error: error as Error }
    }
}
