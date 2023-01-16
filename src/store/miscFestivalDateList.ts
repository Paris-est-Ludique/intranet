import { PayloadAction, createSlice, createEntityAdapter, createSelector } from "@reduxjs/toolkit"

import { StateRequest, toastError, elementListFetch } from "./utils"
import { MiscFestivalDate } from "../services/miscs"
import { AppThunk, AppState, EntitiesRequest } from "."
import { miscFestivalDateListGet } from "../services/miscsAccessors"

const miscAdapter = createEntityAdapter<MiscFestivalDate>()

export const initialState = miscAdapter.getInitialState({
    readyStatus: "idle",
} as StateRequest)

const miscFestivalDateList = createSlice({
    name: "miscFestivalDateList",
    initialState,
    reducers: {
        getRequesting: (state) => {
            state.readyStatus = "request"
        },
        getSuccess: (state, { payload }: PayloadAction<MiscFestivalDate[]>) => {
            state.readyStatus = "success"
            miscAdapter.setAll(state, payload)
        },
        getFailure: (state, { payload }: PayloadAction<string>) => {
            state.readyStatus = "failure"
            state.error = payload
        },
    },
})

export default miscFestivalDateList.reducer
export const { getRequesting, getSuccess, getFailure } = miscFestivalDateList.actions

export const fetchMiscFestivalDateList = elementListFetch(
    miscFestivalDateListGet,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) => toastError(`Erreur lors du chargement des données diverses: ${error.message}`)
)

const shouldFetchMiscFestivalDateList = (state: AppState) =>
    state.miscFestivalDateList.readyStatus !== "success"

export const fetchMiscFestivalDateListIfNeed = (): AppThunk => (dispatch, getState) => {
    if (shouldFetchMiscFestivalDateList(getState())) return dispatch(fetchMiscFestivalDateList())

    return null
}

export const refreshMiscFestivalDateList = (): AppThunk => (dispatch) =>
    dispatch(fetchMiscFestivalDateList())

export const selectMiscFestivalDateListState = (
    state: AppState
): EntitiesRequest<MiscFestivalDate> => state.miscFestivalDateList

export const selectMiscFestivalDateList = createSelector(
    selectMiscFestivalDateListState,
    ({ ids, entities, readyStatus }) => {
        if (readyStatus !== "success") return []
        return ids.map((id) => entities[id]) as MiscFestivalDate[]
    }
)
