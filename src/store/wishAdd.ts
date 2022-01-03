import { PayloadAction, createSlice, createEntityAdapter } from "@reduxjs/toolkit"

import { StateRequest, toastError, toastSuccess, elementAddFetch } from "./utils"
import { Wish, wishAdd } from "../services/wishes"

const wishAdapter = createEntityAdapter<Wish>()

const wishAddSlice = createSlice({
    name: "addWish",
    initialState: wishAdapter.getInitialState({
        readyStatus: "idle",
    } as StateRequest),
    reducers: {
        getRequesting: (state) => {
            state.readyStatus = "request"
        },
        getSuccess: (state, { payload }: PayloadAction<Wish>) => {
            state.readyStatus = "success"
            wishAdapter.addOne(state, payload)
        },
        getFailure: (state, { payload }: PayloadAction<string>) => {
            state.readyStatus = "failure"
            state.error = payload
        },
    },
})

export default wishAddSlice.reducer
export const { getRequesting, getSuccess, getFailure } = wishAddSlice.actions

export const fetchWishAdd = elementAddFetch(
    wishAdd,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) => toastError(`Erreur lors de l'ajout d'une envie: ${error.message}`),
    () => toastSuccess("Envie ajoutée !")
)
