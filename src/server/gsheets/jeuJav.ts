import getExpressAccessors from "./expressAccessors"
import { JeuJav, JeuJavWithoutId, translationJeuJav } from "../../services/jeuxJav"

const { listGetRequest, getRequest, setRequest, addRequest } = getExpressAccessors<
    JeuJavWithoutId,
    JeuJav
>("Jeux JAV", new JeuJav(), translationJeuJav)

export const jeuJavListGet = listGetRequest()

export const jeuJavGet = getRequest()

export const jeuJavAdd = addRequest()

export const jeuJavSet = setRequest()
