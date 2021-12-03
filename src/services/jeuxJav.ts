import { get, listGet, add, set } from "./accessors"

export class JeuJav {
    id = 0

    title = ""

    author = ""

    editor = ""

    playersMin = 0

    playersMax = 0

    duration = 0

    type: "Ambiance" | "Famille" | "Expert" | "" = ""

    poufpaf = ""

    bggId = 0

    copies = 1

    lendAvailability = 0

    notStored = 0

    ean = ""

    bggPhoto = ""
}

export const translationJeuJav: { [k in keyof JeuJav]: string } = {
    id: "id",
    title: "titre",
    author: "auteur",
    editor: "editeur",
    playersMin: "minJoueurs",
    playersMax: "maxJoueurs",
    duration: "duree",
    type: "type",
    poufpaf: "poufpaf",
    bggId: "bggId",
    copies: "exemplaires",
    lendAvailability: "dispoPret",
    notStored: "nonRangee",
    ean: "ean",
    bggPhoto: "bggPhoto",
}

const elementName = "JeuJav"

export type JeuJavWithoutId = Omit<JeuJav, "id">

export const jeuJavGet = get<JeuJav>(elementName, translationJeuJav)

export const jeuJavListGet = listGet<JeuJav>(elementName, translationJeuJav)

export const jeuJavAdd = add<JeuJavWithoutId, JeuJav>(elementName, translationJeuJav)

export const jeuJavSet = set<JeuJav>(elementName, translationJeuJav)
