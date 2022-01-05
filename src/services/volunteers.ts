import ServiceAccessors from "./accessors"

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

    created = new Date()

    password1 = ""

    password2 = ""
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
    created: "creation",
    password1: "passe1",
    password2: "passe2",
}

const elementName = "Volunteer"

export const emailRegexp =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
export const passwordMinLength = 4

export type VolunteerWithoutId = Omit<Volunteer, "id">

const serviceAccessors = new ServiceAccessors<VolunteerWithoutId, Volunteer>(elementName)

export const volunteerListGet = serviceAccessors.listGet()
export const volunteerGet = serviceAccessors.get()
export const volunteerAdd = serviceAccessors.add()
export const volunteerSet = serviceAccessors.set()

export interface VolunteerLogin {
    firstname: string
    jwt: string
}
export const volunteerLogin = serviceAccessors.customPost("Login")

export interface VolunteerForgot {
    message: string
}
export const volunteerForgot = serviceAccessors.customPost("Forgot")
