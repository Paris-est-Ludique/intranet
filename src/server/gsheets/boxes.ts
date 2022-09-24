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

    const toBeAsked: DetailedBox[] = []

    gameList.forEach((game) => {
        const box: Box | undefined = list.find((g) => g.gameId === game.id)
        if ((box && box.unplayable) || (!box && !game.toBeKnown)) {
            return
        }
        toBeAsked.push({
            id: box?.id || 10000 + game.id,
            gameId: game.id,
            title: game.title,
            bggId: game.bggId,
            bggIdAlternative: game.bggIdAlternative,
            bggPhoto: game.bggPhoto,
            poufpaf: game.poufpaf,
            container: box?.container || "Non stocké",
            playersMin: game.playersMin,
            playersMax: game.playersMax,
            duration: game.duration,
            type: game.type,
        } as DetailedBox)
    })

    return toBeAsked
})
