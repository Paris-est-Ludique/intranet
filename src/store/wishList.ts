import type { PayloadAction } from '@reduxjs/toolkit'
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { StateRequest } from './utils'
import { elementListFetch, toastError } from './utils'
import type { AppDispatch, AppState, AppThunk } from '.'

import type { Wish } from '@/services/wishes'
import { wishListGet } from '@/services/wishesAccessors'

const wishAdapter = createEntityAdapter<Wish>()
const initialState = wishAdapter.getInitialState({
  readyStatus: 'idle',
} as StateRequest)

const wishListSlice = createSlice({
  name: 'wishList',
  initialState,
  reducers: {
    getRequesting: (state) => {
      state.readyStatus = 'request'
    },
    getSuccess: (state, { payload }: PayloadAction<Wish[]>) => {
      state.readyStatus = 'success'
      wishAdapter.setAll(state, payload)
    },
    getFailure: (state, { payload }: PayloadAction<string>) => {
      state.readyStatus = 'failure'
      state.error = payload
    },
  },
})

export const {
  reducer: wishListReducer,
  actions: wishListActions,
} = wishListSlice

export const fetchWishList = elementListFetch(
  wishListGet,
  wishListActions,
  (error: Error) => toastError(`Erreur lors du chargement des envies: ${error.message}`),
)

export const selectShouldFetchWishList = (state: AppState) => state.wishList.readyStatus !== 'success'

export const fetchWishListIfNeed: AppThunk = () =>
  (dispatch: AppDispatch, getState: () => AppState) => {
    const shouldFetch = selectShouldFetchWishList(getState())
    if (shouldFetch) {
      dispatch(fetchWishList())
    }
  }
