import { Request, Response, NextFunction } from "express"
import _ from "lodash"
import { getList } from "./utils"
import { JeuJav } from "../services/jeuJav"

export const getJeuJavList = async (
    _request: Request,
    response: Response,
    _next: NextFunction
): Promise<void> => {
    try {
        const list = await getList<JeuJav>("Jeux JAV", new JeuJav())
        if (list) {
            response.status(200).json(list)
        }
    } catch (e: unknown) {
        response.status(400).json(e)
    }
}

export const getJeuJavData = async (
    _request: Request,
    response: Response,
    _next: NextFunction
): Promise<void> => {
    const list = await getList<JeuJav>("Jeux JAV", new JeuJav())
    const data = _.find(list, { id: 56 })
    if (data) {
        response.status(200).json(data)
    }
}
