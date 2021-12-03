import getExpressAccessors from "./expressAccessors"
import { Membre, MembreWithoutId, translationMember } from "../../services/membres"

const { listGetRequest, getRequest, setRequest, addRequest } = getExpressAccessors<
    MembreWithoutId,
    Membre
>("Membres", new Membre(), translationMember)

export const membreListGet = listGetRequest()

export const membreGet = getRequest()

export const membreAdd = addRequest()

export const membreSet = setRequest()
