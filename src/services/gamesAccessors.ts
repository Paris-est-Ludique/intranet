import ServiceAccessors from './accessors'
import type { Game, GameWithVolunteers, GameWithoutId } from './games'
import { elementNameGame } from './games'

const serviceAccessors = new ServiceAccessors<GameWithoutId, Game>(elementNameGame)

export const gameListGet = serviceAccessors.listGet()

// export const gameGet = serviceAccessors.get()
// export const gameAdd = serviceAccessors.add()
// export const gameSet = serviceAccessors.set()

export const gameDetailsUpdate = serviceAccessors.securedCustomGet<[], Game[]>('DetailsUpdate')

export const gameWithVolunteersListGet = serviceAccessors.securedCustomListGet<[], GameWithVolunteers[]>(
  'WithVolunteersListGet',
)
