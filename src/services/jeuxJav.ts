import { get, listGet, add, set } from "./accessors"

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

export type JeuJavWithoutId = Omit<JeuJav, "id">

export const jeuJavGet = get<JeuJav>("JeuJav")

export const jeuJavListGet = listGet<JeuJav>("JeuJav")

export const jeuJavAdd = add<JeuJavWithoutId, JeuJav>("JeuJav")

export const jeuJavSet = set<JeuJav>("JeuJav")
