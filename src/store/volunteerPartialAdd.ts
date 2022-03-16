import { PayloadAction, createSlice, createEntityAdapter } from "@reduxjs/toolkit"

import { StateRequest, elementAddFetch } from "./utils"
import { Volunteer } from "../services/volunteers"
import { volunteerPartialAdd } from "../services/volunteersAccessors"

const volunteerAdapter = createEntityAdapter<Volunteer>()

const volunteerPartialAddSlice = createSlice({
    name: "addVolunteer",
    initialState: volunteerAdapter.getInitialState({
        readyStatus: "idle",
    } as StateRequest),
    reducers: {
        getRequesting: (state) => {
            state.readyStatus = "request"
        },
        getSuccess: (state, { payload }: PayloadAction<Volunteer>) => {
            state.readyStatus = "success"
            volunteerAdapter.addOne(state, payload)
        },
        getFailure: (state, { payload }: PayloadAction<string>) => {
            state.readyStatus = "failure"
            state.error = payload
        },
    },
})

export default volunteerPartialAddSlice.reducer
export const { getRequesting, getSuccess, getFailure } = volunteerPartialAddSlice.actions

export const fetchVolunteerPartialAdd = elementAddFetch(
    volunteerPartialAdd,
    getRequesting,
    getSuccess,
    getFailure,
    () => null,
    () => null
)
