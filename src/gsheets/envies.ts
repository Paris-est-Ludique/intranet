import { listGetRequest, getRequest, setRequest, addRequest } from "./expressAccessors"
import { Envie, EnvieWithoutId } from "../services/envies"

const sheetName = "Envies d'aider"

export const envieListGet = listGetRequest(sheetName, new Envie())

export const envieGet = getRequest(sheetName, new Envie())

export const envieAdd = addRequest<EnvieWithoutId, Envie>(sheetName)

export const envieSet = setRequest(sheetName)
