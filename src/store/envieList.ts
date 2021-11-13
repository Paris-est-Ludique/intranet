import { PayloadAction, createSlice, createEntityAdapter } from "@reduxjs/toolkit"
import { toast } from "react-toastify"

import { StateRequest } from "./utils"
import { Envie, getEnvieList } from "../services/envies"
import { AppThunk, AppState } from "."

const envieAdapter = createEntityAdapter<Envie>({
    selectId: (envie) => envie.envieId,
})

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

export const fetchEnvieList = (): AppThunk => async (dispatch) => {
    dispatch(getRequesting())

    const { error, data } = await getEnvieList()

    if (error) {
        dispatch(getFailure(error.message))
        toast.error(`Erreur lors du chargement des envies: ${error.message}`, {
            position: "top-center",
            autoClose: 6000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
    } else {
        dispatch(getSuccess(data as Envie[]))
    }
}

const shouldFetchEnvieList = (state: AppState) => state.envieList.readyStatus !== "success"

export const fetchEnvieListIfNeed = (): AppThunk => (dispatch, getState) => {
    if (shouldFetchEnvieList(getState())) return dispatch(fetchEnvieList())

    return null
}
