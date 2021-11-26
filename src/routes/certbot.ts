/* Copyright Coplay. All Rights Reserved. Use of this source code is governed by an MIT-style license that can be found in the LICENSE file at https://coplay.org/colicense */
import { NextFunction, Request, Response, Router } from "express"
import * as path from "path"

const certbotRouter: Router = Router()

certbotRouter.use((request: Request, response: Response, _next: NextFunction) => {
    const filename = request.originalUrl.replace(/.*\//, "")
    const resolvedPath: string = path.resolve(`../certbot/.well-known/acme-challenge/${filename}`)
    response.setHeader("Content-Type", "text/html")
    return response.sendFile(resolvedPath)
})

export default certbotRouter
