import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

type AuthorizedRequest = Request & { headers: { authorization: string } }

export function secure(request: AuthorizedRequest, response: Response, next: NextFunction): void {
  if (!import.meta.env.JWT_SECRET) {
    response.status(408).json({
      error: 'Server still loading',
    })
    return
  }

  const rawToken = request.headers.authorization
  const token1 = rawToken && rawToken.split(/\s/)[1]
  const token2 = request.cookies?.jwt
  const token = token1 || token2

  jwt.verify(token, import.meta.env.JWT_SECRET, (tokenError: any, decoded: any) => {
    if (tokenError) {
      response.status(200).json({
        error: 'Accès interdit sans identification',
      })
      return
    }
    response.locals.jwt = decoded
    next()
  })
}

export async function getJwt(id: number, roles: string[]): Promise<string> {
  const token = jwt.sign({ id, roles }, import.meta.env.JWT_SECRET)
  return token
}
