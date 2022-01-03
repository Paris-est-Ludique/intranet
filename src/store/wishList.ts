import { PayloadAction, createSlice, createEntityAdapter } from "@reduxjs/toolkit"

import { StateRequest, toastError, elementListFetch } from "./utils"
import { Wish, wishListGet } from "../services/wishes"
import { AppThunk, AppState } from "."

const wishAdapter = createEntityAdapter<Wish>()

const wishList = createSlice({
    name: "getWishList",
    initialState: wishAdapter.getInitialState({
        readyStatus: "idle",
    } as StateRequest),
    reducers: {
        getRequesting: (state) => {
            state.readyStatus = "request"
        },
        getSuccess: (state, { payload }: PayloadAction<Wish[]>) => {
            state.readyStatus = "success"
            wishAdapter.setAll(state, payload)
        },
        getFailure: (state, { payload }: PayloadAction<string>) => {
            state.readyStatus = "failure"
            state.error = payload
        },
    },
})

export default wishList.reducer
export const { getRequesting, getSuccess, getFailure } = wishList.actions

export const fetchWishList = elementListFetch(
    wishListGet,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) => toastError(`Erreur lors du chargement des envies: ${error.message}`)
)

const shouldFetchWishList = (state: AppState) => state.wishList.readyStatus !== "success"

export const fetchWishListIfNeed = (): AppThunk => (dispatch, getState) => {
    if (shouldFetchWishList(getState())) return dispatch(fetchWishList())

    return null
}
