import { PayloadAction, createSlice, createEntityAdapter } from "@reduxjs/toolkit"

import { StateRequest, toastError, toastSuccess, elementAddFetch } from "./utils"
import { Volunteer, volunteerAdd } from "../services/volunteers"

const volunteerAdapter = createEntityAdapter<Volunteer>()

const volunteerAddSlice = createSlice({
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

export default volunteerAddSlice.reducer
export const { getRequesting, getSuccess, getFailure } = volunteerAddSlice.actions

export const fetchVolunteerAdd = elementAddFetch(
    volunteerAdd,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) => toastError(`Erreur lors de l'ajout d'une volunteer: ${error.message}`),
    () => toastSuccess("Volunteer ajoutée !")
)
