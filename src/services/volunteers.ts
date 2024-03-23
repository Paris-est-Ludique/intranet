/* eslint-disable max-classes-per-file */
export class Volunteer implements VolunteerPartial {
    id = 0

    firstname = ""

    lastname = ""

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

    hiddenAsks: number[] = []

    created = new Date()

    password1 = ""

    password2 = ""

    acceptsNotifs = ""

    team2022 = 0

    ok: number[] = []

    bof: number[] = []

    niet: number[] = []

    loanable: number[] = []

    playable: number[] = []

    giftable: number[] = []

    noOpinion: number[] = []

    hostingType = ""

    canHostCount = 0

    cohostVolunteer = ""

    backProblems = false

    hostingNights = ""

    bedType: string[] = []

    isolatedBed = false

    bedConfiguration = ""

    hostAddress = ""

    petAllergies = ""

    transportType = ""

    festivalProximity = ""

    distanceToFestival = ""

    hostingNeedReason = ""

    hostingAbsoluteNeed = false

    meals: string[] = []

    charter = true
}

export const translationVolunteer: { [k in keyof Volunteer]: string } = {
    id: "id",
    firstname: "prenom",
    lastname: "nom",
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
    hiddenAsks: "questionsCachees",
    created: "creation",
    password1: "passe1",
    password2: "passe2",
    acceptsNotifs: "accepteLesNotifs",
    team2022: "équipe2022",
    ok: "OK",
    bof: "Bof",
    niet: "Niet",
    loanable: "empruntable",
    playable: "jouable",
    giftable: "offrable",
    noOpinion: "sansAvis",
    hostingType: "typeHébergement",
    canHostCount: "nombreHébergés",
    cohostVolunteer: "colocBénévole",
    backProblems: "malDeDos",
    hostingNights: "nuitsHébergé",
    bedType: "typeDeLit",
    isolatedBed: "litIsolé",
    bedConfiguration: "configurationLits",
    hostAddress: "adresseHebergement",
    petAllergies: "allergiesAnimaux",
    transportType: "typeTransport",
    festivalProximity: "proximitéAuFestival",
    distanceToFestival: "distanceAuFestival",
    hostingNeedReason: "reasonDêtreHebergé",
    hostingAbsoluteNeed: "besoinDhébergement",
    meals: "repas",
    charter: "charte",
}

export class VolunteerPartial {
    firstname = ""

    lastname = ""

    email = ""

    mobile = ""
}

export const elementName = "Volunteer"

export const volunteerExample: Volunteer = {
    id: 1,
    firstname: "Aupeix",
    lastname: "Amélie",
    email: "bidonmail@yahoo.fr",
    mobile: "0606060606",
    photo: "images/volunteers/$taille/amélie_aupeix.jpg",
    adult: 1,
    roles: [],
    active: "inconnu",
    discordId: "",
    dayWishes: [],
    dayWishesComment: "",
    tshirtCount: 1,
    tshirtSize: "Femme S",
    food: "Crudivore",
    team: 2,
    teamWishes: [],
    teamWishesComment: "",
    howToContact: "",
    canHelpBefore: "",
    hiddenAsks: [],
    created: new Date(0),
    password1: "$2y$10$fSxY9AIuxSiEjwF.J3eXGubIxUPkdq9d5fqpbl8ASimSjNj4SR.9O",
    password2: "$2y$10$fSxY9AIuxSiEjwF.J3eXGubIxUPkdq9d5fqpbl8ASimSjNj4SR.9O",
    acceptsNotifs: "",
    team2022: 0,
    ok: [5, 7, 24, 26, 31, 38, 50, 52, 54, 58],
    bof: [9, 12, 16, 27, 34, 35, 36],
    niet: [13, 18, 19, 23, 47, 53, 59, 67],
    loanable: [5, 7],
    playable: [34, 35, 36],
    giftable: [13, 67],
    noOpinion: [3, 4],
    hostingType: "neither",
    canHostCount: 0,
    cohostVolunteer: "",
    backProblems: false,
    hostingNights: "",
    bedType: [],
    isolatedBed: false,
    bedConfiguration: "",
    hostAddress: "",
    petAllergies: "",
    transportType: "",
    festivalProximity: "",
    distanceToFestival: "",
    hostingNeedReason: "",
    hostingAbsoluteNeed: true,
    meals: [],
    charter: false,
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
    acceptsNotifs: Volunteer["acceptsNotifs"]
}

