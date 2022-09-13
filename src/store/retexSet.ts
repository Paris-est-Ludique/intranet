import { PayloadAction, createSlice, createSelector } from "@reduxjs/toolkit"

import { StateRequest, toastError, elementFetch } from "./utils"
import { Retex } from "../services/retex"
import { retexSet } from "../services/retexAccessors"
import { AppState, AppThunk } from "."

type StateRetex = { entity?: Retex } & StateRequest

export const initialState: StateRetex = {
    readyStatus: "idle",
}

const retexSetSlice = createSlice({
    name: "retexSet",
    initialState,
    reducers: {
        getRequesting: (_) => ({
            readyStatus: "request",
        }),
        getSuccess: (_, { payload }: PayloadAction<Retex>) => ({
            readyStatus: "success",
            entity: payload,
        }),
        getFailure: (_, { payload }: PayloadAction<string>) => ({
            readyStatus: "failure",
            error: payload,
        }),
    },
})

export default retexSetSlice.reducer
export const { getRequesting, getSuccess, getFailure } = retexSetSlice.actions

export const fetchRetexSet = elementFetch(
    retexSet,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) => toastError(`Erreur lors de la modification d'un retex: ${error.message}`)
)

export const fetchRetexSetIfNeed =
    (newPartialRetex?: Partial<Retex>): AppThunk =>
    (dispatch, getState) => {
        const { jwt, id } = getState().auth
        return dispatch(fetchRetexSet(jwt, newPartialRetex || { id }))
    }

export const selectRetexSet = createSelector(
    (state: AppState) => state,
    (state): Retex | undefined => state.retexSet?.entity
)
