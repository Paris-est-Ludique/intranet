import axios from "axios"

import config from "../config"

export class Membre {
    id = 0

    nom = ""

    prenom = ""

    mail = ""

    telephone = ""

    photo = ""

    alimentation = ""

    majeur = 1

    privilege = 0

    actif = 0

    commentaire = ""

    horodatage = ""

    passe = ""
}
export type MembreWithoutId = Omit<Membre, "membreId">

export interface GetMembreListResponse {
    data?: Membre[]
    error?: Error
}
export const getMembreList = async (): Promise<GetMembreListResponse> => {
    try {
        const { data } = await axios.get(`${config.API_URL}/GetMembreList`)
        return { data }
    } catch (error) {
        return { error: error as Error }
    }
}

export interface GetMembreResponse {
    data?: Membre
    error?: Error
}
export const getMembre = async (id: number): Promise<GetMembreResponse> => {
    try {
        const { data } = await axios.get(`${config.API_URL}/GetMembre`, { params: { id } })
        return { data }
    } catch (error) {
        return { error: error as Error }
    }
}

export interface AddMembreResponse {
    data?: Membre
    error?: Error
}
export const addMembre = async (membreWithoutId: MembreWithoutId): Promise<AddMembreResponse> => {
    try {
        const { data } = await axios.post(`${config.API_URL}/AddMembre`, membreWithoutId)
        return { data }
    } catch (error) {
        return { error: error as Error }
    }
}
