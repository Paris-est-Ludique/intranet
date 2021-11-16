import { PayloadAction, createSlice } from "@reduxjs/toolkit"

import { StateRequest, toastError, elementFetch } from "./utils"
import { Membre, membreGet } from "../services/membres"
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

export const fetchMembre = elementFetch(
    membreGet,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) => toastError(`Erreur lors du chargement d'un membre: ${error.message}`)
)

const shouldFetchMembre = (state: AppState, id: number) =>
    state.membre.readyStatus !== "success" || (state.membre.entity && state.membre.entity.id !== id)

export const fetchMembreIfNeed =
    (id: number): AppThunk =>
    (dispatch, getState) => {
        if (shouldFetchMembre(getState(), id)) return dispatch(fetchMembre(id))

        return null
    }
