import path from "path"
import * as fs from "fs"
import { assign, cloneDeep, map, max, omit, pick, some } from "lodash"
// import { assign, cloneDeep, max, omit, pick } from "lodash"
import bcrypt from "bcrypt"
import sgMail from "@sendgrid/mail"

import ExpressAccessors from "./expressAccessors"
import {
    Volunteer,
    VolunteerWithoutId,
    VolunteerLogin,
    VolunteerAsks,
    VolunteerTeamWishes,
    translationVolunteer,
    VolunteerDayWishes,
    VolunteerHosting,
    VolunteerMeals,
    VolunteerParticipationDetails,
    VolunteerTeamAssign,
    VolunteerKnowledge,
    VolunteerDetailedKnowledge,
    VolunteerPersonalInfo,
    VolunteerLoan,
    Contact,
} from "../../services/volunteers"
import { Team, TeamWithoutId, translationTeam } from "../../services/teams"
import { canonicalEmail, canonicalMobile, trim, validMobile } from "../../utils/standardization"
import { getJwt } from "../secure"
import { getUniqueNickname } from "./tools"
import { getSheet } from "./accessors"

const expressAccessor = new ExpressAccessors<VolunteerWithoutId, Volunteer>(
    "Volunteers",
    new Volunteer(),
    translationVolunteer
)

export const volunteerListGet = expressAccessor.get(async (list, _body, id) => {
    if (id <= 0) {
        throw Error(`L'accès est réservé aux utilisateurs identifiés`)
    }
    return list
})

export const volunteerAddNew = expressAccessor.add(async (list, _body, _id, roles) => {
    if (!roles.includes("admin")) {
        throw Error(`À moins d'être admin, on ne peut pas ajouter un bénévole`)
    }
    const id = (max(list.map((v) => v.id)) || 0) + 1
    const password = generatePassword()
    const passwordHash = await bcrypt.hash(password, 10)

    const newVolunteer: Volunteer = new Volunteer()
    newVolunteer.id = id
    newVolunteer.password1 = passwordHash
    newVolunteer.password2 = passwordHash
    newVolunteer.firstname = password

    return {
        toDatabase: newVolunteer,
        toCaller: newVolunteer,
    }
})

export const volunteerSet = expressAccessor.set(async (list, body, _id, roles) => {
    if (!roles.includes("admin")) {
        throw Error(`À moins d'être admin, on ne peut pas modifier n'importe quel bénévole`)
    }
    const newPartialVolunteer = body[0] as Partial<Record<keyof Volunteer, string>> & { id: number }
    const volunteer: Volunteer | undefined = list.find((v) => v.id === newPartialVolunteer.id)
    if (!volunteer) {
        throw Error(`Il n'y a aucun bénévole avec cet identifiant ${newPartialVolunteer.id}`)
    }
    const newVolunteer: Volunteer = cloneDeep(volunteer)

    const parsedPartialVolunteer = expressAccessor.parseRawPartialElement(newPartialVolunteer)
    if (parsedPartialVolunteer === undefined) {
        throw Error(`Erreur au parsing dans volunteerSet`)
    }

    assign(newVolunteer, parsedPartialVolunteer)

    return {
        toDatabase: newVolunteer,
        toCaller: newVolunteer,
    }
})

export const volunteerDiscordId = expressAccessor.get(async (list, body, id) => {
    const requestedId = +body[0] || id
    if (requestedId !== id && requestedId !== 0) {
        throw Error(`On ne peut acceder qu'à ses propres envies de jours`)
    }
    const volunteer = list.find((v) => v.id === requestedId)
    if (!volunteer) {
        throw Error(`Il n'y a aucun bénévole avec cet identifiant ${requestedId}`)
    }
    return pick(volunteer, "id", "discordId")
})

