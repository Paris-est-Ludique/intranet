import { PayloadAction, createSlice } from "@reduxjs/toolkit"

import { Envie, getEnvieList } from "../services/envies"
import { AppThunk, AppState } from "."

interface EnvieList {
    readyStatus: string
    items: Envie[]
    error: string | null
}

export const initialState: EnvieList = {
    readyStatus: "invalid",
    items: [],
    error: null,
}

const envieList = createSlice({
    name: "envieList",
    initialState,
    reducers: {
        getRequesting: (state: EnvieList) => {
            state.readyStatus = "request"
        },
        getSuccess: (state, { payload }: PayloadAction<Envie[]>) => {
            state.readyStatus = "success"
            state.items = payload
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
    } else {
        dispatch(getSuccess(data as Envie[]))
    }
}

const shouldFetchEnvieList = (state: AppState) => state.envieList.readyStatus !== "success"

export const fetchEnvieListIfNeed = (): AppThunk => (dispatch, getState) => {
    if (shouldFetchEnvieList(getState())) return dispatch(fetchEnvieList())

    return null
}
