import { PayloadAction, createSlice } from "@reduxjs/toolkit"

import { JeuxJav, getJeuxJavList } from "../services/jeuxJav"
import { AppThunk, AppState } from "."

interface JeuxJavList {
    readyStatus: string
    items: JeuxJav[]
    error: string | null
}

export const initialState: JeuxJavList = {
    readyStatus: "invalid",
    items: [],
    error: null,
}

const jeuxJavList = createSlice({
    name: "jeuxJavList",
    initialState,
    reducers: {
        getRequesting: (state: JeuxJavList) => {
            state.readyStatus = "request"
        },
        getSuccess: (state, { payload }: PayloadAction<JeuxJav[]>) => {
            state.readyStatus = "success"
            state.items = payload
        },
        getFailure: (state, { payload }: PayloadAction<string>) => {
            state.readyStatus = "failure"
            state.error = payload
        },
    },
})

export default jeuxJavList.reducer
export const { getRequesting, getSuccess, getFailure } = jeuxJavList.actions

export const fetchJeuxJavList = (): AppThunk => async (dispatch) => {
    dispatch(getRequesting())

    const { error, data } = await getJeuxJavList()

    if (error) {
        dispatch(getFailure(error.message))
    } else {
        dispatch(getSuccess(data as JeuxJav[]))
    }
}

const shouldFetchJeuxJavList = (state: AppState) => state.jeuxJavList.readyStatus !== "success"

export const fetchJeuxJavListIfNeed = (): AppThunk => (dispatch, getState) => {
    if (shouldFetchJeuxJavList(getState())) return dispatch(fetchJeuxJavList())

    return null
}
