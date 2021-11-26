import { Request, Response, NextFunction } from "express"
import bcrypt from "bcrypt"
import { Membre, MemberLogin, emailRegexp, passwordMinLength } from "../../services/membres"
import getAccessors from "../gsheets/accessors"

const { listGet } = getAccessors("Membres", new Membre())

export default async function signInHandler(
    request: Request,
    response: Response,
    _next: NextFunction
): Promise<void> {
    try {
        if (typeof request.body.email !== "string" || typeof request.body.password !== "string") {
            throw Error()
        }
        const res = await signIn(request.body.email, request.body.password)
        response.status(200).json(res)
    } catch (e: any) {
        if (e.message) {
            response.status(200).json({ error: e.message })
        } else {
            response.status(400).json(e)
        }
    }
}

export async function signIn(rawEmail: string, rawPassword: string): Promise<MemberLogin> {
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

    const membres: Membre[] = await listGet()
    const membre = membres.find((m) => m.mail === email)
    if (!membre) {
        throw Error("Cet email ne correspond à aucun utilisateur")
    }

    const passwordMatch = await bcrypt.compare(password, membre.passe.replace(/^\$2y/, "$2a"))
    if (!passwordMatch) {
        throw Error("Mauvais mot de passe pour cet email")
    }

    return {
        membre: {
            prenom: membre.prenom,
        },
    }
}