export const volunteerPartialAdd = expressAccessor.add(async (list, body) => {
    const params = body[0]
    const volunteer = getByEmail(list, params.email)
    if (volunteer) {
        throw Error(
            "Il y a déjà un bénévole avec cet email. Mieux vaut redemander un mot de passe si tu l'as oublié."
        )
    }
    if (!validMobile(params.mobile)) {
        throw Error("Numéro de téléphone invalide, contacter pierre.scelles@gmail.com")
    }

    const password = generatePassword()
    const passwordHash = await bcrypt.hash(password, 10)

    const newVolunteer = omit(new Volunteer(), "id")

    assign(newVolunteer, {
        lastname: trim(params.lastname),
        firstname: trim(params.firstname),
        email: trim(params.email),
        mobile: canonicalMobile(params.mobile),
        howToContact: trim(params.howToContact),
        canHelpBefore: trim(params.canHelpBefore),
        password1: passwordHash,
        password2: passwordHash,
    })

    await sendSignUpEmail(newVolunteer.email, password)

    return {
        toDatabase: newVolunteer,
        toCaller: {},
    }
})

async function sendSignUpEmail(email: string, password: string): Promise<void> {
    const apiKey = process.env.SENDGRID_API_KEY || null
    if (DEV || !apiKey) {
        console.error(`Fake sending signup email to ${email} with password ${password}`)
    } else {
        sgMail.setApiKey(apiKey)
        const msg = {
            to: email,
            from: "contact@parisestludique.fr",
            subject: "Accès au site des bénévoles de Paris est Ludique",
            text: `Ton inscription est bien enregistrée, l'aventure PeL peut commencer ! :)\nVoici ton mot de passe pour accéder au site des bénévoles où tu t'es inscrit.e : ${password}\nTu y trouveras notamment comment on communique entre bénévoles.\nBonne journée !\nPierre`,
            html: `Ton inscription est bien enregistrée, l'aventure PeL peut commencer ! :)<br />Voici ton mot de passe pour accéder au <a href="https://fo.parisestludique.fr/">site des bénévoles</a> : <strong>${password}</strong><br />Tu y trouveras notamment comment on communique entre bénévoles.<br />Bonne journée !<br />Pierre`,
        }
        await sgMail.send(msg)
    }
}

export const volunteerLogin = expressAccessor.get<VolunteerLogin>(async (list, bodyArray) => {
    const [body] = bodyArray
    const volunteer = getByEmail(list, body.email)

    if (!volunteer) {
        throw Error("Il n'y a aucun bénévole avec cet email")
    }

    // Try all password combinations with or without space after
    const password = body.password || ""
    const passwords: string[] = [
        password,
        `${password} `,
        password.replace(/ $/, ""),
        password.replace(/\s+ $/, ""),
        `${password.replace(/\s+ $/, "")} `,
    ]
    const toTry = [
        ...map(passwords, (p) => [p, volunteer.password1]),
        ...map(passwords, (p) => [p, volunteer.password2]),
    ] as [string, string][]
    const tries = await Promise.all(
        map(toTry, async ([p, save]) => bcrypt.compare(p, save.replace(/^\$2y/, "$2a")))
    )

    const noSuccessfulLogin = !some(tries)
    const isDevException = DEV && [1, 508].includes(volunteer.id) // Amélie and Tom E
    if (noSuccessfulLogin && !isDevException) {
        throw Error("Mauvais mot de passe pour cet email")
    }

    const jwt = await getJwt(volunteer.id, volunteer.roles)

    return {
        jwt,
        id: volunteer.id,
        roles: volunteer.roles,
    }
})

const lastForgot: { [id: string]: number } = {}
export const volunteerForgot = expressAccessor.set(async (list, bodyArray) => {
    const [body] = bodyArray
    const volunteer: Volunteer | undefined = getByEmail(list, body.email)
    if (!volunteer) {
        throw Error("Il n'y a aucun bénévole avec cet email")
    }
    const newVolunteer: Volunteer = cloneDeep(volunteer)

    const now = +new Date()
    const timeSinceLastSent = now - lastForgot[volunteer.id]
    if (timeSinceLastSent < 2 * 60 * 1000) {
        throw Error(
            "Un email t'a déjà été envoyé avec un nouveau mot de passe. Es-tu sûr qu'il n'est pas dans tes spams ?"
        )
    }
    lastForgot[volunteer.id] = now

    const password = generatePassword()
    const passwordHash = await bcrypt.hash(password, 10)
    newVolunteer.password2 = passwordHash

    await sendForgetEmail(volunteer.email, password)

    return {
        toDatabase: newVolunteer,
        toCaller: {
            message: `Un nouveau mot de passe t'a été envoyé par email. Regarde bien dans les spams, il pourrait y être ><`,
        },
    }
})

