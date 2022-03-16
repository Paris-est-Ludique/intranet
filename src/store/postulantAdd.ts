import { PayloadAction, createSlice, createEntityAdapter } from "@reduxjs/toolkit"

import { StateRequest, elementAddFetch } from "./utils"
import { Postulant } from "../services/postulants"
import { postulantAdd } from "../services/postulantsAccessors"

const postulantAdapter = createEntityAdapter<Postulant>()

const postulantAddSlice = createSlice({
    name: "addPostulant",
    initialState: postulantAdapter.getInitialState({
        readyStatus: "idle",
    } as StateRequest),
    reducers: {
        getRequesting: (state) => {
            state.readyStatus = "request"
        },
        getSuccess: (state, { payload }: PayloadAction<Postulant>) => {
            state.readyStatus = "success"
            postulantAdapter.addOne(state, payload)
        },
        getFailure: (state, { payload }: PayloadAction<string>) => {
            state.readyStatus = "failure"
            state.error = payload
        },
    },
})

export default postulantAddSlice.reducer
export const { getRequesting, getSuccess, getFailure } = postulantAddSlice.actions

export const fetchPostulantAdd = elementAddFetch(
    postulantAdd,
    getRequesting,
    getSuccess,
    getFailure,
    () => null,
    () => null
)
