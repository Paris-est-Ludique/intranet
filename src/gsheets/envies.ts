import { Request, Response, NextFunction } from "express"
import { getList, add } from "./utils"
import { Envie, EnvieWithoutId } from "../services/envies"

export const envieListGet = async (
    _request: Request,
    response: Response,
    _next: NextFunction
): Promise<void> => {
    try {
        const list = await getList<Envie>("Envies d'aider", new Envie())
        if (list) {
            response.status(200).json(list)
        }
    } catch (e: unknown) {
        response.status(400).json(e)
    }
}

export const envieAdd = async (
    request: Request,
    response: Response,
    _next: NextFunction
): Promise<void> => {
    try {
        const envie = await add<EnvieWithoutId, Envie>("Envies d'aider", request.body)
        if (envie) {
            response.status(200).json(envie)
        }
    } catch (e: unknown) {
        response.status(400).json(e)
    }
}
