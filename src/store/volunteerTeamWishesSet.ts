import { PayloadAction, createSlice } from "@reduxjs/toolkit"

import { StateRequest, toastError, elementFetch } from "./utils"
import { VolunteerTeamWishes } from "../services/volunteers"
import { AppThunk, AppState } from "."
import { volunteerTeamWishesSet } from "../services/volunteersAccessors"

type StateVolunteerTeamWishesSet = { entity?: VolunteerTeamWishes } & StateRequest

export const initialState: StateVolunteerTeamWishesSet = {
    readyStatus: "idle",
}

const volunteerTeamWishesSetSlice = createSlice({
    name: "volunteerTeamWishesSet",
    initialState,
    reducers: {
        getRequesting: (_) => ({
            readyStatus: "request",
        }),
        getSuccess: (_, { payload }: PayloadAction<VolunteerTeamWishes>) => ({
            readyStatus: "success",
            entity: payload,
        }),
        getFailure: (_, { payload }: PayloadAction<string>) => ({
            readyStatus: "failure",
            error: payload,
        }),
    },
})

export default volunteerTeamWishesSetSlice.reducer
export const { getRequesting, getSuccess, getFailure } = volunteerTeamWishesSetSlice.actions

export const fetchVolunteerTeamWishesSet = elementFetch(
    volunteerTeamWishesSet,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) => toastError(`Erreur lors du chargement des notifications: ${error.message}`)
)

const shouldFetchVolunteerTeamWishesSet = (state: AppState, id: number) =>
    state.volunteerTeamWishesSet?.readyStatus !== "success" ||
    (state.volunteerTeamWishesSet?.entity && state.volunteerTeamWishesSet?.entity?.id !== id)

export const fetchVolunteerTeamWishesSetIfNeed =
    (id = 0, wishes: Partial<VolunteerTeamWishes> = {}): AppThunk =>
    (dispatch, getState) => {
        let jwt = ""

        if (!id) {
            ;({ id, jwt } = getState().auth)
        }
        if (shouldFetchVolunteerTeamWishesSet(getState(), id))
            return dispatch(fetchVolunteerTeamWishesSet(jwt, id, wishes))

        return null
    }
