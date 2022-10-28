import { PayloadAction, createSlice, createEntityAdapter, createSelector } from "@reduxjs/toolkit"
import { sortedUniqBy, sortBy } from "lodash"

import { StateRequest, toastError, elementListFetch, gameTitleOrder } from "./utils"
import { GameWithVolunteers } from "../services/games"
import { AppThunk, AppState, EntitiesRequest } from "."
import { gameWithVolunteersListGet } from "../services/gamesAccessors"

const gameAdapter = createEntityAdapter<GameWithVolunteers>()

export const initialState = gameAdapter.getInitialState({
    readyStatus: "idle",
} as StateRequest)

const gameWithVolunteersList = createSlice({
    name: "gameWithVolunteersList",
    initialState,
    reducers: {
        getRequesting: (state) => {
            state.readyStatus = "request"
        },
        getSuccess: (state, { payload }: PayloadAction<GameWithVolunteers[]>) => {
            state.readyStatus = "success"
            gameAdapter.setAll(state, payload)
        },
        getFailure: (state, { payload }: PayloadAction<string>) => {
            state.readyStatus = "failure"
            state.error = payload
        },
    },
})

export default gameWithVolunteersList.reducer
export const { getRequesting, getSuccess, getFailure } = gameWithVolunteersList.actions

export const fetchGameWithVolunteersList = elementListFetch(
    gameWithVolunteersListGet,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) => toastError(`Erreur lors du chargement des jeux JAV: ${error.message}`)
)

const shouldFetchGameWithVolunteersList = (state: AppState) =>
    state.gameWithVolunteersList.readyStatus !== "success"

export const fetchGameWithVolunteersListIfNeed = (): AppThunk => (dispatch, getState) => {
    const { jwt } = getState().auth
    if (shouldFetchGameWithVolunteersList(getState()))
        return dispatch(fetchGameWithVolunteersList(jwt))

    return null
}

export const selectGameWithVolunteersListState = (
    state: AppState
): EntitiesRequest<GameWithVolunteers> => state.gameWithVolunteersList

export const selectGameWithVolunteersList = createSelector(
    selectGameWithVolunteersListState,
    ({ ids, entities, readyStatus }) => {
        if (readyStatus !== "success") return []
        return ids.map((id) => entities[id])
    }
)

export const selectSortedUniqueGamesWithVolunteers = createSelector(
    selectGameWithVolunteersList,
    (games) => {
        const gameWithVolunteers = games.filter((game) => game) as GameWithVolunteers[]
        return sortedUniqBy(sortBy(gameWithVolunteers, gameTitleOrder), gameTitleOrder)
    }
)
