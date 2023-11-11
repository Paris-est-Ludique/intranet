import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'
import type { AppDispatch, AppState, AppThunk } from '.'
import type { StateRequest } from '@/utils/elements'
import { elementFetch } from '@/utils/elements'
import { toastError } from '@/utils/toast'

import type { Retex } from '@/services/retex'
import { retexSet } from '@/services/retexAccessors'

type StateRetex = { entity?: Retex } & StateRequest

const initialState: StateRetex = {
  readyStatus: 'idle',
}

const retexSetSlice = createSlice({
  name: 'retexSet',
  initialState,
  reducers: {
    getRequesting: () => ({
      readyStatus: 'request',
    }),
    getSuccess: (_state, { payload }: PayloadAction<Retex>) => ({
      readyStatus: 'success',
      entity: payload,
    }),
    getFailure: (_state, { payload }: PayloadAction<string>) => ({
      readyStatus: 'failure',
      error: payload,
    }),
  },
})

export const {
  reducer: retexSetReducer,
  actions: retexSetActions,
} = retexSetSlice

export const fetchRetexSet = elementFetch(
  retexSet,
  retexSetActions,
  (error: Error) => toastError(`Erreur lors de la modification d'un retex: ${error.message}`),
)

export const fetchRetexSetIfNeed: AppThunk = (newPartialRetex?: Partial<Retex>) => (dispatch: AppDispatch, getState: () => AppState) => {
  const { jwt, id } = getState().auth

  dispatch(fetchRetexSet(jwt, newPartialRetex || { id }))
}

export const selectRetexSet = createSelector(
  (state: AppState) => state,
  (state: AppState): Retex | undefined => state.retexSet?.entity,
)
