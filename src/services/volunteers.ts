export class Volunteer {
    id = 0

    lastname = ""

    firstname = ""

    email = ""

    mobile = ""

    photo = ""

    adult = 1

    roles: string[] = []

    active = ""

    discordId = ""

    dayWishes: string[] = []

    dayWishesComment = ""

    age = 0

    teeshirtSize = ""

    food = ""

    teamWishes: number[] = []

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
    adult: "majeur",
    roles: "roles",
    active: "actif",
    discordId: "discordId",
    dayWishes: "enviesJours",
    dayWishesComment: "commentaireEnviesJours",
    age: "age",
    teeshirtSize: "teeshirt",
    food: "alimentation",
    teamWishes: "enviesEquipe",
    teamWishesComment: "commentaireEnviesEquipe",
    hiddenNotifs: "notifsCachees",
    created: "creation",
    password1: "passe1",
    password2: "passe2",
    pushNotifSubscription: "pushNotifSubscription",
    acceptsNotifs: "accepteLesNotifs",
}

export const elementName = "Volunteer"

export const volunteerExample: Volunteer = {
    id: 1,
    firstname: "Aupeix",
    lastname: "Amélie",
    email: "pakouille.lakouille@yahoo.fr",
    mobile: "0675650392",
    photo: "images/volunteers/$taille/amélie_aupeix.jpg",
    adult: 1,
    roles: [],
    active: "inconnu",
    discordId: "",
    dayWishes: [],
    dayWishesComment: "",
    age: 33,
    teeshirtSize: "FM",
    food: "Végétarien",
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

export interface VolunteerLogin {
    jwt: string
    id: number
    roles: string[]
}

export interface VolunteerForgot {
    message: string
}

export interface VolunteerNotifs {
    id: Volunteer["id"]
    firstname: Volunteer["firstname"]
    adult: Volunteer["adult"]
    active: Volunteer["active"]
    hiddenNotifs: Volunteer["hiddenNotifs"]
    pushNotifSubscription: Volunteer["pushNotifSubscription"]
    acceptsNotifs: Volunteer["acceptsNotifs"]
}

export interface VolunteerTeamWishes {
    id: Volunteer["id"]
    teamWishes: Volunteer["teamWishes"]
    teamWishesComment: Volunteer["teamWishesComment"]
}

export interface VolunteerDayWishes {
    id: Volunteer["id"]
    dayWishes: Volunteer["dayWishes"]
    dayWishesComment: Volunteer["dayWishesComment"]
}

export interface VolunteerParticipationDetails {
    id: Volunteer["id"]
    age: Volunteer["age"]
    teeshirtSize: Volunteer["teeshirtSize"]
    food: Volunteer["food"]
}
