import { PayloadAction, createSlice } from "@reduxjs/toolkit"

import { StateRequest, elementFetch } from "./utils"
import { VolunteerLogin } from "../services/volunteers"
import { setJWT } from "../services/auth"
import { volunteerLogin } from "../services/volunteersAccessors"

type StateVolunteer = { entity?: VolunteerLogin } & StateRequest

export const initialState: StateVolunteer = {
    readyStatus: "idle",
}

const volunteerLoginSlice = createSlice({
    name: "volunteerLogin",
    initialState,
    reducers: {
        getRequesting: (_) => ({
            readyStatus: "request",
        }),
        getSuccess: (_, { payload }: PayloadAction<VolunteerLogin>) => ({
            readyStatus: "success",
            entity: payload,
        }),
        getFailure: (_, { payload }: PayloadAction<string>) => ({
            readyStatus: "failure",
            error: payload,
        }),
    },
})

export default volunteerLoginSlice.reducer
export const { getRequesting, getSuccess, getFailure } = volunteerLoginSlice.actions

export const fetchVolunteerLogin = elementFetch<VolunteerLogin, Parameters<typeof volunteerLogin>>(
    volunteerLogin,
    getRequesting,
    getSuccess,
    getFailure,
    undefined,
    (login: VolunteerLogin) => {
        setJWT(login.jwt, login.id)
        // eslint-disable-next-line no-restricted-globals
        location?.reload()
    }
)
