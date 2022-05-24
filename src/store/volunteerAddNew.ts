import { PayloadAction, createSlice, createEntityAdapter } from "@reduxjs/toolkit"

import { StateRequest, elementAddFetch, toastError } from "./utils"
import { Volunteer } from "../services/volunteers"
import { volunteerAddNew } from "../services/volunteersAccessors"
import { AppThunk } from "."

const volunteerAdapter = createEntityAdapter<Volunteer>()

const volunteerAddNewSlice = createSlice({
    name: "volunteerAddNew",
    initialState: volunteerAdapter.getInitialState({
        readyStatus: "idle",
    } as StateRequest),
    reducers: {
        getRequesting: (state) => {
            state.readyStatus = "request"
        },
        getSuccess: (state, { payload }: PayloadAction<Volunteer>) => {
            state.readyStatus = "success"
            volunteerAdapter.setOne(state, payload)
        },
        getFailure: (state, { payload }: PayloadAction<string>) => {
            state.readyStatus = "failure"
            state.error = payload
        },
    },
})

export default volunteerAddNewSlice.reducer
export const { getRequesting, getSuccess, getFailure } = volunteerAddNewSlice.actions

export const fetchVolunteerAddNew = elementAddFetch(
    volunteerAddNew,
    getRequesting,
    getSuccess,
    getFailure,
    () => toastError("Erreur d'ajout !"),
    () => null
)

export const fetchVolunteerAddNewIfNeed = (): AppThunk => (dispatch, getState) => {
    const { jwt } = getState().auth
    return dispatch(fetchVolunteerAddNew(jwt))
}
