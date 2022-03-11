import ExpressAccessors from "./expressAccessors"
import { Game, GameWithoutId, translationGame } from "../../services/games"

const expressAccessor = new ExpressAccessors<GameWithoutId, Game>(
    "Games",
    new Game(),
    translationGame
)

export const gameListGet = expressAccessor.listGet()
export const gameGet = expressAccessor.get()
export const gameAdd = expressAccessor.add()
export const gameSet = expressAccessor.set()
