import { PayloadAction, createSlice, createEntityAdapter, createSelector } from "@reduxjs/toolkit"

import { StateRequest, toastError, elementListFetch } from "./utils"
import { MiscMeetingDate } from "../services/miscs"
import { AppThunk, AppState, EntitiesRequest } from "."
import { miscMeetingDateListGet } from "../services/miscsAccessors"

const miscAdapter = createEntityAdapter<MiscMeetingDate>()

export const initialState = miscAdapter.getInitialState({
    readyStatus: "idle",
} as StateRequest)

const miscMeetingDateList = createSlice({
    name: "miscMeetingDateList",
    initialState,
    reducers: {
        getRequesting: (state) => {
            state.readyStatus = "request"
        },
        getSuccess: (state, { payload }: PayloadAction<MiscMeetingDate[]>) => {
            state.readyStatus = "success"
            miscAdapter.setAll(state, payload)
        },
        getFailure: (state, { payload }: PayloadAction<string>) => {
            state.readyStatus = "failure"
            state.error = payload
        },
    },
})

export default miscMeetingDateList.reducer
export const { getRequesting, getSuccess, getFailure } = miscMeetingDateList.actions

export const fetchMiscMeetingDateList = elementListFetch(
    miscMeetingDateListGet,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) => toastError(`Erreur lors du chargement des données diverses: ${error.message}`)
)

const shouldFetchMiscMeetingDateList = (state: AppState) =>
    state.miscMeetingDateList.readyStatus !== "success"

export const fetchMiscMeetingDateListIfNeed = (): AppThunk => (dispatch, getState) => {
    if (shouldFetchMiscMeetingDateList(getState())) return dispatch(fetchMiscMeetingDateList())

    return null
}

export const refreshMiscMeetingDateList = (): AppThunk => (dispatch) =>
    dispatch(fetchMiscMeetingDateList())

export const selectMiscMeetingDateListState = (state: AppState): EntitiesRequest<MiscMeetingDate> =>
    state.miscMeetingDateList

export const selectMiscMeetingDateList = createSelector(
    selectMiscMeetingDateListState,
    ({ ids, entities, readyStatus }) => {
        if (readyStatus !== "success") return []
        return ids.map((id) => entities[id]) as MiscMeetingDate[]
    }
)
