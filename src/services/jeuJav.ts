import axios from "axios"

import config from "../config"

export class JeuJav {
    jeuId = 0

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

export interface JeuJavList {
    data?: JeuJav[]
    error?: Error
}

export interface JeuJavData {
    data?: JeuJav
    error?: Error
}

export const getJeuJavList = async (): Promise<JeuJavList> => {
    try {
        const { data } = await axios.get(`${config.API_URL}/JeuJav`)
        return { data }
    } catch (error) {
        return { error: error as Error }
    }
}

export const getJeuJavData = async (id: string): Promise<JeuJavData> => {
    try {
        const { data } = await axios.get(`${config.API_URL}/users/${id}`)
        return { data }
    } catch (error) {
        return { error: error as Error }
    }
}
