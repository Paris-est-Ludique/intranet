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

    dayWishes: string[] = []

    dayWishesComment = ""

    teamWishes: string[] = []

    teamWishesComment = ""

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
    dayWishes: "enviesJours",
    dayWishesComment: "commentaireEnviesJours",
    teamWishes: "enviesEquipe",
    teamWishesComment: "commentaireEnviesEquipe",
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
    dayWishes: [],
    dayWishesComment: "",
    teamWishes: [],
    teamWishesComment: "",
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
    id: Volunteer["id"]
    firstname: Volunteer["firstname"]
    adult: Volunteer["adult"]
    active: Volunteer["active"]
    hiddenNotifs: Volunteer["hiddenNotifs"]
    pushNotifSubscription: Volunteer["pushNotifSubscription"]
    acceptsNotifs: Volunteer["acceptsNotifs"]
}
export const volunteerNotifsSet =
    serviceAccessors.securedCustomPost<[number, Partial<VolunteerNotifs>]>("NotifsSet")

export interface VolunteerTeamWishes {
    id: Volunteer["id"]
    teamWishes: Volunteer["teamWishes"]
    teamWishesComment: Volunteer["teamWishesComment"]
}
export const volunteerTeamWishesSet =
    serviceAccessors.securedCustomPost<[number, Partial<VolunteerTeamWishes>]>("TeamWishesSet")

export interface VolunteerDayWishes {
    id: Volunteer["id"]
    dayWishes: Volunteer["dayWishes"]
    dayWishesComment: Volunteer["dayWishesComment"]
}
export const volunteerDayWishesSet =
    serviceAccessors.securedCustomPost<[number, Partial<VolunteerDayWishes>]>("DayWishesSet")
