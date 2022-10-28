import ServiceAccessors from "./accessors"
import { elementName, Game, GameWithVolunteers, GameWithoutId } from "./games"

const serviceAccessors = new ServiceAccessors<GameWithoutId, Game>(elementName)

export const gameListGet = serviceAccessors.listGet()
// export const gameGet = serviceAccessors.get()
// export const gameAdd = serviceAccessors.add()
// export const gameSet = serviceAccessors.set()

export const gameDetailsUpdate = serviceAccessors.securedCustomGet<[], Game[]>("DetailsUpdate")

export const gameWithVolunteersListGet = serviceAccessors.securedCustomListGet<
    [],
    GameWithVolunteers[]
>("WithVolunteersListGet")
