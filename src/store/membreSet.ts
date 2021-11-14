import { PayloadAction, createSlice, createEntityAdapter } from "@reduxjs/toolkit"
import { toast } from "react-toastify"

import { StateRequest } from "./utils"
import { Membre, membreSet } from "../services/membres"
import { AppThunk } from "."

const membreAdapter = createEntityAdapter<Membre>({
    selectId: (membre) => membre.id,
})

const membreSetSlice = createSlice({
    name: "membreSet",
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

export default membreSetSlice.reducer
export const { getRequesting, getSuccess, getFailure } = membreSetSlice.actions

export const sendMembreSet =
    (membre: Membre): AppThunk =>
    async (dispatch) => {
        dispatch(getRequesting())

        const { error, data } = await membreSet(membre)

        if (error) {
            dispatch(getFailure(error.message))
            toast.error(`Erreur lors de la modification d'un membre: ${error.message}`, {
                position: "top-center",
                autoClose: 6000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        } else {
            dispatch(getSuccess(data as Membre))
            toast.success("Membre modifié !", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        }
    }
