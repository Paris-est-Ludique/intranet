import { NextFunction, Request, Response } from "express"
import path from "path"
import { promises as fs } from "fs"
import { verify, sign } from "jsonwebtoken"
import { canonicalEmail } from "../utils/standardization"

import config from "../config"

type AuthorizedRequest = Request & { headers: { authorization: string } }

let cachedSecret: string
getSecret() // Necessary until we can make async express middleware

export function secure(request: AuthorizedRequest, response: Response, next: NextFunction): void {
    if (!cachedSecret) {
        response.status(408).json({
            error: "Server still loading",
        })
        return
    }

    const rawToken = request.headers.authorization
    const token = rawToken && rawToken.split(/\s/)[1]

    verify(token, cachedSecret, (tokenError: any, decoded: any) => {
        if (tokenError) {
            response.status(403).json({
                error: "Invalid token, please Log in first, criterion auth",
            })
            return
        }
        decoded.user.replace(/@gmailcom$/, "@gmail.com")
        response.locals.jwt = decoded
        next()
    })
}

async function getSecret() {
    if (!cachedSecret) {
        const SECRET_PATH = path.resolve(process.cwd(), "access/jwt_secret.json")

        try {
            const secretContent = await fs.readFile(SECRET_PATH)
            cachedSecret = secretContent && JSON.parse(secretContent.toString()).secret
        } catch (e: any) {
            cachedSecret = config.JWT_SECRET
        }
    }

    return cachedSecret
}

export async function getJwt(email: string): Promise<string> {
    const jwt = sign({ user: canonicalEmail(email), permissions: [] }, await getSecret(), {
        expiresIn: "365d",
    })
    return jwt
}
