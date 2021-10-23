import axios from "axios"

import config from "../config"

export class JeuxJav {
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
