import { PayloadAction, createSlice } from "@reduxjs/toolkit"

import { JavGame, getJavGameList } from "../services/javGames"
import { AppThunk, AppState } from "."

interface JavGameList {
    readyStatus: string
    items: JavGame[]
    error: string | null
}

export const initialState: JavGameList = {
    readyStatus: "invalid",
    items: [],
    error: null,
}

const javGameList = createSlice({
    name: "javGameList",
    initialState,
    reducers: {
        getRequesting: (state: JavGameList) => {
            state.readyStatus = "request"
        },
        getSuccess: (state, { payload }: PayloadAction<JavGame[]>) => {
            state.readyStatus = "success"
            state.items = payload
        },
        getFailure: (state, { payload }: PayloadAction<string>) => {
            state.readyStatus = "failure"
            state.error = payload
        },
    },
})

export default javGameList.reducer
export const { getRequesting, getSuccess, getFailure } = javGameList.actions

export const fetchJavGameList = (): AppThunk => async (dispatch) => {
    dispatch(getRequesting())

    const { error, data } = await getJavGameList()

    if (error) {
        dispatch(getFailure(error.message))
    } else {
        dispatch(getSuccess(data as JavGame[]))
    }
}

const shouldFetchJavGameList = (state: AppState) => state.javGameList.readyStatus !== "success"

export const fetchJavGameListIfNeed = (): AppThunk => (dispatch, getState) => {
    if (shouldFetchJavGameList(getState())) return dispatch(fetchJavGameList())

    return null
}
