import { assign, cloneDeep, max, omit, pick } from "lodash"
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
} from "../../services/volunteers"
import { canonicalEmail, canonicalMobile, trim, validMobile } from "../../utils/standardization"
import { getJwt } from "../secure"

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
        pelMember: params.pelMember === true,
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
    const apiKey = process.env.SENDGRID_API_KEY || ""
    if (__DEV__ || apiKey === "") {
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

    const password = body.password || ""
    const password1Match = await bcrypt.compare(
        password,
        volunteer.password1.replace(/^\$2y/, "$2a")
    )
    if (!password1Match) {
        const password2Match = await bcrypt.compare(
            password,
            volunteer.password2.replace(/^\$2y/, "$2a")
        )
        if (!password2Match) {
            throw Error("Mauvais mot de passe pour cet email")
        }
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
    const newVolunteer = cloneDeep(volunteer)

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
    const apiKey = process.env.SENDGRID_API_KEY || ""
    if (__DEV__ || apiKey === "") {
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
    const volunteer = list.find((v) => v.id === requestedId)
    if (!volunteer) {
        throw Error(`Il n'y a aucun bénévole avec cet identifiant ${requestedId}`)
    }
    const newVolunteer = cloneDeep(volunteer)

    if (notifChanges.hiddenAsks !== undefined) newVolunteer.hiddenAsks = notifChanges.hiddenAsks
    if (notifChanges.acceptsNotifs !== undefined)
        newVolunteer.acceptsNotifs = notifChanges.acceptsNotifs
    if (notifChanges.pushNotifSubscription !== undefined)
        newVolunteer.pushNotifSubscription = notifChanges.pushNotifSubscription

    return {
        toDatabase: newVolunteer,
        toCaller: {
            id: newVolunteer.id,
            firstname: newVolunteer.firstname,
            hiddenAsks: newVolunteer.hiddenAsks,
            pushNotifSubscription: newVolunteer.pushNotifSubscription,
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
    const newVolunteer = cloneDeep(volunteer)

    if (wishes.active !== undefined) {
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
    const newVolunteer = cloneDeep(volunteer)

    if (wishes.needsHosting !== undefined) {
        newVolunteer.needsHosting = wishes.needsHosting
    }
    if (wishes.canHostCount !== undefined) {
        newVolunteer.canHostCount = wishes.canHostCount
    }
    if (wishes.distanceToFestival !== undefined) {
        newVolunteer.distanceToFestival = wishes.distanceToFestival
    }
    if (wishes.hostingComment !== undefined) {
        newVolunteer.hostingComment = wishes.hostingComment
    }

    return {
        toDatabase: newVolunteer,
        toCaller: {
            id: newVolunteer.id,
            needsHosting: newVolunteer.needsHosting,
            canHostCount: newVolunteer.canHostCount,
            distanceToFestival: newVolunteer.distanceToFestival,
            hostingComment: newVolunteer.hostingComment,
        } as VolunteerHosting,
    }
})

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
    const newVolunteer = cloneDeep(volunteer)

    if (wishes.meals !== undefined) {
        newVolunteer.meals = wishes.meals
    }

    return {
        toDatabase: newVolunteer,
        toCaller: {
            id: newVolunteer.id,
            meals: newVolunteer.meals,
        } as VolunteerMeals,
    }
})
export const volunteerParticipationDetailsSet = expressAccessor.set(async (list, body, id) => {
    const requestedId = +body[0] || id
    if (requestedId !== id && requestedId !== 0) {
        throw Error(
            `On ne peut acceder qu'à ses propres infos de t-shirt, de majorité et d'alimentation`
        )
    }
    const wishes = body[1] as VolunteerParticipationDetails
    const volunteer = list.find((v) => v.id === requestedId)
    if (!volunteer) {
        throw Error(`Il n'y a aucun bénévole avec cet identifiant ${requestedId}`)
    }
    const newVolunteer = cloneDeep(volunteer)

    if (wishes.tshirtSize !== undefined) {
        newVolunteer.tshirtSize = wishes.tshirtSize
    }
    if (wishes.tshirtCount !== undefined) {
        newVolunteer.tshirtCount = wishes.tshirtCount
    }
    if (wishes.adult !== undefined) {
        newVolunteer.adult = wishes.adult
    }
    if (wishes.food !== undefined) {
        newVolunteer.food = wishes.food
    }

    return {
        toDatabase: newVolunteer,
        toCaller: {
            id: newVolunteer.id,
            tshirtSize: newVolunteer.tshirtSize,
            tshirtCount: newVolunteer.tshirtCount,
            adult: newVolunteer.adult,
            food: newVolunteer.food,
        } as VolunteerParticipationDetails,
    }
})

export const volunteerTeamAssignSet = expressAccessor.set(async (list, body, _id, roles) => {
    if (!roles.includes("répartiteur")) {
        throw Error(`Vous n'avez pas les droits pas assigner les équipes.`)
    }

    const teamAssign = body[1] as VolunteerTeamAssign
    const volunteer = list.find((v) => v.id === teamAssign.volunteer)
    if (!volunteer) {
        throw Error(`Il n'y a aucun bénévole avec cet identifiant ${teamAssign.volunteer}`)
    }
    const newVolunteer = cloneDeep(volunteer)
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
    const volunteer = list.find((v) => v.id === requestedId)
    if (!volunteer) {
        throw Error(`Il n'y a aucun bénévole avec cet identifiant ${requestedId}`)
    }
    const knowledge = body[1] as VolunteerKnowledge
    const newVolunteer = cloneDeep(volunteer)
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
