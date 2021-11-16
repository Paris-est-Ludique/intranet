import { listGetRequest, getRequest, setRequest, addRequest } from "./expressAccessors"
import { Membre, MembreWithoutId } from "../services/membres"

const sheetName = "Membres"

export const membreListGet = listGetRequest(sheetName, new Membre())

export const membreGet = getRequest(sheetName, new Membre())

export const membreAdd = addRequest<MembreWithoutId, Membre>(sheetName)

export const membreSet = setRequest(sheetName)
