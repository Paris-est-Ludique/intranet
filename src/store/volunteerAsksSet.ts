import { PayloadAction, createSlice } from "@reduxjs/toolkit"

import { StateRequest, toastError, elementFetch } from "./utils"
import { VolunteerAsks } from "../services/volunteers"
import { AppThunk, AppState } from "."
import { volunteerAsksSet } from "../services/volunteersAccessors"

type StateVolunteerAsksSet = { entity?: VolunteerAsks } & StateRequest

export const initialState: StateVolunteerAsksSet = {
    readyStatus: "idle",
}

const volunteerAsksSetSlice = createSlice({
    name: "volunteerAsksSet",
    initialState,
    reducers: {
        getRequesting: (_) => ({
            readyStatus: "request",
        }),
        getSuccess: (_, { payload }: PayloadAction<VolunteerAsks>) => ({
            readyStatus: "success",
            entity: payload,
        }),
        getFailure: (_, { payload }: PayloadAction<string>) => ({
            readyStatus: "failure",
            error: payload,
        }),
    },
})

export default volunteerAsksSetSlice.reducer
export const { getRequesting, getSuccess, getFailure } = volunteerAsksSetSlice.actions

export const fetchVolunteerAsksSet = elementFetch(
    volunteerAsksSet,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) => toastError(`Erreur lors du chargement des notifications: ${error.message}`)
)

const shouldFetchVolunteerAsksSet = (state: AppState, id: number) =>
    state.volunteerAsksSet?.readyStatus !== "success" ||
    (state.volunteerAsksSet?.entity && state.volunteerAsksSet?.entity?.id !== id)

export const fetchVolunteerAsksSetIfNeed =
    (id = 0, notif: Partial<VolunteerAsks> = {}): AppThunk =>
    (dispatch, getState) => {
        let jwt = ""

        if (!id) {
            ;({ jwt, id } = getState().auth)
        }
        if (shouldFetchVolunteerAsksSet(getState(), id))
            return dispatch(fetchVolunteerAsksSet(jwt, id, notif))

        return null
    }
