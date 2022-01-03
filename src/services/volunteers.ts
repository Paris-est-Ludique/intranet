import getServiceAccessors from "./accessors"

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

    timestamp = new Date()

    password = ""
}

export const translationVolunteer: { [k in keyof Volunteer]: string } = {
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

export type VolunteerWithoutId = Omit<Volunteer, "id">

const accessors = getServiceAccessors<VolunteerWithoutId, Volunteer>(elementName)
const { listGet, get, set, add } = accessors

export const volunteerListGet = listGet()
export const volunteerGet = get()
export const volunteerAdd = add()
export const volunteerSet = set()

export interface VolunteerLogin {
    firstname: string
    jwt: string
}
export const volunteerLogin = accessors.customPost("Login")
