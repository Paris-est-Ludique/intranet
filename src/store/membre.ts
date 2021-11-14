import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { toast } from "react-toastify"

import { StateRequest } from "./utils"
import { Membre, getMembre } from "../services/membres"
import { AppThunk, AppState } from "."

type StateMembre = { entity?: Membre } & StateRequest

export const initialState: StateMembre = {
    readyStatus: "idle",
}

const membre = createSlice({
    name: "membre",
    initialState,
    reducers: {
        getRequesting: (_) => ({
            readyStatus: "request",
        }),
        getSuccess: (_, { payload }: PayloadAction<Membre>) => ({
            readyStatus: "success",
            entity: payload,
        }),
        getFailure: (_, { payload }: PayloadAction<string>) => ({
            readyStatus: "failure",
            error: payload,
        }),
    },
})

export default membre.reducer
export const { getRequesting, getSuccess, getFailure } = membre.actions

export const fetchMembreData =
    (id: number): AppThunk =>
    async (dispatch) => {
        dispatch(getRequesting())

        const { error, data } = await getMembre(id)

        if (error) {
            dispatch(getFailure(error.message))
            toast.error(`Erreur lors du chargement du membre ${id}: ${error.message}`, {
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
        }
    }

const shouldFetchMembreData = (state: AppState, id: number) =>
    state.membre.readyStatus !== "success" || (state.membre.entity && state.membre.entity.id !== id)

export const fetchMembreDataIfNeed =
    (id: number): AppThunk =>
    (dispatch, getState) => {
        if (shouldFetchMembreData(getState(), id)) return dispatch(fetchMembreData(id))

        return null
    }
