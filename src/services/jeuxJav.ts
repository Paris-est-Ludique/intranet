import axios from "axios"

import config from "../config"

export interface JeuxJav {
    id: number
    titre: string
    auteur: string
    editeur: string
    minJoueurs: number
    maxJoueurs: number
    duree: number
    type: "Ambiance" | "Famille" | "Expert" | ""
    poufpaf: string
    bggId: number
    exemplaires: number // Defaults to 1
    dispoPret: number
    nonRangee: number
    ean: string
    bggPhoto: string
}

export interface JeuxJavList {
    data?: JeuxJav[]
    error?: Error
}

export interface JeuxJavData {
    data?: JeuxJav
    error?: Error
}

export const getJeuxJavList = async (): Promise<JeuxJavList> => {
    try {
        const { data } = await axios.get(`${config.API_URL}/JeuxJav`)
        return { data }
    } catch (error) {
        return { error: error as Error }
    }
}

export const getJeuxJavData = async (id: string): Promise<JeuxJavData> => {
    try {
        const { data } = await axios.get(`${config.API_URL}/users/${id}`)
        return { data }
    } catch (error) {
        return { error: error as Error }
    }
}
