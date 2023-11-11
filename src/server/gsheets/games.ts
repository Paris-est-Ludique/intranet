import axios from 'axios'
import { Parser } from 'xml2js'
import assign from 'lodash/assign'
import cloneDeep from 'lodash/cloneDeep'
import every from 'lodash/every'
import find from 'lodash/find'
import groupBy from 'lodash/groupBy'
import last from 'lodash/last'
import mapValues from 'lodash/mapValues'
import reduce from 'lodash/reduce'
import sortBy from 'lodash/sortBy'
import ExpressAccessors from './expressAccessors'
import { getSheet } from './accessors'
import { getUniqueNickname } from './tools'
import type { GameWithVolunteers, GameWithoutId } from '@/services/games'
import { Game, translationGame } from '@/services/games'
import type { VolunteerWithoutId } from '@/services/volunteers'
import { Volunteer, translationVolunteer } from '@/services/volunteers'
import type { BoxWithoutId } from '@/services/boxes'
import { Box, translationBox } from '@/services/boxes'
import { gameTitleCategory, gameTitleExactCategory, gameTitleOrder } from '@/utils/games'

const expressAccessor = new ExpressAccessors<GameWithoutId, Game>(
  'Games',
  new Game(),
  translationGame,
)

// export const gameListGet = expressAccessor.listGet()
// export const gameGet = expressAccessor.get()
// export const gameAdd = expressAccessor.add()
// export const gameSet = expressAccessor.set()

export const gameDetailsUpdate = expressAccessor.listSet(
  async (list, _body, _id, _roles, request) => {
    request.setTimeout(500000)
    const newList: Game[] = cloneDeep(list)

    const data = await getData()
    const parser = new Parser()
    const parsed = await parser.parseStringPromise(data)

    newList.forEach((game, index, arr) => {
      const box = find(parsed.items.item, (item: any) => game.bggId === +item.$.objectid)
      if (box) {
        if (game.bggPhoto === '' || game.duration === 0) {
          assign(arr[index], xmlToGame(game.id, box), {
            title: arr[index].title,
            ean: arr[index].ean || 0,
            type: arr[index].type,
          })
        }
      }
      else {
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
  },
)

function xmlToGame(id: number, item: any): Game {
  return {
    id,
    title: '',
    bggId: +item.$.objectid || 0,
    bggIdAlternative: '',
    bggTitle: item.name?.[0]._ || '',
    playersMin: item.stats?.[0]?.$?.minplayers || 0,
    playersMax: item.stats?.[0]?.$?.maxplayers || 0,
    duration: item.stats?.[0]?.$?.playingtime || 0,
    type: 'Famille',
    poufpaf: '',
    ean: '',
    bggPhoto: item.thumbnail?.[0] || '',
    toBeKnown: true,
  }
}
async function getData(): Promise<string> {
  const { data } = await axios.get(
    'https://boardgamegeek.com/xmlapi2/collection?username=Paris%20est%20ludique&subtype=boardgame&stats=1',
  )
  if (!data) {
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 20000)
    })
    return getData()
  }
  return data
}

export const gameListGet = expressAccessor.get(async (list) => {
  const boxSheet = await getSheet<BoxWithoutId, Box>('Boxes', new Box(), translationBox)

  const boxList = await boxSheet.getList()
  if (!boxList) {
    throw new Error('Unable to load boxList')
  }

  const toBeAsked: Game[] = []

  list.forEach((game) => {
    const box: Box | undefined = boxList.find(b => b.gameId === game.id)
    if (!box) {
      return
    }
    toBeAsked.push({
      id: game.id,
      title: game.title,
      bggId: game.bggId,
      bggIdAlternative: game.bggIdAlternative,
      bggPhoto: game.bggPhoto,
      poufpaf: game.poufpaf,
      playersMin: game.playersMin,
      playersMax: game.playersMax,
      duration: game.duration,
      type: game.type,
    } as Game)
  })

  return toBeAsked
})

