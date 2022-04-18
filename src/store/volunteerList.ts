import { PayloadAction, createSlice, createEntityAdapter, createSelector } from "@reduxjs/toolkit"

import { StateRequest, toastError, elementListFetch } from "./utils"
import { Volunteer } from "../services/volunteers"
import { AppThunk, AppState, EntitiesRequest } from "."
import { volunteerListGet } from "../services/volunteersAccessors"

const volunteerAdapter = createEntityAdapter<Volunteer>()

export const initialState = volunteerAdapter.getInitialState({
    readyStatus: "idle",
} as StateRequest)

const volunteerList = createSlice({
    name: "volunteerList",
    initialState,
    reducers: {
        getRequesting: (state) => {
            state.readyStatus = "request"
        },
        getSuccess: (state, { payload }: PayloadAction<Volunteer[]>) => {
            state.readyStatus = "success"
            volunteerAdapter.setAll(state, payload)
        },
        getFailure: (state, { payload }: PayloadAction<string>) => {
            state.readyStatus = "failure"
            state.error = payload
        },
    },
})

export default volunteerList.reducer
export const { getRequesting, getSuccess, getFailure } = volunteerList.actions

export const fetchVolunteerList = elementListFetch(
    volunteerListGet,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) => toastError(`Erreur lors du chargement des bénévoles: ${error.message}`)
)

const shouldFetchVolunteerList = (state: AppState) => state.volunteerList.readyStatus !== "success"

export const fetchVolunteerListIfNeed = (): AppThunk => (dispatch, getState) => {
    if (shouldFetchVolunteerList(getState())) return dispatch(fetchVolunteerList())

    return null
}

export const refreshVolunteerList = (): AppThunk => (dispatch) => dispatch(fetchVolunteerList())

export const selectVolunteerListState = (state: AppState): EntitiesRequest<Volunteer> =>
    state.volunteerList

export const selectVolunteerList = createSelector(
    selectVolunteerListState,
    ({ ids, entities, readyStatus }) => {
        if (readyStatus !== "success") return []
        return ids.map((id) => entities[id]) as Volunteer[]
    }
)