export interface VolunteerTeamWishes {
    id: Volunteer["id"]
    teamWishes: Volunteer["teamWishes"]
    teamWishesComment: Volunteer["teamWishesComment"]
}

export interface VolunteerDayWishes {
    id: Volunteer["id"]
    charter: Volunteer["charter"]
    active: Volunteer["active"]
    dayWishes: Volunteer["dayWishes"]
    dayWishesComment: Volunteer["dayWishesComment"]
}

export interface VolunteerHosting {
    id: Volunteer["id"]
    hostingType: Volunteer["hostingType"]
    canHostCount: Volunteer["canHostCount"]
    cohostVolunteer: Volunteer["cohostVolunteer"]
    backProblems: Volunteer["backProblems"]
    hostingNights: Volunteer["hostingNights"]
    bedType: Volunteer["bedType"]
    isolatedBed: Volunteer["isolatedBed"]
    bedConfiguration: Volunteer["bedConfiguration"]
    hostAddress: Volunteer["hostAddress"]
    petAllergies: Volunteer["petAllergies"]
    transportType: Volunteer["transportType"]
    festivalProximity: Volunteer["festivalProximity"]
    distanceToFestival: Volunteer["distanceToFestival"]
    hostingNeedReason: Volunteer["hostingNeedReason"]
    hostingAbsoluteNeed: Volunteer["hostingAbsoluteNeed"]
}

export interface VolunteerMeals {
    id: Volunteer["id"]
    meals: Volunteer["meals"]
    food: Volunteer["food"]
}

export interface VolunteerParticipationDetails {
    id: Volunteer["id"]
    tshirtSize: Volunteer["tshirtSize"]
    adult: Volunteer["adult"]
}

export interface VolunteerPersonalInfo {
    id: Volunteer["id"]
    firstname: Volunteer["firstname"]
    lastname: Volunteer["lastname"]
    photo: string
}

export interface VolunteerTeamAssign {
    id: Volunteer["id"]
    team: Volunteer["team"]
}

export type VolunteerKnowledgeWithoutId = Omit<VolunteerKnowledge, "id">
export interface VolunteerKnowledge {
    id: Volunteer["id"]
    ok: Volunteer["ok"]
    bof: Volunteer["bof"]
    niet: Volunteer["niet"]
}

export type VolunteerDetailedKnowledgeWithoutId = Omit<VolunteerDetailedKnowledge, "id">
export interface VolunteerDetailedKnowledge {
    id: Volunteer["id"]
    nickname: string
    ok: Volunteer["ok"]
    bof: Volunteer["bof"]
    niet: Volunteer["niet"]
    dayWishes: Volunteer["dayWishes"]
}

export type VolunteerLoanWithoutId = Omit<VolunteerLoan, "id">
export interface VolunteerLoan {
    id: Volunteer["id"]
    loanable: Volunteer["loanable"]
    playable: Volunteer["playable"]
    giftable: Volunteer["giftable"]
    noOpinion: Volunteer["noOpinion"]
}

export type Contact = { firstname: string; mobile: string }
export type VolunteerOnSiteInfoWithoutId = Omit<VolunteerOnSiteInfo, "id">
export interface VolunteerOnSiteInfo {
    id: Volunteer["id"]
    team: Volunteer["team"]
    isReferent: boolean
    referentFirstnames: string
    referents: Contact[]
    CAPilots: Contact[]
    members: Contact[]
    orga: Contact[]
}
