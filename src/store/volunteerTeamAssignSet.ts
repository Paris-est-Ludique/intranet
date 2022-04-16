import { PayloadAction, createSlice } from "@reduxjs/toolkit"

import { StateRequest, toastError, elementFetch } from "./utils"
import { VolunteerTeamAssign } from "../services/volunteers"
import { AppThunk, AppState } from "."
import { volunteerTeamAssignSet } from "../services/volunteersAccessors"

type StateVolunteerTeamAssignSet = { entity?: VolunteerTeamAssign } & StateRequest

export const initialState: StateVolunteerTeamAssignSet = {
    readyStatus: "idle",
}

const volunteerTeamAssignSetSlice = createSlice({
    name: "volunteerTeamAssignSet",
    initialState,
    reducers: {
        getRequesting: (_) => ({
            readyStatus: "request",
        }),
        getSuccess: (_, { payload }: PayloadAction<VolunteerTeamAssign>) => ({
            readyStatus: "success",
            entity: payload,
        }),
        getFailure: (_, { payload }: PayloadAction<string>) => ({
            readyStatus: "failure",
            error: payload,
        }),
    },
})

export default volunteerTeamAssignSetSlice.reducer
export const { getRequesting, getSuccess, getFailure } = volunteerTeamAssignSetSlice.actions

export const fetchVolunteerTeamAssignSet = elementFetch(
    volunteerTeamAssignSet,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) => toastError(`Erreur lors du chargement des notifications: ${error.message}`)
)

const shouldFetchVolunteerTeamAssignSet = (state: AppState, id: number) =>
    state.volunteerTeamAssignSet?.readyStatus !== "success" ||
    (state.volunteerTeamAssignSet?.entity && state.volunteerTeamAssignSet?.entity?.id !== id)

export const fetchVolunteerTeamAssignSetIfNeed =
    (id = 0, wishes: Partial<VolunteerTeamAssign> = {}): AppThunk =>
    (dispatch, getState) => {
        let jwt = ""

        if (!id) {
            ;({ jwt, id } = getState().auth)
        }
        if (shouldFetchVolunteerTeamAssignSet(getState(), id))
            return dispatch(fetchVolunteerTeamAssignSet(jwt, id, wishes))

        return null
    }