export const gameWithVolunteersListGet = expressAccessor.get(
  async (list, _body, id): Promise<GameWithVolunteers[]> => {
    if (id <= 0) {
      throw new Error(`L'accès est réservé aux utilisateurs identifiés`)
    }
    const volunteerSheet = await getSheet<VolunteerWithoutId, Volunteer>(
      'Volunteers',
      new Volunteer(),
      translationVolunteer,
    )
    const volunteerList = await volunteerSheet.getList()
    if (!volunteerList) {
      throw new Error('Unable to load volunteers')
    }

    const currentVolunteer: Volunteer | undefined = volunteerList.find(v => v.id === id)
    if (!currentVolunteer) {
      throw new Error(`Unknown volunteer ${id}`)
    }

    const boxSheet = await getSheet<BoxWithoutId, Box>('Boxes', new Box(), translationBox)
    const boxList = await boxSheet.getList()
    if (!boxList) {
      throw new Error('Unable to load boxes')
    }

    const giftGameIds = list
      .filter(game =>
        every(
          volunteerList,
          v => !v.loanable.includes(game.id) && !v.playable.includes(game.id),
        ),
      )
      .map(game => game.id)

    const gamesToLoan = list
      .filter(game => currentVolunteer.loanable.includes(game.id))
      .map(game => ({
        ...cloneDeep(game),
        volunteerNicknames: volunteerToNicknameList(
          volunteerList.filter(v => v.loanable.includes(game.id)),
          volunteerList,
        ),
        toLoan: true,
        boxCount: boxList.filter(b => b.gameId === game.id).length,
      }))

    const gamesToGift = list
      .filter(
        game =>
          giftGameIds.includes(game.id) && currentVolunteer.loanable.includes(game.id),
      )
      .map(game => ({
        ...cloneDeep(game),
        volunteerNicknames: volunteerToNicknameList(
          volunteerList.filter(v => v.loanable.includes(game.id)),
          volunteerList,
        ),
        toLoan: false,
        boxCount: boxList.filter(b => b.gameId === game.id).length,
      }))

    return [...gamesToLoan, ...gamesToGift]
  },
)

function volunteerToNicknameList(volunteers: Volunteer[], allVolunteers: Volunteer[]): string[] {
  return volunteers
    .map(v => getUniqueNickname(allVolunteers, v))
    .sort((a, b) => a.localeCompare(b))
}

export const gamesToGiveListGet = expressAccessor.get(async (list): Promise<string[]> => {
  const volunteerSheet = await getSheet<VolunteerWithoutId, Volunteer>(
    'Volunteers',
    new Volunteer(),
    translationVolunteer,
  )
  const volunteerList = await volunteerSheet.getList()
  if (!volunteerList) {
    throw new Error('Unable to load volunteers')
  }

  const boxSheet = await getSheet<BoxWithoutId, Box>('Boxes', new Box(), translationBox)
  const boxList = await boxSheet.getList()
  if (!boxList) {
    throw new Error('Unable to load boxes')
  }

  volunteerList[105].playable = []

  const giftGameTitles = list
    .filter(game =>
      every(
        volunteerList,
        v => !v.loanable.includes(game.id) && !v.playable.includes(game.id),
      ),
    )
    .map(game => game.title)

  return giftGameTitles
})
interface GameCategory { start: string; end: string; titles: string[] }
export const gameTitleOrderCategories = expressAccessor.get(
  async (list): Promise<GameCategory[]> => {
    const volunteerSheet = await getSheet<VolunteerWithoutId, Volunteer>(
      'Volunteers',
      new Volunteer(),
      translationVolunteer,
    )
    const volunteerList = await volunteerSheet.getList()
    if (!volunteerList) {
      throw new Error('Unable to load volunteers')
    }

    const boxSheet = await getSheet<BoxWithoutId, Box>('Boxes', new Box(), translationBox)
    const boxList = await boxSheet.getList()
    if (!boxList) {
      throw new Error('Unable to load boxes')
    }

    volunteerList[105].playable = []

    const giftGameIds = list
      .filter(game =>
        every(
          volunteerList,
          v => !v.loanable.includes(game.id) && !v.playable.includes(game.id),
        ),
      )
      .map(game => game.id)

    const gamesToLoan = sortBy(
      list.filter(game => !giftGameIds.includes(game.id)).map(game => cloneDeep(game)),
      gameTitleOrder,
    )

    const exaustiveCats = mapValues(groupBy(gamesToLoan, gameTitleCategory), gameList =>
      gameList.map(game => game.title))

    const cats: GameCategory[] = reduce(
      Object.entries(exaustiveCats),
      (res, [exaustiveCat, catTitles]) => {
        const prevCat = last(res)
        const prevCount = prevCat?.titles.length || 0
        if (prevCount === 0 || prevCount + catTitles.length > 10) {
          const newCat = {
            start: exaustiveCat,
            end: exaustiveCat,
            titles: [...catTitles],
          }
          res.push(newCat)
        }
        else if (prevCat !== undefined) {
          prevCat.end = exaustiveCat
          catTitles.forEach(title => prevCat.titles.push(title))
        }
        return res
      },
      [] as GameCategory[],
    )

    // const catList: string[] = cats.map((cat) => `${cat.start}-${cat.end}`)
    // const availableGiftIds = giftGameIds.filter((id) =>
    //   some(volunteerList, (v: Volunteer) => v.giftable.includes(id)),
    // )

    gamesToLoan.forEach(g => gameTitleExactCategory(g))

    return cats
  },
)
