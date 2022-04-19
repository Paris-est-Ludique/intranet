/* eslint-disable max-classes-per-file */
export class Volunteer implements VolunteerPartial {
    id = 0

    lastname = ""

    firstname = ""

    email = ""

    mobile = ""

    photo = "anonyme.png"

    adult = 1

    roles: string[] = []

    active = "inconnu"

    discordId = ""

    dayWishes: string[] = []

    dayWishesComment = ""

    tshirtCount = 0

    tshirtSize = ""

    food = "Aucune"

    team = 0

    teamWishes: number[] = []

    teamWishesComment = ""

    howToContact = ""

    canHelpBefore = ""

    pelMember = false

    hiddenAsks: number[] = []

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
    tshirtCount: "nbDeTshirts",
    tshirtSize: "tailleDeTshirts",
    food: "alimentation",
    team: "équipe",
    teamWishes: "enviesEquipe",
    teamWishesComment: "commentaireEnviesEquipe",
    howToContact: "commentContacter",
    canHelpBefore: "aideEnAmont",
    pelMember: "membrePel",
    hiddenAsks: "questionsCachees",
    created: "creation",
    password1: "passe1",
    password2: "passe2",
    pushNotifSubscription: "pushNotifSubscription",
    acceptsNotifs: "accepteLesNotifs",
}

export class VolunteerPartial {
    lastname = ""

    firstname = ""

    email = ""

    mobile = ""
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
    tshirtCount: 1,
    tshirtSize: "Femme M",
    food: "Végétarien",
    team: 2,
    teamWishes: [],
    teamWishesComment: "",
    howToContact: "",
    canHelpBefore: "",
    pelMember: false,
    hiddenAsks: [],
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

export interface VolunteerDiscordId {
    id: Volunteer["id"]
    discordId: Volunteer["discordId"]
}

export interface VolunteerAsks {
    id: Volunteer["id"]
    firstname: Volunteer["firstname"]
    adult: Volunteer["adult"]
    active: Volunteer["active"]
    hiddenAsks: Volunteer["hiddenAsks"]
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
    active: Volunteer["active"]
    dayWishes: Volunteer["dayWishes"]
    dayWishesComment: Volunteer["dayWishesComment"]
}

export interface VolunteerParticipationDetails {
    id: Volunteer["id"]
    tshirtSize: Volunteer["tshirtSize"]
    tshirtCount: Volunteer["tshirtCount"]
    adult: Volunteer["adult"]
    food: Volunteer["food"]
}

export interface VolunteerTeamAssign {
    id: Volunteer["id"]
    volunteer: number
    team: Volunteer["team"]
}