function generatePassword(): string {
    const s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    return Array(16)
        .join()
        .split(",")
        .map(() => s.charAt(Math.floor(Math.random() * s.length)))
        .join("")
}

async function sendForgetEmail(email: string, password: string): Promise<void> {
    const apiKey = process.env.SENDGRID_API_KEY || null
    if (DEV || !apiKey) {
        console.error(`Fake sending forget email to ${email} with password ${password}`)
    } else {
        sgMail.setApiKey(apiKey)
        const msg = {
            to: email,
            from: "contact@parisestludique.fr",
            subject: "Nouveau mot de passe pour le site bénévole de Paris est Ludique",
            text: `Voici le nouveau mot de passe : ${password}\nPour te connecter à https://fo.parisestludique.fr`,
            html: `Voici le nouveau mot de passe : <strong>${password}</strong>\nPour te connecter à <a href="https://fo.parisestludique.fr">https://fo.parisestludique.fr</a>`,
        }
        await sgMail.send(msg)
    }
}

export const volunteerAsksSet = expressAccessor.set(async (list, body, id) => {
    const requestedId = +body[0] || id
    if (requestedId !== id && requestedId !== 0) {
        throw Error(`On ne peut acceder qu'à ses propres questions`)
    }
    const notifChanges = body[1]
    const volunteer: Volunteer | undefined = list.find((v) => v.id === requestedId)
    if (!volunteer) {
        throw Error(`Il n'y a aucun bénévole avec cet identifiant ${requestedId}`)
    }
    const newVolunteer: Volunteer = cloneDeep(volunteer)

    if (notifChanges.hiddenAsks !== undefined) newVolunteer.hiddenAsks = notifChanges.hiddenAsks
    if (notifChanges.acceptsNotifs !== undefined)
        newVolunteer.acceptsNotifs = notifChanges.acceptsNotifs

    return {
        toDatabase: newVolunteer,
        toCaller: {
            id: newVolunteer.id,
            firstname: newVolunteer.firstname,
            hiddenAsks: newVolunteer.hiddenAsks,
            acceptsNotifs: newVolunteer.acceptsNotifs,
        } as VolunteerAsks,
    }
})

export const volunteerTeamWishesSet = expressAccessor.set(async (list, body, id, roles) => {
    const requestedId = +body[0] || id
    if (requestedId !== id && requestedId !== 0 && !roles.includes("repartiteur")) {
        throw Error(
            `À moins d'être répartiteur de bénévole dans les équipes, on ne peut acceder qu'à ses propres envies d'équipes`
        )
    }
    const wishes = body[1] as VolunteerTeamWishes
    const volunteer: Volunteer | undefined = list.find((v) => v.id === requestedId)
    if (!volunteer) {
        throw Error(`Il n'y a aucun bénévole avec cet identifiant ${requestedId}`)
    }
    const newVolunteer: Volunteer = cloneDeep(volunteer)

    if (wishes.teamWishes !== undefined) {
        newVolunteer.teamWishes = wishes.teamWishes
    }
    if (wishes.teamWishesComment !== undefined) {
        newVolunteer.teamWishesComment = wishes.teamWishesComment
    }

    return {
        toDatabase: newVolunteer,
        toCaller: {
            id: newVolunteer.id,
            teamWishes: newVolunteer.teamWishes,
            teamWishesComment: newVolunteer.teamWishesComment,
        } as VolunteerTeamWishes,
    }
})

