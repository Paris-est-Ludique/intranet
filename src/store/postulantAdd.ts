import type { PayloadAction } from '@reduxjs/toolkit'
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { StateRequest } from './utils'
import { elementAddFetch } from './utils'

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
    getRequesting: (state) => {
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

export const {
  reducer: postulantAddReducer,
  actions: postulantAddActions,
} = postulantAddSlice

export const fetchPostulantAdd = elementAddFetch(
  postulantAdd,
  postulantAddActions,
  () => null,
  () => null,
)
