import type { PayloadAction } from '@reduxjs/toolkit'
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { AppDispatch, AppState, AppThunk } from '.'
import type { StateRequest } from '@/utils/elements'
import { elementListFetch } from '@/utils/elements'
import { toastError, toastSuccess } from '@/utils/toast'

import type { Game } from '@/services/games'
import { gameDetailsUpdate } from '@/services/gamesAccessors'

const gameAdapter = createEntityAdapter<Game>()

const initialState = gameAdapter.getInitialState({
  readyStatus: 'idle',
} as StateRequest)

const gameDetailsUpdateSlice = createSlice({
  name: 'gameDetailsUpdate',
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

export const gameDetailsUpdateActions = gameDetailsUpdateSlice.actions
export const gameDetailsUpdateReducer = gameDetailsUpdateSlice.reducer

export const fetchGameDetailsUpdate = elementListFetch(
  gameDetailsUpdate,
  gameDetailsUpdateActions,
  (error: Error) => toastError(`Erreur lors de la modification d'un bénévole: ${error.message}`),
  () => toastSuccess('Bénévole modifié !'),
)

function selectShouldFetchGameDetailsUpdate(state: AppState) {
  return state.volunteerList.readyStatus !== 'success'
}

export const fetchGameDetailsUpdateIfNeed: AppThunk = () => (dispatch: AppDispatch, getState: () => AppState) => {
  const { jwt } = getState().auth

  if (selectShouldFetchGameDetailsUpdate(getState())) {
    dispatch(fetchGameDetailsUpdate(jwt))
  }
}
