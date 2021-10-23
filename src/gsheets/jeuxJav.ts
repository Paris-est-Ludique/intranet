import { Request, Response, NextFunction } from "express"
import _ from "lodash"
import { getList } from "./utils"
import { JeuxJav } from "../services/jeuxJav"

export const getJeuxJavList = async (
    _request: Request,
    response: Response,
    _next: NextFunction
): Promise<void> => {
    const list = await getList<JeuxJav>("Jeux JAV", new JeuxJav())
    if (list) {
        response.status(200).json(list)
    }
}

export const getJeuxJavData = async (
    _request: Request,
    response: Response,
    _next: NextFunction
): Promise<void> => {
    const list = await getList<JeuxJav>("Jeux JAV", new JeuxJav())
    const data = _.find(list, { id: 56 })
    if (data) {
        response.status(200).json(data)
    }
}
