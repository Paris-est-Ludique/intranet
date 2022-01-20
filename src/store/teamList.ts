import { PayloadAction, createSlice, createEntityAdapter } from "@reduxjs/toolkit"

import { StateRequest, toastError, elementListFetch } from "./utils"
import { Team, teamListGet } from "../services/teams"
import { AppThunk, AppState } from "."

const teamAdapter = createEntityAdapter<Team>()

export const initialState = teamAdapter.getInitialState({
    readyStatus: "idle",
} as StateRequest)

const teamList = createSlice({
    name: "teamList",
    initialState,
    reducers: {
        getRequesting: (state) => {
            state.readyStatus = "request"
        },
        getSuccess: (state, { payload }: PayloadAction<Team[]>) => {
            state.readyStatus = "success"
            teamAdapter.setAll(state, payload)
        },
        getFailure: (state, { payload }: PayloadAction<string>) => {
            state.readyStatus = "failure"
            state.error = payload
        },
    },
})

export default teamList.reducer
export const { getRequesting, getSuccess, getFailure } = teamList.actions

export const fetchTeamList = elementListFetch(
    teamListGet,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) => toastError(`Erreur lors du chargement des équipes: ${error.message}`)
)

const shouldFetchTeamList = (state: AppState) => state.teamList.readyStatus !== "success"

export const fetchTeamListIfNeed = (): AppThunk => (dispatch, getState) => {
    if (shouldFetchTeamList(getState())) return dispatch(fetchTeamList())

    return null
}
