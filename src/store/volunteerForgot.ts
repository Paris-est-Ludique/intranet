import { PayloadAction, createSlice } from "@reduxjs/toolkit"

import { StateRequest, elementFetch } from "./utils"
import { VolunteerForgot, volunteerForgot } from "../services/volunteers"

type StateVolunteer = { entity?: VolunteerForgot } & StateRequest

export const initialState: StateVolunteer = {
    readyStatus: "idle",
}

const volunteerForgotSlice = createSlice({
    name: "volunteerForgot",
    initialState,
    reducers: {
        getRequesting: (_) => ({
            readyStatus: "request",
        }),
        getSuccess: (_, { payload }: PayloadAction<VolunteerForgot>) => ({
            readyStatus: "success",
            entity: payload,
        }),
        getFailure: (_, { payload }: PayloadAction<string>) => ({
            readyStatus: "failure",
            error: payload,
        }),
    },
})

export default volunteerForgotSlice.reducer
export const { getRequesting, getSuccess, getFailure } = volunteerForgotSlice.actions

export const fetchVolunteerForgot = elementFetch(
    volunteerForgot,
    getRequesting,
    getSuccess,
    getFailure
)
