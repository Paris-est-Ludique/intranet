import getExpressAccessors from "./expressAccessors"
import { Envie, EnvieWithoutId } from "../../services/envies"

const { listGetRequest, getRequest, setRequest, addRequest } = getExpressAccessors<
    EnvieWithoutId,
    Envie
>("Envies d'aider", new Envie())

export const envieListGet = listGetRequest()

export const envieGet = getRequest()

export const envieAdd = addRequest()

export const envieSet = setRequest()
