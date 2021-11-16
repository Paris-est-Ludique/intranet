import { PayloadAction, createSlice, createEntityAdapter } from "@reduxjs/toolkit"

import { StateRequest, toastError, toastSuccess, elementAddFetch } from "./utils"
import { Envie, envieAdd } from "../services/envies"

const envieAdapter = createEntityAdapter<Envie>()

const envieAddSlice = createSlice({
    name: "addEnvie",
    initialState: envieAdapter.getInitialState({
        readyStatus: "idle",
    } as StateRequest),
    reducers: {
        getRequesting: (state) => {
            state.readyStatus = "request"
        },
        getSuccess: (state, { payload }: PayloadAction<Envie>) => {
            state.readyStatus = "success"
            envieAdapter.addOne(state, payload)
        },
        getFailure: (state, { payload }: PayloadAction<string>) => {
            state.readyStatus = "failure"
            state.error = payload
        },
    },
})

export default envieAddSlice.reducer
export const { getRequesting, getSuccess, getFailure } = envieAddSlice.actions

export const fetchEnvieAdd = elementAddFetch(
    envieAdd,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) => toastError(`Erreur lors de l'ajout d'une envie: ${error.message}`),
    () => toastSuccess("Envie ajoutée !")
)
