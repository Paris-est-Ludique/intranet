import type { PayloadAction } from '@reduxjs/toolkit'
import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'
import type { AppDispatch, AppState, AppThunk, EntitiesRequest } from '.'
import type { StateRequest } from '@/utils/elements'
import { elementListFetch } from '@/utils/elements'
import { toastError } from '@/utils/toast'

import type { MiscFestivalDate } from '@/services/miscs'
import { miscFestivalDateListGet } from '@/services/miscsAccessors'

const miscFestivalDateAdapter = createEntityAdapter<MiscFestivalDate>()

const initialState = miscFestivalDateAdapter.getInitialState({
  readyStatus: 'idle',
} as StateRequest)

const miscFestivalDateListSlice = createSlice({
  name: 'miscFestivalDateList',
  initialState,
  reducers: {
    getRequesting: (state) => {
      state.readyStatus = 'request'
    },
    getSuccess: (state, { payload }: PayloadAction<MiscFestivalDate[]>) => {
      state.readyStatus = 'success'
      miscFestivalDateAdapter.setAll(state, payload)
    },
    getFailure: (state, { payload }: PayloadAction<string>) => {
      state.readyStatus = 'failure'
      state.error = payload
    },
  },
})

export const {
  reducer: miscFestivalDateListReducer,
  actions: miscFestivalDateListActions,
} = miscFestivalDateListSlice

export const fetchMiscFestivalDateList = elementListFetch(
  miscFestivalDateListGet,
  miscFestivalDateListActions,
  (error: Error) => toastError(`Erreur lors du chargement des données diverses: ${error.message}`),
)

function selectShouldFetchMiscFestivalDateList(state: AppState) {
  return state.miscFestivalDateList.readyStatus !== 'success'
}

export const fetchMiscFestivalDateListIfNeed: AppThunk = () => (dispatch: AppDispatch, getState: () => AppState) => {
  if (selectShouldFetchMiscFestivalDateList(getState()))
    dispatch(fetchMiscFestivalDateList())
}

export const refreshMiscFestivalDateList: AppThunk = () => (dispatch: AppDispatch) => dispatch(fetchMiscFestivalDateList())

export function selectMiscFestivalDateListState(state: AppState): EntitiesRequest<MiscFestivalDate> {
  return state.miscFestivalDateList
}

export const selectMiscFestivalDateList = createSelector(
  selectMiscFestivalDateListState,
  ({ ids, entities, readyStatus }) => {
    if (readyStatus !== 'success')
      return []
    return ids.map(id => entities[id]) as MiscFestivalDate[]
  },
)
