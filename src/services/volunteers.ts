import { get, listGet, add, set } from "./accessors"

export class Volunteer {
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

export const translationMember: { [k in keyof Volunteer]: string } = {
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

const elementName = "Volunteer"

export const emailRegexp =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
export const passwordMinLength = 4

export interface MemberLogin {
    volunteer?: {
        firstname: string
    }
    jwt?: string
    error?: string
}

export type VolunteerWithoutId = Omit<Volunteer, "id">

export const volunteerGet = get<Volunteer>(elementName, translationMember)

export const volunteerListGet = listGet<Volunteer>(elementName, translationMember)

export const volunteerAdd = add<VolunteerWithoutId, Volunteer>(elementName, translationMember)

export const volunteerSet = set<Volunteer>(elementName, translationMember)
