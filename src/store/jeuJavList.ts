import { PayloadAction, createSlice, createEntityAdapter } from "@reduxjs/toolkit"

import { StateRequest, toastError, elementListFetch } from "./utils"
import { JeuJav, jeuJavListGet } from "../services/jeuxJav"
import { AppThunk, AppState } from "."

const jeuJavAdapter = createEntityAdapter<JeuJav>()

export const initialState = jeuJavAdapter.getInitialState({
    readyStatus: "idle",
} as StateRequest)

const jeuJavList = createSlice({
    name: "jeuJavList",
    initialState,
    reducers: {
        getRequesting: (state) => {
            state.readyStatus = "request"
        },
        getSuccess: (state, { payload }: PayloadAction<JeuJav[]>) => {
            state.readyStatus = "success"
            jeuJavAdapter.setAll(state, payload)
        },
        getFailure: (state, { payload }: PayloadAction<string>) => {
            state.readyStatus = "failure"
            state.error = payload
        },
    },
})

export default jeuJavList.reducer
export const { getRequesting, getSuccess, getFailure } = jeuJavList.actions

export const fetchJeuJavList = elementListFetch(
    jeuJavListGet,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) => toastError(`Erreur lors du chargement des jeux JAV: ${error.message}`)
)

const shouldFetchJeuJavList = (state: AppState) => state.jeuJavList.readyStatus !== "success"

export const fetchJeuJavListIfNeed = (): AppThunk => (dispatch, getState) => {
    if (shouldFetchJeuJavList(getState())) return dispatch(fetchJeuJavList())

    return null
}
