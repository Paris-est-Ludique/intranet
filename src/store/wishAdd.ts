import type { PayloadAction } from '@reduxjs/toolkit'
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { StateRequest } from '@/utils/elements'
import { elementAddFetch } from '@/utils/elements'
import { toastError, toastSuccess } from '@/utils/toast'

import type { Wish } from '@/services/wishes'
import { wishAdd } from '@/services/wishesAccessors'

const wishAdapter = createEntityAdapter<Wish>()
const initialState = wishAdapter.getInitialState({
  readyStatus: 'idle',
} as StateRequest)

const wishAddSlice = createSlice({
  name: 'wishAdd',
  initialState,
  reducers: {
    getRequesting: state => {
      state.readyStatus = 'request'
    },
    getSuccess: (state, { payload }: PayloadAction<Wish>) => {
      state.readyStatus = 'success'
      wishAdapter.addOne(state, payload)
    },
    getFailure: (state, { payload }: PayloadAction<string>) => {
      state.readyStatus = 'failure'
      state.error = payload
    },
  },
})

export const wishAddActions = wishAddSlice.actions
export const wishAddReducer = wishAddSlice.reducer

export const fetchWishAdd = elementAddFetch(
  wishAdd,
  wishAddActions,
  (error: Error) => toastError(`Erreur lors de l'ajout d'une envie: ${error.message}`),
  () => toastSuccess('Envie ajoutée !'),
)
