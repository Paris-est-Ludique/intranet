import { get, listGet, add, set } from "./accessors"

export class Membre {
    id = 0

    lastname = ""

    firstname = ""

    email = ""

    mobile = ""

    photo = ""

    food = ""

    adult = 1

    privileges = 0

    active = 0

    comment = ""

    timestamp = ""

    password = ""
}

export const translationMember: { [k in keyof Membre]: string } = {
    id: "id",
    lastname: "nom",
    firstname: "prenom",
    email: "mail",
    mobile: "telephone",
    photo: "photo",
    food: "alimentation",
    adult: "majeur",
    privileges: "privilege",
    active: "actif",
    comment: "commentaire",
    timestamp: "horodatage",
    password: "passe",
}

const elementName = "Membre"

export const emailRegexp =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
export const passwordMinLength = 4

export interface MemberLogin {
    membre?: {
        firstname: string
    }
    jwt?: string
    error?: string
}

export type MembreWithoutId = Omit<Membre, "id">

export const membreGet = get<Membre>(elementName, translationMember)

export const membreListGet = listGet<Membre>(elementName, translationMember)

export const membreAdd = add<MembreWithoutId, Membre>(elementName, translationMember)

export const membreSet = set<Membre>(elementName, translationMember)
