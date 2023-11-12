import type { PayloadAction } from '@reduxjs/toolkit'
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { StateRequest } from '@/utils/elements'
import { elementAddFetch } from '@/utils/elements'

import type { Postulant } from '@/services/postulants'
import { postulantAdd } from '@/services/postulantsAccessors'

const postulantAdapter = createEntityAdapter<Postulant>()

const initialState = postulantAdapter.getInitialState({
  readyStatus: 'idle',
} as StateRequest)

const postulantAddSlice = createSlice({
  name: 'postulantAdd',
  initialState,
  reducers: {
    getRequesting: state => {
      state.readyStatus = 'request'
    },
    getSuccess: (state, { payload }: PayloadAction<Postulant>) => {
      state.readyStatus = 'success'
      postulantAdapter.setOne(state, payload)
    },
    getFailure: (state, { payload }: PayloadAction<string>) => {
      state.readyStatus = 'failure'
      state.error = payload
    },
  },
})

export const postulantAddActions = postulantAddSlice.actions
export const postulantAddReducer = postulantAddSlice.reducer

export const fetchPostulantAdd = elementAddFetch(
  postulantAdd,
  postulantAddActions,
  () => null,
  () => null,
)
