import type { PayloadAction } from '@reduxjs/toolkit'
import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'
import type { AppDispatch, AppState, AppThunk, EntitiesRequest } from '.'
import type { StateRequest } from '@/utils/elements'
import { elementListFetch } from '@/utils/elements'
import { toastError } from '@/utils/toast'

import type { MiscMeetingDate } from '@/services/miscs'
import { miscMeetingDateListGet } from '@/services/miscsAccessors'

const miscMeetingDateAdapter = createEntityAdapter<MiscMeetingDate>()

const initialState = miscMeetingDateAdapter.getInitialState({
  readyStatus: 'idle',
} as StateRequest)

const miscMeetingDateListSlice = createSlice({
  name: 'miscMeetingDateList',
  initialState,
  reducers: {
    getRequesting: state => {
      state.readyStatus = 'request'
    },
    getSuccess: (state, { payload }: PayloadAction<MiscMeetingDate[]>) => {
      state.readyStatus = 'success'
      miscMeetingDateAdapter.setAll(state, payload)
    },
    getFailure: (state, { payload }: PayloadAction<string>) => {
      state.readyStatus = 'failure'
      state.error = payload
    },
  },
})

export const { reducer: miscMeetingDateListReducer, actions: miscMeetingDateListActions } = miscMeetingDateListSlice

export const fetchMiscMeetingDateList = elementListFetch(
  miscMeetingDateListGet,
  miscMeetingDateListActions,
  (error: Error) => toastError(`Erreur lors du chargement des données diverses: ${error.message}`),
)

function selectShouldFetchMiscMeetingDateList(state: AppState) {
  return state.miscMeetingDateList.readyStatus !== 'success'
}

export const fetchMiscMeetingDateListIfNeed: AppThunk = () => (dispatch: AppDispatch, getState: () => AppState) => {
  if (selectShouldFetchMiscMeetingDateList(getState())) {
    dispatch(fetchMiscMeetingDateList())
  }
}

export const refreshMiscMeetingDateList: AppThunk = () => (dispatch: AppDispatch) =>
  dispatch(fetchMiscMeetingDateList())

export function selectMiscMeetingDateListState(state: AppState): EntitiesRequest<MiscMeetingDate> {
  return state.miscMeetingDateList
}

export const selectMiscMeetingDateList = createSelector(
  selectMiscMeetingDateListState,
  ({ ids, entities, readyStatus }) => {
    if (readyStatus !== 'success') {
      return []
    }

    return ids.map(id => entities[id]) as MiscMeetingDate[]
  },
)
