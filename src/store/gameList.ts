import { PayloadAction, createSlice, createEntityAdapter } from "@reduxjs/toolkit"

import { StateRequest, toastError, elementListFetch } from "./utils"
import { Game } from "../services/games"
import { AppThunk, AppState } from "."
import { gameListGet } from "../services/gamesAccessors"

const gameAdapter = createEntityAdapter<Game>()

export const initialState = gameAdapter.getInitialState({
    readyStatus: "idle",
} as StateRequest)

const gameList = createSlice({
    name: "gameList",
    initialState,
    reducers: {
        getRequesting: (state) => {
            state.readyStatus = "request"
        },
        getSuccess: (state, { payload }: PayloadAction<Game[]>) => {
            state.readyStatus = "success"
            gameAdapter.setAll(state, payload)
        },
        getFailure: (state, { payload }: PayloadAction<string>) => {
            state.readyStatus = "failure"
            state.error = payload
        },
    },
})

export default gameList.reducer
export const { getRequesting, getSuccess, getFailure } = gameList.actions

export const fetchGameList = elementListFetch(
    gameListGet,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) => toastError(`Erreur lors du chargement des jeux JAV: ${error.message}`)
)

const shouldFetchGameList = (state: AppState) => state.gameList.readyStatus !== "success"

export const fetchGameListIfNeed = (): AppThunk => (dispatch, getState) => {
    if (shouldFetchGameList(getState())) return dispatch(fetchGameList())

    return null
}
