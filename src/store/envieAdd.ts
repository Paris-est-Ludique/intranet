import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { toast } from "react-toastify"

import { Envie, EnvieWithoutId, addEnvie } from "../services/envies"
import { AppThunk } from "."

interface EnvieRequest {
    readyStatus: string
    items: Envie | null
    error: string | null
}

export const initialState: EnvieRequest = {
    readyStatus: "invalid",
    items: null,
    error: null,
}

const envieList = createSlice({
    name: "addEnvie",
    initialState,
    reducers: {
        getRequesting: (state: EnvieRequest) => {
            state.readyStatus = "request"
        },
        getSuccess: (state, { payload }: PayloadAction<Envie>) => {
            state.readyStatus = "success"
            state.items = payload
        },
        getFailure: (state, { payload }: PayloadAction<string>) => {
            state.readyStatus = "failure"
            state.error = payload
        },
    },
})

export default envieList.reducer
export const { getRequesting, getSuccess, getFailure } = envieList.actions

export const postEnvie =
    (envieWithoutId: EnvieWithoutId): AppThunk =>
    async (dispatch) => {
        dispatch(getRequesting())

        const { error, data } = await addEnvie(envieWithoutId)

        if (error) {
            dispatch(getFailure(error.message))
            toast.error(`Erreur lors de l'ajout: ${error.message}`, {
                position: "top-center",
                autoClose: 6000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        } else {
            dispatch(getSuccess(data as Envie))
            toast.success("Envie ajoutée !", {
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
