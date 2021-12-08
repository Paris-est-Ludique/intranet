import getExpressAccessors from "./expressAccessors"
import { sheetNames } from "./accessors"
import { JavGame, JavGameWithoutId, translationJavGame } from "../../services/javGames"

const { listGetRequest, getRequest, setRequest, addRequest } = getExpressAccessors<
    JavGameWithoutId,
    JavGame
>(sheetNames.JavGames, new JavGame(), translationJavGame)

export const javGameListGet = listGetRequest()

export const javGameGet = getRequest()

export const javGameAdd = addRequest()

export const javGameSet = setRequest()