export const volunteerDayWishesSet = expressAccessor.set(async (list, body, id) => {
    const requestedId = +body[0] || id
    if (requestedId !== id && requestedId !== 0) {
        throw Error(`On ne peut acceder qu'à ses propres envies de jours`)
    }
    const wishes = body[1] as VolunteerDayWishes
    const volunteer: Volunteer | undefined = list.find((v) => v.id === requestedId)
    if (!volunteer) {
        throw Error(`Il n'y a aucun bénévole avec cet identifiant ${requestedId}`)
    }
    const newVolunteer: Volunteer = cloneDeep(volunteer)

    if (wishes.charter !== undefined) {
        newVolunteer.charter = wishes.charter
        if (!newVolunteer.charter) {
            wishes.active = "non"
        }
    }
    if (wishes.active !== undefined) {
        if (!newVolunteer.charter && wishes.active === "oui") {
            throw Error(`La charte doit être acceptée pour pouvoir devenir membre`)
        }
        newVolunteer.active = wishes.active
    }
    if (wishes.dayWishes !== undefined) {
        newVolunteer.dayWishes = wishes.dayWishes
    }
    if (wishes.dayWishesComment !== undefined) {
        newVolunteer.dayWishesComment = wishes.dayWishesComment
    }

    return {
        toDatabase: newVolunteer,
        toCaller: {
            id: newVolunteer.id,
            charter: newVolunteer.charter,
            active: newVolunteer.active,
            dayWishes: newVolunteer.dayWishes,
            dayWishesComment: newVolunteer.dayWishesComment,
        } as VolunteerDayWishes,
    }
})

export const volunteerHostingSet = expressAccessor.set(async (list, body, id) => {
    const requestedId = +body[0] || id
    if (requestedId !== id && requestedId !== 0) {
        throw Error(`On ne peut acceder qu'à ses propres infos d'hébergement`)
    }
    const wishes = body[1] as VolunteerHosting
    const volunteer: Volunteer | undefined = list.find((v) => v.id === requestedId)
    if (!volunteer) {
        throw Error(`Il n'y a aucun bénévole avec cet identifiant ${requestedId}`)
    }
    const newVolunteer: Volunteer = cloneDeep(volunteer)

    if (wishes.hostingType !== undefined) {
        newVolunteer.hostingType = wishes.hostingType
    }
    if (wishes.canHostCount !== undefined) {
        newVolunteer.canHostCount = wishes.canHostCount
    }
    if (wishes.cohostVolunteer !== undefined) {
        newVolunteer.cohostVolunteer = wishes.cohostVolunteer
    }
    if (wishes.backProblems !== undefined) {
        newVolunteer.backProblems = wishes.backProblems
    }
    if (wishes.hostingNights !== undefined) {
        newVolunteer.hostingNights = wishes.hostingNights
    }
    if (wishes.bedType !== undefined) {
        newVolunteer.bedType = wishes.bedType
    }
    if (wishes.isolatedBed !== undefined) {
        newVolunteer.isolatedBed = wishes.isolatedBed
    }
    if (wishes.bedConfiguration !== undefined) {
        newVolunteer.bedConfiguration = wishes.bedConfiguration
    }
    if (wishes.hostAddress !== undefined) {
        newVolunteer.hostAddress = wishes.hostAddress
    }
    if (wishes.petAllergies !== undefined) {
        newVolunteer.petAllergies = wishes.petAllergies
    }
    if (wishes.transportType !== undefined) {
        newVolunteer.transportType = wishes.transportType
    }
    if (wishes.festivalProximity !== undefined) {
        newVolunteer.festivalProximity = wishes.festivalProximity
    }
    if (wishes.distanceToFestival !== undefined) {
        newVolunteer.distanceToFestival = wishes.distanceToFestival
    }
    if (wishes.hostingNeedReason !== undefined) {
        newVolunteer.hostingNeedReason = wishes.hostingNeedReason
    }
    if (wishes.hostingAbsoluteNeed !== undefined) {
        newVolunteer.hostingAbsoluteNeed = wishes.hostingAbsoluteNeed
    }

    return {
        toDatabase: newVolunteer,
        toCaller: {
            id: newVolunteer.id,
            hostingType: newVolunteer.hostingType,
            canHostCount: newVolunteer.canHostCount,
            cohostVolunteer: newVolunteer.cohostVolunteer,
            backProblems: newVolunteer.backProblems,
            hostingNights: newVolunteer.hostingNights,
            bedType: newVolunteer.bedType,
            isolatedBed: newVolunteer.isolatedBed,
            bedConfiguration: newVolunteer.bedConfiguration,
            hostAddress: newVolunteer.hostAddress,
            petAllergies: newVolunteer.petAllergies,
            transportType: newVolunteer.transportType,
            festivalProximity: newVolunteer.festivalProximity,
            distanceToFestival: newVolunteer.distanceToFestival,
            hostingNeedReason: newVolunteer.hostingNeedReason,
            hostingAbsoluteNeed: newVolunteer.hostingAbsoluteNeed,
        } as VolunteerHosting,
    }
})

