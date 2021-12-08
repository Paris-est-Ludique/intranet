import { get, listGet, add, set } from "./accessors"

export class Wish {
    id = 0

    domain = ""

    wish = ""

    details = ""

    teams: string[] = []

    addedDate = ""
}

export const translationWish: { [k in keyof Wish]: string } = {
    id: "id",
    domain: "domaine",
    wish: "wishes",
    details: "precisions",
    teams: "equipes",
    addedDate: "dateAjout",
}

const elementName = "Wish"

export type WishWithoutId = Omit<Wish, "id">

export const wishGet = get<Wish>(elementName, translationWish)

export const wishListGet = listGet<Wish>(elementName, translationWish)

export const wishAdd = add<WishWithoutId, Wish>(elementName, translationWish)

export const wishSet = set<Wish>(elementName, translationWish)
