import { PayloadAction, createSlice, createEntityAdapter } from "@reduxjs/toolkit"

import { StateRequest, toastError, elementListFetch } from "./utils"
import { Envie, envieListGet } from "../services/envies"
import { AppThunk, AppState } from "."

const envieAdapter = createEntityAdapter<Envie>()

const envieList = createSlice({
    name: "getEnvieList",
    initialState: envieAdapter.getInitialState({
        readyStatus: "idle",
    } as StateRequest),
    reducers: {
        getRequesting: (state) => {
            state.readyStatus = "request"
        },
        getSuccess: (state, { payload }: PayloadAction<Envie[]>) => {
            state.readyStatus = "success"
            envieAdapter.setAll(state, payload)
        },
        getFailure: (state, { payload }: PayloadAction<string>) => {
            state.readyStatus = "failure"
            state.error = payload
        },
    },
})

export default envieList.reducer
export const { getRequesting, getSuccess, getFailure } = envieList.actions

export const fetchEnvieList = elementListFetch(
    envieListGet,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) => toastError(`Erreur lors du chargement des envies: ${error.message}`)
)

const shouldFetchEnvieList = (state: AppState) => state.envieList.readyStatus !== "success"

export const fetchEnvieListIfNeed = (): AppThunk => (dispatch, getState) => {
    if (shouldFetchEnvieList(getState())) return dispatch(fetchEnvieList())

    return null
}
