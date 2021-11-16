import { PayloadAction, createSlice, createEntityAdapter } from "@reduxjs/toolkit"

import { StateRequest, toastError, elementListFetch } from "./utils"
import { Membre, membreListGet } from "../services/membres"
import { AppThunk, AppState } from "."

const membreAdapter = createEntityAdapter<Membre>()

export const initialState = membreAdapter.getInitialState({
    readyStatus: "idle",
} as StateRequest)

const membreList = createSlice({
    name: "membreList",
    initialState,
    reducers: {
        getRequesting: (state) => {
            state.readyStatus = "request"
        },
        getSuccess: (state, { payload }: PayloadAction<Membre[]>) => {
            state.readyStatus = "success"
            membreAdapter.setAll(state, payload)
        },
        getFailure: (state, { payload }: PayloadAction<string>) => {
            state.readyStatus = "failure"
            state.error = payload
        },
    },
})

export default membreList.reducer
export const { getRequesting, getSuccess, getFailure } = membreList.actions

export const fetchMembreList = elementListFetch(
    membreListGet,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) => toastError(`Erreur lors du chargement des membres: ${error.message}`)
)

const shouldFetchMembreList = (state: AppState) => state.membreList.readyStatus !== "success"

export const fetchMembreListIfNeed = (): AppThunk => (dispatch, getState) => {
    if (shouldFetchMembreList(getState())) return dispatch(fetchMembreList())

    return null
}
