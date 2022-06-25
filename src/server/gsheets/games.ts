import { cloneDeep } from "lodash"
import ExpressAccessors from "./expressAccessors"
import { Game, GameWithoutId, translationGame } from "../../services/games"

const expressAccessor = new ExpressAccessors<GameWithoutId, Game>(
    "Games",
    new Game(),
    translationGame
)

export const gameListGet = expressAccessor.listGet()
// export const gameGet = expressAccessor.get()
// export const gameAdd = expressAccessor.add()
// export const gameSet = expressAccessor.set()

export const gameDetailsUpdate = expressAccessor.listSet(async (list) => {
    const newList = cloneDeep(list)

    // TODO update game list details from BGG

    return {
        toDatabase: newList,
        toCaller: newList,
    }
})
