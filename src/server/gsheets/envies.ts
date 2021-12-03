import getExpressAccessors from "./expressAccessors"
import { Envie, EnvieWithoutId, translationEnvie } from "../../services/envies"

const { listGetRequest, getRequest, setRequest, addRequest } = getExpressAccessors<
    EnvieWithoutId,
    Envie
>("Envies d'aider", new Envie(), translationEnvie)

export const envieListGet = listGetRequest()

export const envieGet = getRequest()

export const envieAdd = addRequest()

export const envieSet = setRequest()
