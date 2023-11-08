import type { PayloadAction } from '@reduxjs/toolkit'
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { ActionsCreators, StateRequest } from './utils'
import { elementListFetch, toastError } from './utils'
import type { AppDispatch, AppState, AppThunk } from '.'

import type { Announcement } from '@/services/announcement'
import { announcementListGet } from '@/services/announcementAccessors'

const announcementAdapter = createEntityAdapter<Announcement>()

const initialState = announcementAdapter.getInitialState({
  readyStatus: 'idle',
} as StateRequest)

export const announcementListSlice = createSlice({
  name: 'announcementList',
  initialState,
  reducers: {
    getRequesting: (state) => {
      state.readyStatus = 'request'
    },
    getSuccess: (state, { payload }: PayloadAction<Announcement[]>) => {
      state.readyStatus = 'success'
      announcementAdapter.setAll(state, payload)
    },
    getFailure: (state, { payload }: PayloadAction<string>) => {
      state.readyStatus = 'failure'
      state.error = payload
    },
  },
})

export const {
  actions: announcementListActions,
  reducer: announcementListReducer,
} = announcementListSlice

export const fetchAnnouncementList = elementListFetch(
  announcementListGet,
  announcementListActions,
  (error: Error) => toastError(`Erreur lors du chargement des announcements: ${error.message}`),
)

export const fetchAnnouncementListIfNeed: AppThunk = () => (dispatch: AppDispatch, getState: () => AppState) => {
  const { jwt } = getState().auth

  if (getState().announcementList.readyStatus !== 'success') {
    dispatch(fetchAnnouncementList(jwt))
  }
}
