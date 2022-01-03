import { PayloadAction, createSlice, createEntityAdapter } from "@reduxjs/toolkit"

import { StateRequest, toastError, toastSuccess, elementSet } from "./utils"
import { Volunteer, volunteerSet } from "../services/volunteers"

const volunteerAdapter = createEntityAdapter<Volunteer>()

const volunteerSetSlice = createSlice({
    name: "volunteerSet",
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

export default volunteerSetSlice.reducer
export const { getRequesting, getSuccess, getFailure } = volunteerSetSlice.actions

export const fetchVolunteerSet = elementSet(
    volunteerSet,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) => toastError(`Erreur lors de la modification d'un bénévole: ${error.message}`),
    () => toastSuccess("Bénévole modifié !")
)
