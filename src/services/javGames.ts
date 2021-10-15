import axios from "axios"

import config from "../config"

export interface JavGame {
    id: number
    titre: string
    auteur: string
    editeur: string
    minJoueurs: number
    maxJoueurs: number
    duree: number
    type: "Ambiance" | "Famille" | "Expert" | ""
    poufpaf: string
    photo: string
    bggPhoto: string
    bggId: number
    exemplaires: number // Defaults to 1
    dispoPret: number
    nonRangee: number
    horodatage: string
    ean: string
}

export interface JavGameList {
    data?: JavGame[]
    error?: Error
}

export interface JavGameData {
    data?: JavGame
    error?: Error
}

export const getJavGameList = async (): Promise<JavGameList> => {
    try {
        const { data } = await axios.get(`${config.API_URL}/javGames`)
        return { data }
    } catch (error) {
        return { error: error as Error }
    }
}

export const getJavGameData = async (id: string): Promise<JavGameData> => {
    try {
        const { data } = await axios.get(`${config.API_URL}/users/${id}`)
        return { data }
    } catch (error) {
        return { error: error as Error }
    }
}
