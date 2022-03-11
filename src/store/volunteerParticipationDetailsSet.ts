import { PayloadAction, createSlice } from "@reduxjs/toolkit"

import { StateRequest, toastError, elementFetch } from "./utils"
import { VolunteerParticipationDetails } from "../services/volunteers"
import { AppThunk, AppState } from "."
import { volunteerParticipationDetailsSet } from "../services/volunteersAccessors"

type StateVolunteerParticipationDetailsSet = {
    entity?: VolunteerParticipationDetails
} & StateRequest

export const initialState: StateVolunteerParticipationDetailsSet = {
    readyStatus: "idle",
}

const volunteerParticipationDetailsSetSlice = createSlice({
    name: "volunteerParticipationDetailsSet",
    initialState,
    reducers: {
        getRequesting: (_) => ({
            readyStatus: "request",
        }),
        getSuccess: (_, { payload }: PayloadAction<VolunteerParticipationDetails>) => ({
            readyStatus: "success",
            entity: payload,
        }),
        getFailure: (_, { payload }: PayloadAction<string>) => ({
            readyStatus: "failure",
            error: payload,
        }),
    },
})

export default volunteerParticipationDetailsSetSlice.reducer
export const { getRequesting, getSuccess, getFailure } =
    volunteerParticipationDetailsSetSlice.actions

export const fetchVolunteerParticipationDetailsSet = elementFetch(
    volunteerParticipationDetailsSet,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) => toastError(`Erreur lors du chargement des notifications: ${error.message}`)
)

const shouldFetchVolunteerParticipationDetailsSet = (state: AppState, id: number) =>
    state.volunteerParticipationDetailsSet?.readyStatus !== "success" ||
    (state.volunteerParticipationDetailsSet?.entity &&
        state.volunteerParticipationDetailsSet?.entity?.id !== id)

export const fetchVolunteerParticipationDetailsSetIfNeed =
    (id = 0, wishes: Partial<VolunteerParticipationDetails> = {}): AppThunk =>
    (dispatch, getState) => {
        let jwt = ""

        if (!id) {
            ;({ jwt, id } = getState().auth)
        }
        if (shouldFetchVolunteerParticipationDetailsSet(getState(), id))
            return dispatch(fetchVolunteerParticipationDetailsSet(jwt, id, wishes))

        return null
    }
