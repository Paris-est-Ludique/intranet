import { PayloadAction, createSlice, createEntityAdapter } from "@reduxjs/toolkit"

import { StateRequest, elementAddFetch } from "./utils"
import { PreMember, preMemberAdd } from "../services/preMembers"

const preMemberAdapter = createEntityAdapter<PreMember>()

const preMemberAddSlice = createSlice({
    name: "addPreMember",
    initialState: preMemberAdapter.getInitialState({
        readyStatus: "idle",
    } as StateRequest),
    reducers: {
        getRequesting: (state) => {
            state.readyStatus = "request"
        },
        getSuccess: (state, { payload }: PayloadAction<PreMember>) => {
            state.readyStatus = "success"
            preMemberAdapter.addOne(state, payload)
        },
        getFailure: (state, { payload }: PayloadAction<string>) => {
            state.readyStatus = "failure"
            state.error = payload
        },
    },
})

export default preMemberAddSlice.reducer
export const { getRequesting, getSuccess, getFailure } = preMemberAddSlice.actions

export const fetchPreMemberAdd = elementAddFetch(
    preMemberAdd,
    getRequesting,
    getSuccess,
    getFailure,
    () => null,
    () => null
)
