import getServiceAccessors from "./accessors"

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

const { listGet, get, set, add } = getServiceAccessors<WishWithoutId, Wish>(
    elementName,
    translationWish
)

export const wishListGet = listGet()
export const wishGet = get()
export const wishAdd = add()
export const wishSet = set()
