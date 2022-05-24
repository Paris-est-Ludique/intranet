import { PayloadAction, createSlice, createSelector } from "@reduxjs/toolkit"

import { StateRequest, toastError, toastSuccess, elementFetch } from "./utils"
import { Volunteer } from "../services/volunteers"
import { volunteerSet } from "../services/volunteersAccessors"
import { AppState, AppThunk } from "."

type StateVolunteer = { entity?: Volunteer } & StateRequest

export const initialState: StateVolunteer = {
    readyStatus: "idle",
}

const volunteerSetSlice = createSlice({
    name: "volunteerSet",
    initialState,
    reducers: {
        getRequesting: (_) => ({
            readyStatus: "request",
        }),
        getSuccess: (_, { payload }: PayloadAction<Volunteer>) => ({
            readyStatus: "success",
            entity: payload,
        }),
        getFailure: (_, { payload }: PayloadAction<string>) => ({
            readyStatus: "failure",
            error: payload,
        }),
    },
})

export default volunteerSetSlice.reducer
export const { getRequesting, getSuccess, getFailure } = volunteerSetSlice.actions

export const fetchVolunteerSet = elementFetch(
    volunteerSet,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) => toastError(`Erreur lors de la modification d'un bénévole: ${error.message}`),
    () => toastSuccess("Bénévole modifié !")
)

const shouldFetchVolunteerSet = (_state: AppState) => true

export const fetchVolunteerSetIfNeed =
    (newPartialVolunteer: Partial<Volunteer>): AppThunk =>
    (dispatch, getState) => {
        const { jwt } = getState().auth
        if (shouldFetchVolunteerSet(getState()))
            return dispatch(fetchVolunteerSet(jwt, newPartialVolunteer))

        return null
    }

export const selectVolunteerSet = createSelector(
    (state: AppState) => state,
    (state): string | undefined => state.volunteerSet?.entity?.discordId
)
