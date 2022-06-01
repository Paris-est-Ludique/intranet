import { PayloadAction, createSlice } from "@reduxjs/toolkit"

import { StateRequest, toastError, elementFetch } from "./utils"
import { VolunteerHosting } from "../services/volunteers"
import { AppThunk, AppState } from "."
import { volunteerHostingSet } from "../services/volunteersAccessors"

type StateVolunteerHostingSet = { entity?: VolunteerHosting } & StateRequest

export const initialState: StateVolunteerHostingSet = {
    readyStatus: "idle",
}

const volunteerHostingSetSlice = createSlice({
    name: "volunteerHostingSet",
    initialState,
    reducers: {
        getRequesting: (_) => ({
            readyStatus: "request",
        }),
        getSuccess: (_, { payload }: PayloadAction<VolunteerHosting>) => ({
            readyStatus: "success",
            entity: payload,
        }),
        getFailure: (_, { payload }: PayloadAction<string>) => ({
            readyStatus: "failure",
            error: payload,
        }),
    },
})

export default volunteerHostingSetSlice.reducer
export const { getRequesting, getSuccess, getFailure } = volunteerHostingSetSlice.actions

export const fetchVolunteerHostingSet = elementFetch(
    volunteerHostingSet,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) =>
        toastError(`Erreur lors du chargement des choix de jours de présence: ${error.message}`)
)

const shouldFetchVolunteerHostingSet = (state: AppState, id: number) =>
    state.volunteerHostingSet?.readyStatus !== "success" ||
    (state.volunteerHostingSet?.entity && state.volunteerHostingSet?.entity?.id !== id)

export const fetchVolunteerHostingSetIfNeed =
    (id = 0, wishes: Partial<VolunteerHosting> = {}): AppThunk =>
    (dispatch, getState) => {
        let jwt = ""

        if (!id) {
            ;({ jwt, id } = getState().auth)
        }
        if (shouldFetchVolunteerHostingSet(getState(), id))
            return dispatch(fetchVolunteerHostingSet(jwt, id, wishes))

        return null
    }