export const volunteerPersonalInfoSet = expressAccessor.set(async (list, body, id) => {
    const requestedId = +body[0] || id
    if (requestedId !== id && requestedId !== 0) {
        throw Error(`On ne peut acceder qu'à ses propres infos d'hébergement`)
    }
    const wishes = body[1] as VolunteerPersonalInfo
    const volunteer: Volunteer | undefined = list.find((v) => v.id === requestedId)
    if (!volunteer) {
        throw Error(`Il n'y a aucun bénévole avec cet identifiant ${requestedId}`)
    }
    const newVolunteer: Volunteer = cloneDeep(volunteer)

    if (wishes.firstname !== undefined) {
        newVolunteer.firstname = wishes.firstname
    }
    if (wishes.lastname !== undefined) {
        newVolunteer.lastname = wishes.lastname
    }
    if (wishes.photo !== undefined) {
        const filename = setNewPhoto(
            requestedId,
            wishes.photo,
            /^[0-9]/.test(volunteer.photo) ? volunteer.photo : undefined
        )
        newVolunteer.photo = filename
    }

    return {
        toDatabase: newVolunteer,
        toCaller: {
            id: newVolunteer.id,
            firstname: newVolunteer.firstname,
            lastname: newVolunteer.lastname,
            photo: newVolunteer.photo,
        } as VolunteerPersonalInfo,
    }
})

function setNewPhoto(id: number, photoData: string, prevFilename: string | undefined): string {
    const matches = photoData.match(/^data:.+\/([a-z0-9]+);base64,(.*)$/)
    if (!matches) {
        throw Error("Not image data ><")
    }
    const ext = matches[1]
    const base64Data = matches[2]
    const buffer = Buffer.from(base64Data, "base64")
    const filename = `${id}.${ext}`
    const filePath = path.resolve(process.cwd(), `public/photos/${filename}`)
    //  TODO move picture in cloud storage
    if (prevFilename) {
        const prevFilePath = path.resolve(process.cwd(), `public/photos/${prevFilename}`)
        fs.unlinkSync(prevFilePath)
    }
    fs.writeFileSync(filePath, buffer)
    return filename
}

