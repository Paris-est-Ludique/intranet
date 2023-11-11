import sortBy from 'lodash/sortBy'
import sortedUniqBy from 'lodash/sortedUniqBy'

import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AppDispatch, AppState, AppThunk, EntitiesRequest } from '.'
import type { StateRequest } from '@/utils/elements'
import { elementListFetch } from '@/utils/elements'
import { toastError } from '@/utils/toast'
import { gameTitleOrder } from '@/utils/games'
import type { GameWithVolunteers } from '@/services/games'
import { gameWithVolunteersListGet } from '@/services/gamesAccessors'

const gameWithVolunteersAdapter = createEntityAdapter<GameWithVolunteers>()

const initialState = gameWithVolunteersAdapter.getInitialState({
  readyStatus: 'idle',
} as StateRequest)

const gameWithVolunteersListSlice = createSlice({
  name: 'gameWithVolunteersList',
  initialState,
  reducers: {
    getRequesting: state => {
      state.readyStatus = 'request'
    },
    getSuccess: (state, { payload }: PayloadAction<GameWithVolunteers[]>) => {
      state.readyStatus = 'success'
      gameWithVolunteersAdapter.setAll(state, payload)
    },
    getFailure: (state, { payload }: PayloadAction<string>) => {
      state.readyStatus = 'failure'
      state.error = payload
    },
  },
})

export const { reducer: gameWithVolunteersListReducer, actions: gameWithVolunteersListActions }
  = gameWithVolunteersListSlice

export const fetchGameWithVolunteersList = elementListFetch(
  gameWithVolunteersListGet,
  gameWithVolunteersListActions,
  (error: Error) => toastError(`Erreur lors du chargement des jeux JAV: ${error.message}`),
)

function selectShouldFetchGameWithVolunteersList(state: AppState) {
  return state.gameWithVolunteersList.readyStatus !== 'success'
}

export const fetchGameWithVolunteersListIfNeed: AppThunk = () => (dispatch: AppDispatch, getState: () => AppState) => {
  const { jwt } = getState().auth

  if (selectShouldFetchGameWithVolunteersList(getState())) {
    dispatch(fetchGameWithVolunteersList(jwt))
  }
}

export function selectGameWithVolunteersListState(state: AppState): EntitiesRequest<GameWithVolunteers> {
  return state.gameWithVolunteersList
}

export const selectGameWithVolunteersList = createSelector(
  selectGameWithVolunteersListState,
  ({ ids, entities, readyStatus }) => {
    if (readyStatus !== 'success') {
      return []
    }

    return ids.map(id => entities[id])
  },
)

export const selectSortedUniqueGamesWithVolunteers = createSelector(selectGameWithVolunteersList, (games: []) => {
  const gameWithVolunteers = games.filter(game => game) as GameWithVolunteers[]

  return sortedUniqBy(sortBy(gameWithVolunteers, gameTitleOrder), gameTitleOrder)
})
