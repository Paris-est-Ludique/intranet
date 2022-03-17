import _ from "lodash"
import bcrypt from "bcrypt"
import sgMail from "@sendgrid/mail"

import ExpressAccessors from "./expressAccessors"
import {
    Volunteer,
    VolunteerWithoutId,
    VolunteerLogin,
    VolunteerNotifs,
    VolunteerTeamWishes,
    translationVolunteer,
    VolunteerDayWishes,
    VolunteerParticipationDetails,
} from "../../services/volunteers"
import { canonicalEmail } from "../../utils/standardization"
import { getJwt } from "../secure"

const expressAccessor = new ExpressAccessors<VolunteerWithoutId, Volunteer>(
    "Volunteers",
    new Volunteer(),
    translationVolunteer
)

export const volunteerListGet = expressAccessor.listGet()
export const volunteerAdd = expressAccessor.add()
export const volunteerSet = expressAccessor.set()

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
    const volunteer = getByEmail(list, body.email)
    if (!volunteer) {
        throw Error("Il n'y a aucun bénévole avec cet email")
    }
    const newVolunteer = _.cloneDeep(volunteer)

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
            message: `Un nouveau mot de passe t'a été envoyé par email. Regarde bien dans les spams, il pourrait y être :/`,
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
            text: `Voici le nouveau mot de passe : ${password}\nL'ancien fonctionne encore, si tu t'en rappelles.`,
            html: `Voici le nouveau mot de passe : <strong>${password}</strong><br />L'ancien fonctionne encore, si tu t'en rappelles.`,
        }
        await sgMail.send(msg)
    }
}

export const volunteerNotifsSet = expressAccessor.set(async (list, body, id) => {
    const requestedId = +body[0] || id
    if (requestedId !== id && requestedId !== 0) {
        throw Error(`On ne peut acceder qu'à ses propres notifs`)
    }
    const notifChanges = body[1]
    const volunteer = list.find((v) => v.id === requestedId)
    if (!volunteer) {
        throw Error(`Il n'y a aucun bénévole avec cet identifiant ${requestedId}`)
    }
    const newVolunteer = _.cloneDeep(volunteer)

    _.assign(newVolunteer, _.pick(notifChanges, _.keys(newVolunteer)))

    return {
        toDatabase: newVolunteer,
        toCaller: {
            id: newVolunteer.id,
            firstname: newVolunteer.firstname,
            adult: newVolunteer.adult,
            active: newVolunteer.active,
            hiddenNotifs: newVolunteer.hiddenNotifs,
            pushNotifSubscription: newVolunteer.pushNotifSubscription,
            acceptsNotifs: newVolunteer.acceptsNotifs,
        } as VolunteerNotifs,
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
    const volunteer = list.find((v) => v.id === requestedId)
    if (!volunteer) {
        throw Error(`Il n'y a aucun bénévole avec cet identifiant ${requestedId}`)
    }
    const newVolunteer = _.cloneDeep(volunteer)

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
    const volunteer = list.find((v) => v.id === requestedId)
    if (!volunteer) {
        throw Error(`Il n'y a aucun bénévole avec cet identifiant ${requestedId}`)
    }
    const newVolunteer = _.cloneDeep(volunteer)

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
            dayWishes: newVolunteer.dayWishes,
            dayWishesComment: newVolunteer.dayWishesComment,
        } as VolunteerDayWishes,
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
    const newVolunteer = _.cloneDeep(volunteer)

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

function getByEmail<T extends { email: string }>(list: T[], rawEmail: string): T | undefined {
    const email = canonicalEmail(rawEmail || "")
    const volunteer = list.find((v) => canonicalEmail(v.email) === email)
    return volunteer
}
