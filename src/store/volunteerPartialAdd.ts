import type { PayloadAction } from '@reduxjs/toolkit'
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { StateRequest } from '@/utils/elements'
import { elementAddFetch } from '@/utils/elements'
import { toastError } from '@/utils/toast'

import type { Volunteer } from '@/services/volunteers'
import { volunteerPartialAdd } from '@/services/volunteersAccessors'

const volunteerAdapter = createEntityAdapter<Volunteer>()

const initialState = volunteerAdapter.getInitialState({
  readyStatus: 'idle',
} as StateRequest)

const volunteerPartialAddSlice = createSlice({
  name: 'volunteerPartialAdd',
  initialState,
  reducers: {
    getRequesting: (state) => {
      state.readyStatus = 'request'
    },
    getSuccess: (state, { payload }: PayloadAction<Volunteer>) => {
      state.readyStatus = 'success'
      volunteerAdapter.setOne(state, payload)
    },
    getFailure: (state, { payload }: PayloadAction<string>) => {
      state.readyStatus = 'failure'
      state.error = payload
    },
  },
})

export const {
  reducer: volunteerPartialAddReducer,
  actions: volunteerPartialAddActions,
} = volunteerPartialAddSlice

export const fetchVolunteerPartialAdd = elementAddFetch(
  volunteerPartialAdd,
  volunteerPartialAddActions,
  () => toastError('Erreur d\'inscription !'),
  () => null,
)