export const volunteerMealsSet = expressAccessor.set(async (list, body, id) => {
    const requestedId = +body[0] || id
    if (requestedId !== id && requestedId !== 0) {
        throw Error(`On ne peut acceder qu'à ses propres repas`)
    }
    const wishes = body[1] as VolunteerMeals
    const volunteer: Volunteer | undefined = list.find((v) => v.id === requestedId)
    if (!volunteer) {
        throw Error(`Il n'y a aucun bénévole avec cet identifiant ${requestedId}`)
    }
    const newVolunteer: Volunteer = cloneDeep(volunteer)

    if (wishes.meals !== undefined) {
        newVolunteer.meals = wishes.meals
    }

    if (wishes.food !== undefined) {
        newVolunteer.food = wishes.food
    }

    return {
        toDatabase: newVolunteer,
        toCaller: {
            id: newVolunteer.id,
            meals: newVolunteer.meals,
            food: newVolunteer.food,
        } as VolunteerMeals,
    }
})
export const volunteerParticipationDetailsSet = expressAccessor.set(async (list, body, id) => {
    const requestedId = +body[0] || id
    if (requestedId !== id && requestedId !== 0) {
        throw Error(`On ne peut acceder qu'à ses propres infos de t-shirt et de majorité`)
    }
    const wishes = body[1] as VolunteerParticipationDetails
    const volunteer: Volunteer | undefined = list.find((v) => v.id === requestedId)
    if (!volunteer) {
        throw Error(`Il n'y a aucun bénévole avec cet identifiant ${requestedId}`)
    }
    const newVolunteer: Volunteer = cloneDeep(volunteer)

    if (wishes.tshirtSize !== undefined) {
        newVolunteer.tshirtSize = wishes.tshirtSize
    }
    if (wishes.adult !== undefined) {
        newVolunteer.adult = wishes.adult
    }

    return {
        toDatabase: newVolunteer,
        toCaller: {
            id: newVolunteer.id,
            tshirtSize: newVolunteer.tshirtSize,
            adult: newVolunteer.adult,
        } as VolunteerParticipationDetails,
    }
})

export const volunteerTeamAssignSet = expressAccessor.set(async (list, body, _id, roles) => {
    if (!roles.includes("répartiteur")) {
        throw Error(`Vous n'avez pas les droits pas assigner les équipes.`)
    }

    const teamAssign = body[1] as VolunteerTeamAssign
    const volunteer: Volunteer | undefined = list.find((v) => v.id === teamAssign.id)
    if (!volunteer) {
        throw Error(`Il n'y a aucun bénévole avec cet identifiant ${teamAssign.id}`)
    }
    const newVolunteer: Volunteer = cloneDeep(volunteer)
    newVolunteer.team = teamAssign.team

    return {
        toDatabase: newVolunteer,
        toCaller: {
            id: newVolunteer.id,
            team: newVolunteer.team,
        } as VolunteerTeamAssign,
    }
})

function getByEmail<T extends { email: string }>(list: T[], rawEmail: string): T | undefined {
    const email = canonicalEmail(rawEmail || "")
    return list.find((v) => canonicalEmail(v.email) === email)
}

export const volunteerKnowledgeSet = expressAccessor.set(async (list, body, id) => {
    const requestedId = +body[0] || id
    const volunteer: Volunteer | undefined = list.find((v) => v.id === requestedId)
    if (!volunteer) {
        throw Error(`Il n'y a aucun bénévole avec cet identifiant ${requestedId}`)
    }
    const knowledge = body[1] as VolunteerKnowledge
    const newVolunteer: Volunteer = cloneDeep(volunteer)
    if (knowledge?.ok !== undefined) newVolunteer.ok = knowledge.ok
    if (knowledge?.bof !== undefined) newVolunteer.bof = knowledge.bof
    if (knowledge?.niet !== undefined) newVolunteer.niet = knowledge.niet

    return {
        toDatabase: newVolunteer,
        toCaller: {
            id: newVolunteer.id,
            ok: newVolunteer.ok,
            bof: newVolunteer.bof,
            niet: newVolunteer.niet,
        } as VolunteerKnowledge,
    }
})

export const volunteerDetailedKnowledgeList = expressAccessor.get(async (list) => {
    const volunteerList = list.filter((v) => v.team === 2)

    return volunteerList.map((volunteer) => {
        const nickname = getUniqueNickname(volunteerList, volunteer)

        return {
            id: volunteer.id,
            nickname,
            ok: volunteer.ok,
            bof: volunteer.bof,
            niet: volunteer.niet,
            dayWishes: volunteer.dayWishes,
        } as VolunteerDetailedKnowledge
    })
})

