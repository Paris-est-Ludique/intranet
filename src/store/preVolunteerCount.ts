import { PayloadAction, createSlice } from "@reduxjs/toolkit"

import { StateRequest, toastError, elementValueFetch } from "./utils"
import { preVolunteerCountGet } from "../services/preVolunteers"
import { AppThunk, AppState } from "."

export const initialState: StateRequest & { value?: number } = { readyStatus: "idle" }

const preVolunteerCount = createSlice({
    name: "preVolunteerCount",
    initialState,
    reducers: {
        getRequesting: (state) => {
            state.readyStatus = "request"
        },
        getSuccess: (state, { payload }: PayloadAction<number>) => {
            state.readyStatus = "success"
            state.value = payload
        },
        getFailure: (state, { payload }: PayloadAction<string>) => {
            state.readyStatus = "failure"
            state.error = payload
        },
    },
})

export default preVolunteerCount.reducer
export const { getRequesting, getSuccess, getFailure } = preVolunteerCount.actions

export const fetchPreVolunteerCount = elementValueFetch(
    preVolunteerCountGet,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) =>
        toastError(`Erreur lors du chargement des bénévoles potentiels: ${error.message}`)
)

const shouldFetchPreVolunteerCount = (state: AppState) =>
    state.preVolunteerCount.readyStatus !== "success"

export const fetchPreVolunteerCountIfNeed = (): AppThunk => (dispatch, getState) => {
    if (shouldFetchPreVolunteerCount(getState())) return dispatch(fetchPreVolunteerCount())

    return null
}
