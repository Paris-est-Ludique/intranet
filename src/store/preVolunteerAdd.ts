import { PayloadAction, createSlice, createEntityAdapter } from "@reduxjs/toolkit"

import { StateRequest, elementAddFetch } from "./utils"
import { PreVolunteer } from "../services/preVolunteers"
import { preVolunteerAdd } from "../services/preVolunteersAccessors"

const preVolunteerAdapter = createEntityAdapter<PreVolunteer>()

const preVolunteerAddSlice = createSlice({
    name: "addPreVolunteer",
    initialState: preVolunteerAdapter.getInitialState({
        readyStatus: "idle",
    } as StateRequest),
    reducers: {
        getRequesting: (state) => {
            state.readyStatus = "request"
        },
        getSuccess: (state, { payload }: PayloadAction<PreVolunteer>) => {
            state.readyStatus = "success"
            preVolunteerAdapter.addOne(state, payload)
        },
        getFailure: (state, { payload }: PayloadAction<string>) => {
            state.readyStatus = "failure"
            state.error = payload
        },
    },
})

export default preVolunteerAddSlice.reducer
export const { getRequesting, getSuccess, getFailure } = preVolunteerAddSlice.actions

export const fetchPreVolunteerAdd = elementAddFetch(
    preVolunteerAdd,
    getRequesting,
    getSuccess,
    getFailure,
    () => null,
    () => null
)
