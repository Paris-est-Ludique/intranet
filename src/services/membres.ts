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
export type MembreWithoutId = Omit<Membre, "id">

export interface MembreListGetResponse {
    data?: Membre[]
    error?: Error
}
export const membreListGet = async (): Promise<MembreListGetResponse> => {
    try {
        const { data } = await axios.get(`${config.API_URL}/MembreListGet`)
        return { data }
    } catch (error) {
        return { error: error as Error }
    }
}

export interface MembreGetResponse {
    data?: Membre
    error?: Error
}
export const membreGet = async (id: number): Promise<MembreGetResponse> => {
    try {
        const { data } = await axios.get(`${config.API_URL}/MembreGet`, { params: { id } })
        return { data }
    } catch (error) {
        return { error: error as Error }
    }
}

export interface MembreSetResponse {
    data?: Membre
    error?: Error
}
export const membreSet = async (membre: Membre): Promise<MembreSetResponse> => {
    try {
        const { data } = await axios.post(`${config.API_URL}/MembreSet`, membre)
        return { data }
    } catch (error) {
        return { error: error as Error }
    }
}

export interface MembreAddResponse {
    data?: Membre
    error?: Error
}
export const membreAdd = async (membreWithoutId: MembreWithoutId): Promise<MembreAddResponse> => {
    try {
        const { data } = await axios.post(`${config.API_URL}/MembreAdd`, membreWithoutId)
        return { data }
    } catch (error) {
        return { error: error as Error }
    }
}
