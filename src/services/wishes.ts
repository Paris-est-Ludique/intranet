import ServiceAccessors from "./accessors"

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

const serviceAccessors = new ServiceAccessors<WishWithoutId, Wish>(elementName)

export const wishListGet = serviceAccessors.listGet()
export const wishGet = serviceAccessors.get()
export const wishAdd = serviceAccessors.add()
export const wishSet = serviceAccessors.set()
