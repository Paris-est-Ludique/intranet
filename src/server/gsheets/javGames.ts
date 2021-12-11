import ExpressAccessors from "./expressAccessors"
import { JavGame, JavGameWithoutId, translationJavGame } from "../../services/javGames"

const expressAccessor = new ExpressAccessors<JavGameWithoutId, JavGame>(
    "JavGames",
    new JavGame(),
    translationJavGame
)

export const javGameListGet = expressAccessor.listGet()

export const javGameGet = expressAccessor.get()

export const javGameAdd = expressAccessor.add()

export const javGameSet = expressAccessor.set()
