import { PayloadAction, createSlice, createEntityAdapter } from "@reduxjs/toolkit"

import { StateRequest, toastError, elementListFetch } from "./utils"
import { JavGame } from "../services/javGames"
import { AppThunk, AppState } from "."
import { javGameListGet } from "../services/javGamesAccessors"

const javGameAdapter = createEntityAdapter<JavGame>()

export const initialState = javGameAdapter.getInitialState({
    readyStatus: "idle",
} as StateRequest)

const javGameList = createSlice({
    name: "javGameList",
    initialState,
    reducers: {
        getRequesting: (state) => {
            state.readyStatus = "request"
        },
        getSuccess: (state, { payload }: PayloadAction<JavGame[]>) => {
            state.readyStatus = "success"
            javGameAdapter.setAll(state, payload)
        },
        getFailure: (state, { payload }: PayloadAction<string>) => {
            state.readyStatus = "failure"
            state.error = payload
        },
    },
})

export default javGameList.reducer
export const { getRequesting, getSuccess, getFailure } = javGameList.actions

export const fetchJavGameList = elementListFetch(
    javGameListGet,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) => toastError(`Erreur lors du chargement des jeux JAV: ${error.message}`)
)

const shouldFetchJavGameList = (state: AppState) => state.javGameList.readyStatus !== "success"

export const fetchJavGameListIfNeed = (): AppThunk => (dispatch, getState) => {
    if (shouldFetchJavGameList(getState())) return dispatch(fetchJavGameList())

    return null
}
