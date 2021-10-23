import axios from "axios"

import config from "../config"

export class Envie {
    domaine = ""

    envies = ""

    precisions = ""

    equipes = []

    dateAjout = new Date(0)
}

export interface EnviesResponse {
    data?: Envie[]
    error?: Error
}
export const getEnvieList = async (): Promise<EnviesResponse> => {
    try {
        const { data } = await axios.get(`${config.API_URL}/GetList`)
        return { data }
    } catch (error) {
        return { error: error as Error }
    }
}
export const setEnvieList = async (list: Envie[]): Promise<EnviesResponse> => {
    try {
        const { data } = await axios.post(`${config.API_URL}/SetList`, list)
        return { data }
    } catch (error) {
        return { error: error as Error }
    }
}
