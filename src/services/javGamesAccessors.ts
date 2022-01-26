import ServiceAccessors from "./accessors"
import { elementName, JavGame, JavGameWithoutId } from "./javGames"

const serviceAccessors = new ServiceAccessors<JavGameWithoutId, JavGame>(elementName)

export const javGameListGet = serviceAccessors.listGet()
export const javGameGet = serviceAccessors.get()
export const javGameAdd = serviceAccessors.add()
export const javGameSet = serviceAccessors.set()