export const volunteerLoanSet = expressAccessor.set(async (list, body, id) => {
    const requestedId = +body[0] || id
    const volunteer: Volunteer | undefined = list.find((v) => v.id === requestedId)
    if (!volunteer) {
        throw Error(`Il n'y a aucun bénévole avec cet identifiant ${requestedId}`)
    }
    const loan = body[1] as VolunteerLoan
    const newVolunteer: Volunteer = cloneDeep(volunteer)
    if (loan?.loanable !== undefined) newVolunteer.loanable = loan.loanable
    if (loan?.playable !== undefined) newVolunteer.playable = loan.playable
    if (loan?.giftable !== undefined) newVolunteer.giftable = loan.giftable
    if (loan?.noOpinion !== undefined) newVolunteer.noOpinion = loan.noOpinion

    return {
        toDatabase: newVolunteer,
        toCaller: {
            id: newVolunteer.id,
            loanable: newVolunteer.loanable,
            playable: newVolunteer.playable,
            giftable: newVolunteer.giftable,
            noOpinion: newVolunteer.noOpinion,
        } as VolunteerLoan,
    }
})

export const volunteerOnSiteInfo = expressAccessor.get(async (list, body, id) => {
    const requestedId = +body[0] || id
    if (requestedId !== id && requestedId !== 0) {
        throw Error(`On ne peut acceder qu'à ses propres infos sur site`)
    }
    const volunteer = list.find((v) => v.id === requestedId)
    if (!volunteer) {
        throw Error(`Il n'y a aucun bénévole avec cet identifiant ${requestedId}`)
    }

    const teamSheet = await getSheet<TeamWithoutId, Team>("Teams", new Team(), translationTeam)
    const teamList = await teamSheet.getList()
    if (!teamList) {
        throw Error("Unable to load teams")
    }
    const team = teamList.find((v) => v.id === volunteer.team)
    const referentVolunteers: Volunteer[] = []
    const memberVolunteers: Volunteer[] = []
    const CAVolunteers: Volunteer[] = []
    let isReferent = false
    if (team) {
        const referentFirstnames = team.referentFirstnames.split(/\s*(,|ou|et)\s*/)
        referentFirstnames.forEach((firstname) => {
            const referent = list.find(
                (v) =>
                    v.team === volunteer.team &&
                    v.firstname === firstname &&
                    v.roles.includes("référent")
            )
            if (referent) {
                referentVolunteers.push(referent)
                isReferent ||= referent.id === requestedId
            }
        })

        memberVolunteers.push(
            ...list.filter(
                (v) =>
                    v.team === volunteer.team &&
                    !v.roles.includes("référent") &&
                    v.id !== requestedId
            )
        )

        const pilotFirstnames = team.CAPilots.split(/,\s+/)
        pilotFirstnames.forEach((name) => {
            addContactFromName(CAVolunteers, list, name)
        })
    }

    const referents: Contact[] = volunteersToContacts(referentVolunteers)

    const showMembers = isReferent || memberVolunteers.length <= 10
    const members: Contact[] = showMembers ? volunteersToContacts(memberVolunteers) : []

    const CAPilots: Contact[] = volunteersToContacts(CAVolunteers)

    return { ...pick(volunteer, "id", "team"), referents, isReferent, CAPilots, members }
})

function volunteersToContacts(volunteers: Volunteer[]): Contact[] {
    return volunteers.map((v) => volunteerToContact(v, volunteers))
}

function addContactFromName(dest: Volunteer[], list: Volunteer[], name: string): void {
    const firstname = name.split(/\s+/)[0]
    const lastname = name.split(/\s+/)[1]
    const volunteer = list.find((v) => v.firstname === firstname && v.lastname === lastname)
    if (volunteer) {
        dest.push(volunteer)
    }
}

function volunteerToContact(volunteer: Volunteer, list?: Volunteer[]): Contact {
    const firstname = list ? getUniqueNickname(list, volunteer) : volunteer.firstname
    return { ...pick(volunteer, "mobile"), firstname }
}
