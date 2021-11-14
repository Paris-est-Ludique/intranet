import { PayloadAction, createSlice, createEntityAdapter } from "@reduxjs/toolkit"
import { toast } from "react-toastify"

import { StateRequest } from "./utils"
import { Membre, getMembreList } from "../services/membres"
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

export const fetchMembreList = (): AppThunk => async (dispatch) => {
    dispatch(getRequesting())

    const { error, data } = await getMembreList()

    if (error) {
        dispatch(getFailure(error.message))
        toast.error(`Erreur lors du chargement des utilisateurs: ${error.message}`, {
            position: "top-center",
            autoClose: 6000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
    } else {
        dispatch(getSuccess(data as Membre[]))
    }
}

const shouldFetchMembreList = (state: AppState) => state.membreList.readyStatus !== "success"

export const fetchMembreListIfNeed = (): AppThunk => (dispatch, getState) => {
    if (shouldFetchMembreList(getState())) return dispatch(fetchMembreList())

    return null
}
