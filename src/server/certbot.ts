import path from 'node:path'
import type { NextFunction, Request, Response } from 'express'
import { Router } from 'express'

export default function () {
  const router = Router()

  router.use('/.well-known/acme-challenge', (request: Request, response: Response, _next: NextFunction) => {
    const filename = request.originalUrl.replace(/.*\//, '')
    const resolvedPath: string = path.resolve(`../certbot/.well-known/acme-challenge/${filename}`)

    response.setHeader('Content-Type', 'text/html')
    return response.sendFile(resolvedPath)
  })

  return router
}
