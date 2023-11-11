import type { PayloadAction } from '@reduxjs/toolkit'
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { AppDispatch, AppState, AppThunk } from '.'
import type { StateRequest } from '@/utils/elements'
import { elementAddFetch } from '@/utils/elements'
import { toastError } from '@/utils/toast'

import type { Volunteer } from '@/services/volunteers'
import { volunteerAddNew } from '@/services/volunteersAccessors'

const volunteerAdapter = createEntityAdapter<Volunteer>()
const initialState = volunteerAdapter.getInitialState({
  readyStatus: 'idle',
} as StateRequest)

const volunteerAddNewSlice = createSlice({
  name: 'volunteerAddNew',
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
  reducer: volunteerAddNewReducer,
  actions: volunteerAddNewActions,
} = volunteerAddNewSlice

export const fetchVolunteerAddNew = elementAddFetch(
  volunteerAddNew,
  volunteerAddNewActions,
  () => toastError('Erreur d\'ajout !'),
  () => null,
)

export const fetchVolunteerAddNewIfNeed: AppThunk = () => (dispatch: AppDispatch, getState: () => AppState) => {
  const { jwt } = getState().auth

  dispatch(fetchVolunteerAddNew(jwt))
}
