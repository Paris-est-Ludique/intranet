import { get, listGet, add, set } from "./accessors"

export class Envie {
    id = 0

    domaine = ""

    envies = ""

    precisions = ""

    equipes: string[] = []

    dateAjout = ""
}

export type EnvieWithoutId = Omit<Envie, "id">

export const envieGet = get<Envie>("Envie")

export const envieListGet = listGet<Envie>("Envie")

export const envieAdd = add<EnvieWithoutId, Envie>("Envie")

export const envieSet = set<Envie>("Envie")
