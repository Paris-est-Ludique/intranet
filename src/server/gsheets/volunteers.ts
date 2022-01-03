import { Request } from "express"
import bcrypt from "bcrypt"

import ExpressAccessors from "./expressAccessors"
import { Volunteer, VolunteerWithoutId, translationVolunteer } from "../../services/volunteers"
import { canonicalEmail } from "../../utils/standardization"
import { getJwt } from "../secure"

const expressAccessor = new ExpressAccessors<VolunteerWithoutId, Volunteer>(
    "Volunteers",
    new Volunteer(),
    translationVolunteer
)

export const volunteerListGet = expressAccessor.listGet()

export const volunteerGet = expressAccessor.get()

export const volunteerAdd = expressAccessor.add()

export const volunteerSet = expressAccessor.set()

export const volunteerLogin = expressAccessor.customGet(
    async (list: Volunteer[] | undefined, body: Request["body"]) => {
        if (!list) {
            throw Error("Il n'y a aucun bénévole avec cet email")
        }
        const email = canonicalEmail(body.email || "")
        const volunteer = list.find((v) => canonicalEmail(v.email) === email)
        if (!volunteer) {
            throw Error("Il n'y a aucun bénévole avec cet email")
        }

        const password = body.password || ""
        const passwordMatch = await bcrypt.compare(
            password,
            volunteer.password.replace(/^\$2y/, "$2a")
        )
        if (!passwordMatch) {
            throw Error("Mauvais mot de passe pour cet email")
        }

        const jwt = await getJwt(email)

        return {
            firstname: volunteer.firstname,
            jwt,
        }
    }
)
