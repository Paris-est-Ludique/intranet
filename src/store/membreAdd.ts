import { PayloadAction, createSlice, createEntityAdapter } from "@reduxjs/toolkit"

import { StateRequest, toastError, toastSuccess, elementAddFetch } from "./utils"
import { Membre, membreAdd } from "../services/membres"

const membreAdapter = createEntityAdapter<Membre>()

const membreAddSlice = createSlice({
    name: "addMembre",
    initialState: membreAdapter.getInitialState({
        readyStatus: "idle",
    } as StateRequest),
    reducers: {
        getRequesting: (state) => {
            state.readyStatus = "request"
        },
        getSuccess: (state, { payload }: PayloadAction<Membre>) => {
            state.readyStatus = "success"
            membreAdapter.addOne(state, payload)
        },
        getFailure: (state, { payload }: PayloadAction<string>) => {
            state.readyStatus = "failure"
            state.error = payload
        },
    },
})

export default membreAddSlice.reducer
export const { getRequesting, getSuccess, getFailure } = membreAddSlice.actions

export const fetchMembreAdd = elementAddFetch(
    membreAdd,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) => toastError(`Erreur lors de l'ajout d'une membre: ${error.message}`),
    () => toastSuccess("Membre ajoutée !")
)
