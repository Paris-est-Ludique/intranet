import getServiceAccessors from "./accessors"

export class JavGame {
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

export const translationJavGame: { [k in keyof JavGame]: string } = {
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

const elementName = "JavGame"

export type JavGameWithoutId = Omit<JavGame, "id">

const { listGet, get, set, add } = getServiceAccessors<JavGameWithoutId, JavGame>(elementName)

export const javGameListGet = listGet()
export const javGameGet = get()
export const javGameAdd = add()
export const javGameSet = set()
