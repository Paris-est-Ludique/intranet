import { PayloadAction, createSlice } from "@reduxjs/toolkit"

import { StateRequest, toastError, elementFetch } from "./utils"
import { Volunteer } from "../services/volunteers"
import { AppThunk, AppState } from "."
import { volunteerGet } from "../services/volunteersAccessors"

type StateVolunteer = { entity?: Volunteer } & StateRequest

export const initialState: StateVolunteer = {
    readyStatus: "idle",
}

const volunteer = createSlice({
    name: "volunteer",
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

export default volunteer.reducer
export const { getRequesting, getSuccess, getFailure } = volunteer.actions

export const fetchVolunteer = elementFetch(
    volunteerGet,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) => toastError(`Erreur lors du chargement d'un bénévole: ${error.message}`)
)

const shouldFetchVolunteer = (state: AppState, id: number) =>
    state.volunteer.readyStatus !== "success" ||
    (state.volunteer.entity && state.volunteer.entity.id !== id)

export const fetchVolunteerIfNeed =
    (id: number): AppThunk =>
    (dispatch, getState) => {
        if (shouldFetchVolunteer(getState(), id)) return dispatch(fetchVolunteer(id))

        return null
    }
