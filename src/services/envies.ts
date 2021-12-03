import { get, listGet, add, set } from "./accessors"

export class Envie {
    id = 0

    domain = ""

    wish = ""

    details = ""

    teams: string[] = []

    addedDate = ""
}

export const translationEnvie: { [k in keyof Envie]: string } = {
    id: "id",
    domain: "domaine",
    wish: "envies",
    details: "precisions",
    teams: "equipes",
    addedDate: "dateAjout",
}

const elementName = "Envie"

export type EnvieWithoutId = Omit<Envie, "id">

export const envieGet = get<Envie>(elementName, translationEnvie)

export const envieListGet = listGet<Envie>(elementName, translationEnvie)

export const envieAdd = add<EnvieWithoutId, Envie>(elementName, translationEnvie)

export const envieSet = set<Envie>(elementName, translationEnvie)
