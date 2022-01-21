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

    active = ""

    participingDays = []

    teamWishes: string[] = []

    teamWishComment = ""

    hiddenNotifs: number[] = []

    created = new Date()

    password1 = ""

    password2 = ""

    pushNotifSubscription = ""

    acceptsNotifs = ""
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
    participingDays: "joursPrésent",
    teamWishes: "enviesEquipe",
    teamWishComment: "commentaireEnviesEquipe",
    hiddenNotifs: "notifsCachees",
    created: "creation",
    password1: "passe1",
    password2: "passe2",
    pushNotifSubscription: "pushNotifSubscription",
    acceptsNotifs: "accepteLesNotifs",
}

const elementName = "Volunteer"

export const volunteerExample: Volunteer = {
    id: 1,
    firstname: "Aupeix",
    lastname: "Amélie",
    email: "pakouille.lakouille@yahoo.fr",
    mobile: "0675650392",
    photo: "images/volunteers/$taille/amélie_aupeix.jpg",
    food: "Végétarien",
    adult: 1,
    privileges: 0,
    active: "inconnu",
    participingDays: [],
    teamWishes: [],
    teamWishComment: "",
    hiddenNotifs: [],
    created: new Date(0),
    password1: "$2y$10$fSxY9AIuxSiEjwF.J3eXGubIxUPkdq9d5fqpbl8ASimSjNj4SR.9O",
    password2: "$2y$10$fSxY9AIuxSiEjwF.J3eXGubIxUPkdq9d5fqpbl8ASimSjNj4SR.9O",
    pushNotifSubscription: "",
    acceptsNotifs: "",
}

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
    id: number
    jwt: string
}
export const volunteerLogin =
    serviceAccessors.customPost<[{ email: string; password: string }]>("Login")

export interface VolunteerForgot {
    message: string
}
export const volunteerForgot = serviceAccessors.customPost<[{ email: string }]>("Forgot")

export interface VolunteerNotifs {
    id: number
    firstname: string
    adult: number
    active: string
    hiddenNotifs: number[]
    pushNotifSubscription: string
    acceptsNotifs: string
}
export const volunteerNotifsSet =
    serviceAccessors.securedCustomPost<[number, Partial<VolunteerNotifs>]>("NotifsSet")

export interface VolunteerTeamWishes {
    id: number
    teamWishes: string[]
    teamWishComment: string
}
export const volunteerTeamWishesSet =
    serviceAccessors.securedCustomPost<[number, Partial<VolunteerTeamWishes>]>("TeamWishesSet")
