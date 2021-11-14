import axios from "axios"

import config from "../config"

export class JeuJav {
    id = 0

    titre = ""

    auteur = ""

    editeur = ""

    minJoueurs = 0

    maxJoueurs = 0

    duree = 0

    type: "Ambiance" | "Famille" | "Expert" | "" = ""

    poufpaf = ""

    bggId = 0

    exemplaires = 1

    dispoPret = 0

    nonRangee = 0

    ean = ""

    bggPhoto = ""
}

export interface JeuJavListResponse {
    data?: JeuJav[]
    error?: Error
}
export const getJeuJavList = async (): Promise<JeuJavListResponse> => {
    try {
        const { data } = await axios.get(`${config.API_URL}/JeuJavListGet`)
        return { data }
    } catch (error) {
        return { error: error as Error }
    }
}

export interface JeuJavResponse {
    data?: JeuJav
    error?: Error
}
export const getJeuJavData = async (id: string): Promise<JeuJavResponse> => {
    try {
        const { data } = await axios.get(`${config.API_URL}/JeuJavGet`, { params: { id } })
        return { data }
    } catch (error) {
        return { error: error as Error }
    }
}
