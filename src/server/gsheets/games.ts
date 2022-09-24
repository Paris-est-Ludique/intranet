import axios from "axios"
import { Parser } from "xml2js"
import { assign, cloneDeep, find } from "lodash"
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

export const gameDetailsUpdate = expressAccessor.listSet(
    async (list, _body, _id, _roles, request) => {
        request.setTimeout(500000)
        const newList = cloneDeep(list)

        const data = await getData()
        const parser = new Parser()
        const parsed = await parser.parseStringPromise(data)

        newList.forEach((game, index, arr) => {
            const box = find(parsed.items.item, (item: any) => game.bggId === +item.$.objectid)
            if (box) {
                if (game.bggPhoto === "" || game.duration === 0) {
                    assign(arr[index], xmlToGame(game.id, box), {
                        title: arr[index].title,
                        ean: arr[index].ean || 0,
                        type: arr[index].type,
                    })
                }
            } else {
                assign(arr[index], {
                    bggId: 0,
                    playersMin: 0,
                    playersMax: 0,
                    duration: 0,
                    ean: 0,
                    toBeKnown: true,
                })
            }
        })

        // // Add to DB game that were only present on BGG
        // const newGames = parsed.items.item.filter(
        //     (item: any) =>
        //         (item.status[0]?.$?.own === "1" ||
        //             item.status[0]?.$?.want === "1" ||
        //             item.status[0]?.$?.wishlist === "1" ||
        //             item.status[0]?.$?.preordered === "1") &&
        //         !some(list, (i) => +i.bggId === +item.$.objectid)
        // )

        // let id = maxBy(newList, "id")?.id || 0
        // newGames.forEach((item: any) => {
        //     id += 1
        //     newList.push(xmlToGame(id, item))
        // })

        return {
            toDatabase: newList,
            toCaller: newList,
        }
    }
)

function xmlToGame(id: number, item: any): Game {
    return {
        id,
        title: "",
        bggId: +item.$.objectid || 0,
        bggIdAlternative: "",
        bggTitle: item.name?.[0]._ || "",
        playersMin: item.stats?.[0]?.$?.minplayers || 0,
        playersMax: item.stats?.[0]?.$?.maxplayers || 0,
        duration: item.stats?.[0]?.$?.playingtime || 0,
        type: "Famille",
        poufpaf: "",
        ean: "",
        bggPhoto: item.thumbnail?.[0] || "",
        toBeKnown: true,
    }
}
async function getData(): Promise<string> {
    const { data } = await axios.get(
        "https://boardgamegeek.com/xmlapi2/collection?username=Paris%20est%20ludique&subtype=boardgame&stats=1"
    )
    if (!data) {
        await new Promise<void>((resolve) => {
            setTimeout(() => resolve(), 20000)
        })
        return getData()
    }
    return data
}
