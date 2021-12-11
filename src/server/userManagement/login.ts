import { Request, Response, NextFunction } from "express"
import bcrypt from "bcrypt"
import {
    Volunteer,
    VolunteerWithoutId,
    VolunteerLogin,
    emailRegexp,
    passwordMinLength,
    translationVolunteer,
} from "../../services/volunteers"
import { getSheet } from "../gsheets/accessors"
import { getJwt } from "../secure"

export default async function loginHandler(
    request: Request,
    response: Response,
    _next: NextFunction
): Promise<void> {
    try {
        if (typeof request.body.email !== "string" || typeof request.body.password !== "string") {
            throw Error()
        }
        const res = await login(request.body.email, request.body.password)
        response.status(200).json(res)
    } catch (e: any) {
        if (e.message) {
            response.status(200).json({ error: e.message })
        } else {
            response.status(400).json(e)
        }
    }
}

export async function login(rawEmail: string, rawPassword: string): Promise<VolunteerLogin> {
    const sheet = getSheet<VolunteerWithoutId, Volunteer>(
        "Volunteers",
        new Volunteer(),
        translationVolunteer
    )

    const email = rawEmail.replace(/^\s*/, "").replace(/\s*$/, "")
    if (!emailRegexp.test(email)) {
        throw Error("Email invalid")
    }

    const password = rawPassword.replace(/^\s*/, "").replace(/\s*$/, "")
    if (password.length === 0) {
        throw Error("Mot de passe nécessaire")
    }
    if (password.length < passwordMinLength) {
        throw Error("Mot de passe trop court")
    }

    const volunteers: Volunteer[] | undefined = await sheet.getList()
    const volunteer = volunteers && volunteers.find((m) => m.email === email)
    if (!volunteer) {
        throw Error("Cet email ne correspond à aucun utilisateur")
    }

    const passwordMatch = await bcrypt.compare(password, volunteer.password.replace(/^\$2y/, "$2a"))
    if (!passwordMatch) {
        throw Error("Mauvais mot de passe pour cet email")
    }

    const jwt = await getJwt(email)

    return {
        volunteer: {
            firstname: volunteer.firstname,
        },
        jwt,
    }
}
