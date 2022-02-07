import { PayloadAction, createSlice, createEntityAdapter } from "@reduxjs/toolkit"

import { StateRequest, toastError, elementListFetch } from "./utils"
import { Announcement } from "../services/announcement"
import { AppThunk, AppState } from "."
import { announcementListGet } from "../services/announcementAccessors"

const announcementAdapter = createEntityAdapter<Announcement>()

export const initialState = announcementAdapter.getInitialState({
    readyStatus: "idle",
} as StateRequest)

const announcementList = createSlice({
    name: "announcementList",
    initialState,
    reducers: {
        getRequesting: (state) => {
            state.readyStatus = "request"
        },
        getSuccess: (state, { payload }: PayloadAction<Announcement[]>) => {
            state.readyStatus = "success"
            announcementAdapter.setAll(state, payload)
        },
        getFailure: (state, { payload }: PayloadAction<string>) => {
            state.readyStatus = "failure"
            state.error = payload
        },
    },
})

export default announcementList.reducer
export const { getRequesting, getSuccess, getFailure } = announcementList.actions

export const fetchAnnouncementList = elementListFetch(
    announcementListGet,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) => toastError(`Erreur lors du chargement des announcements: ${error.message}`)
)

const shouldFetchAnnouncementList = (state: AppState) =>
    state.announcementList.readyStatus !== "success"

export const fetchAnnouncementListIfNeed = (): AppThunk => (dispatch, getState) => {
    const { jwt } = getState().auth
    if (shouldFetchAnnouncementList(getState())) return dispatch(fetchAnnouncementList(jwt))

    return null
}
