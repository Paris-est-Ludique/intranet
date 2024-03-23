import { NextFunction, Request, Response } from "express"
import path from "path"
import { constants, promises as fs } from "fs"
import { verify, sign } from "jsonwebtoken"

type AuthorizedRequest = Request & { headers: { authorization: string } }

let cachedSecret: string
const SECRET_PATH = path.resolve(process.cwd(), "access/jwt_secret.json")
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

let hasSecretReturn: boolean | undefined
export async function hasSecret(): Promise<boolean> {
    if (hasSecretReturn !== undefined) {
        return hasSecretReturn
    }
    try {
        // eslint-disable-next-line no-bitwise
        await fs.access(SECRET_PATH, constants.R_OK | constants.W_OK)
        hasSecretReturn = true
    } catch {
        hasSecretReturn = false
    }
    return hasSecretReturn
}

async function getSecret() {
    if (!cachedSecret) {
        try {
            const secretContent = await fs.readFile(SECRET_PATH)
            cachedSecret = secretContent && JSON.parse(secretContent.toString()).secret
        } catch (e: any) {
            cachedSecret = "fakeqA6uF#msq2312bebf2FLFn4XzWQ6dttXSJwBX#?gL2JWf!" // DEV_JWT_SECRET
        }
    }

    return cachedSecret
}

export async function getJwt(id: number, roles: string[]): Promise<string> {
    const jwt = sign({ id, roles }, await getSecret())
    return jwt
}
