import { Request, Response, NextFunction } from "express"
import { getList, setList } from "./utils"
import { Envie } from "../services/envies"

export const getEnvieList = async (
    _request: Request,
    response: Response,
    _next: NextFunction
): Promise<void> => {
    const list = await getList<Envie>("Envies d'aider", new Envie())
    if (list) {
        response.status(200).json(list)
    }
}

export const setEnvieList = async (
    request: Request,
    response: Response,
    _next: NextFunction
): Promise<void> => {
    const success = await setList<Envie>("Envies d'aider", request.body)
    if (success) {
        response.status(200).json()
    }
}
