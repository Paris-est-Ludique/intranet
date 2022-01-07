import { NextFunction, Request, Response } from "express"
import path from "path"
import { promises as fs } from "fs"
import { verify, sign } from "jsonwebtoken"

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
    const token1 = rawToken && rawToken.split(/\s/)[1]
    const token2 = request.cookies?.jwt
    const token = token1 || token2

    verify(token, cachedSecret, (tokenError: any, decoded: any) => {
        if (tokenError) {
            response.status(200).json({
                error: "Accès interdit sans identification",
            })
            return
        }
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

export async function getJwt(id: number): Promise<string> {
    const jwt = sign(
        { id },
        await getSecret()
        // __TEST__
        //     ? undefined
        //     : {
        //           expiresIn: "365d",
        //       }
    )
    return jwt
}
