import { PayloadAction, createSlice, createEntityAdapter } from "@reduxjs/toolkit"
import { toast } from "react-toastify"

import { StateRequest } from "./utils"
import { JeuJav, getJeuJavList } from "../services/jeuJav"
import { AppThunk, AppState } from "."

const jeuJavAdapter = createEntityAdapter<JeuJav>({
    selectId: (jeuJav) => jeuJav.id,
})

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

export const fetchJeuJavList = (): AppThunk => async (dispatch) => {
    dispatch(getRequesting())

    const { error, data } = await getJeuJavList()

    if (error) {
        dispatch(getFailure(error.message))
        toast.error(`Erreur lors du chargement des jeux JAV: ${error.message}`, {
            position: "top-center",
            autoClose: 6000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
    } else {
        dispatch(getSuccess(data as JeuJav[]))
    }
}

const shouldFetchJeuJavList = (state: AppState) => state.jeuJavList.readyStatus !== "success"

export const fetchJeuJavListIfNeed = (): AppThunk => (dispatch, getState) => {
    if (shouldFetchJeuJavList(getState())) return dispatch(fetchJeuJavList())

    return null
}
