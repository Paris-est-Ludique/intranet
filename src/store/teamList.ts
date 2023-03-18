import { PayloadAction, createSlice, createEntityAdapter, createSelector } from "@reduxjs/toolkit"
import get from "lodash/get"

import { StateRequest, toastError, elementListFetch } from "./utils"
import { Team } from "../services/teams"
import { AppThunk, AppState, EntitiesRequest } from "."
import { teamListGet } from "../services/teamsAccessors"

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

export const selectTeamListState = (state: AppState): EntitiesRequest<Team> => state.teamList

export const selectTeamList = createSelector(
    selectTeamListState,
    ({ ids, entities, readyStatus }) => {
        if (readyStatus !== "success") return []
        return ids.map((id) => entities[id])
    }
)

export const selectSortedTeams = createSelector(selectTeamList, (teams) =>
    [...teams].sort((a, b) => get(a, "order", 0) - get(b, "order", 0))
)

export const selectSortedActiveTeams = createSelector(selectTeamList, (teams) =>
    [...teams.filter((team) => get(team, "status") === "active")].sort(
        (a, b) => get(a, "order", 0) - get(b, "order", 0)
    )
)
