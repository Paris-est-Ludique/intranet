import { listGetRequest, getRequest, setRequest, addRequest } from "./expressAccessors"
import { JeuJav, JeuJavWithoutId } from "../services/jeuxJav"

const sheetName = "Jeux JAV"

export const jeuJavListGet = listGetRequest(sheetName, new JeuJav())

export const jeuJavGet = getRequest(sheetName, new JeuJav())

export const jeuJavAdd = addRequest<JeuJavWithoutId, JeuJav>(sheetName)

export const jeuJavSet = setRequest(sheetName)
