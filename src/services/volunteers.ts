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

    ok: number[] = []

    bof: number[] = []

    niet: number[] = []

    needsHosting = false

    canHostCount = 0

    distanceToFestival = 0

    hostingComment = ""
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
    ok: "OK",
    bof: "Bof",
    niet: "Niet",
    needsHosting: "besoinHébergement",
    canHostCount: "nombreHébergés",
    distanceToFestival: "distanceAuFestival",
    hostingComment: "commentaireHébergement",
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
    ok: [5, 7, 24, 26, 31, 38, 50, 52, 54, 58],
    bof: [9, 12, 16, 27, 34, 35, 36],
    niet: [13, 18, 19, 23, 47, 53, 59, 67],
    needsHosting: false,
    canHostCount: 0,
    distanceToFestival: 0,
    hostingComment: "",
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

export interface VolunteerHosting {
    id: Volunteer["id"]
    needsHosting: Volunteer["needsHosting"]
    canHostCount: Volunteer["canHostCount"]
    distanceToFestival: Volunteer["distanceToFestival"]
    hostingComment: Volunteer["hostingComment"]
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

export type VolunteerKnowledgeWithoutId = Omit<VolunteerKnowledge, "id">
export interface VolunteerKnowledge {
    id: Volunteer["id"]
    ok: Volunteer["ok"]
    bof: Volunteer["bof"]
    niet: Volunteer["niet"]
}
