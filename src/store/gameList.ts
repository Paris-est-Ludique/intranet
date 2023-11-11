import type { PayloadAction } from '@reduxjs/toolkit'
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { AppDispatch, AppState, AppThunk } from '.'
import type { StateRequest } from '@/utils/elements'
import { elementListFetch } from '@/utils/elements'
import { toastError } from '@/utils/toast'

import type { Game } from '@/services/games'
import { gameListGet } from '@/services/gamesAccessors'

const gameAdapter = createEntityAdapter<Game>()

const initialState = gameAdapter.getInitialState({
  readyStatus: 'idle',
} as StateRequest)

const gameListSlice = createSlice({
  name: 'gameList',
  initialState,
  reducers: {
    getRequesting: state => {
      state.readyStatus = 'request'
    },
    getSuccess: (state, { payload }: PayloadAction<Game[]>) => {
      state.readyStatus = 'success'
      gameAdapter.setAll(state, payload)
    },
    getFailure: (state, { payload }: PayloadAction<string>) => {
      state.readyStatus = 'failure'
      state.error = payload
    },
  },
})

export const { reducer: gameListReducer, actions: gameListActions } = gameListSlice

export const fetchGameList = elementListFetch(gameListGet, gameListActions, (error: Error) =>
  toastError(`Erreur lors du chargement des jeux JAV: ${error.message}`))

function selectShouldFetchGameList(state: AppState) {
  return state.gameList.readyStatus !== 'success'
}

export const fetchGameListIfNeed: AppThunk = () => (dispatch: AppDispatch, getState: () => AppState) => {
  if (selectShouldFetchGameList(getState())) {
    dispatch(fetchGameList())
  }
}

// only for test

export const gameListInitialState = initialState
