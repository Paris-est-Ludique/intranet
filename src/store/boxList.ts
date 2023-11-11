import sortBy from 'lodash/sortBy'
import sortedUniqBy from 'lodash/sortedUniqBy'

import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AppDispatch, AppState, AppThunk, EntitiesRequest } from '.'
import type { StateRequest } from '@/utils/elements'
import { elementListFetch } from '@/utils/elements'
import { toastError } from '@/utils/toast'
import { gameTitleOrder } from '@/utils/games'
import type { DetailedBox } from '@/services/boxes'
import { detailedBoxListGet } from '@/services/boxesAccessors'

const boxAdapter = createEntityAdapter<DetailedBox>()

const initialState = boxAdapter.getInitialState({
  readyStatus: 'idle',
} as StateRequest)

export const boxListSlice = createSlice({
  name: 'boxList',
  initialState,
  reducers: {
    getRequesting: (state: StateRequest) => {
      state.readyStatus = 'request'
    },
    getSuccess: (state: StateRequest, { payload }: PayloadAction<DetailedBox[]>) => {
      state.readyStatus = 'success'
      boxAdapter.setAll(state, payload)
    },
    getFailure: (state: StateRequest, { payload }: PayloadAction<string>) => {
      state.readyStatus = 'failure'
      state.error = payload
    },
  },
})

export const {
  actions: boxListActions,
  reducer: boxListReducer,
} = boxListSlice

export const fetchBoxList = elementListFetch(
  detailedBoxListGet,
  boxListActions,
  (error: Error) => toastError(`Erreur lors du chargement des jeux JAV: ${error.message}`),
)

const selectShouldFetchBoxList = (state: AppState) => state.boxList.readyStatus !== 'success'

export const fetchBoxListIfNeed: AppThunk = () => (dispatch: AppDispatch, getState: () => AppState) => {
  if (selectShouldFetchBoxList(getState())) {
    dispatch(fetchBoxList())
  }
}

export const selectBoxListState = (state: AppState): EntitiesRequest<DetailedBox> => state.boxList

export const selectBoxList = createSelector(
  selectBoxListState,
  ({ ids, entities, readyStatus }) => {
    if (readyStatus !== 'success')
      return []
    return ids.map(id => entities[id])
  },
)

export const selectSortedUniqueDetailedBoxes = createSelector(selectBoxList, (boxes: []) => {
  const validBoxes = boxes.filter(box => box) as DetailedBox[]
  return sortedUniqBy(sortBy(validBoxes, gameTitleOrder), gameTitleOrder)
})

export const selectContainerSortedDetailedBoxes = createSelector(selectBoxList, (boxes: []) =>
  sortBy(boxes, 'container'))
