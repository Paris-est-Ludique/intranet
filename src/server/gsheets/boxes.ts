import ExpressAccessors from "./expressAccessors"
import { Box, BoxWithoutId, translationBox, DetailedBox } from "../../services/boxes"
import { Game, GameWithoutId, translationGame } from "../../services/games"
import { getSheet } from "./accessors"

const expressAccessor = new ExpressAccessors<BoxWithoutId, Box>("Boxes", new Box(), translationBox)

export const detailedBoxListGet = expressAccessor.get(async (list) => {
    const gameSheet = await getSheet<GameWithoutId, Game>("Games", new Game(), translationGame)

    const gameList = await gameSheet.getList()
    if (!gameList) {
        throw Error("Unable to load gameList")
    }

    return list
        .filter((box) => !box.unplayable)
        .map((box) => {
            const game = gameList.find((g) => g.id === box.gameId)
            if (!game) {
                throw Error(`Unable to find game #${box.gameId}`)
            }
            return {
                id: box.id,
                gameId: box.gameId,
                title: game.title,
                bggPhoto: game.bggPhoto,
                poufpaf: game.poufpaf,
                bggId: game.bggId,
            } as DetailedBox
        })
})
