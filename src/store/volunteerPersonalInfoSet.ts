import { PayloadAction, createSlice } from "@reduxjs/toolkit"

import { StateRequest, toastError, elementFetch } from "./utils"
import { VolunteerPersonalInfo } from "../services/volunteers"
import { AppThunk, AppState } from "."
import { volunteerPersonalInfoSet } from "../services/volunteersAccessors"

type StateVolunteerPersonalInfoSet = { entity?: VolunteerPersonalInfo } & StateRequest

export const initialState: StateVolunteerPersonalInfoSet = {
    readyStatus: "idle",
}

const volunteerPersonalInfoSetSlice = createSlice({
    name: "volunteerPersonalInfoSet",
    initialState,
    reducers: {
        getRequesting: (_) => ({
            readyStatus: "request",
        }),
        getSuccess: (_, { payload }: PayloadAction<VolunteerPersonalInfo>) => ({
            readyStatus: "success",
            entity: payload,
        }),
        getFailure: (_, { payload }: PayloadAction<string>) => ({
            readyStatus: "failure",
            error: payload,
        }),
    },
})

export default volunteerPersonalInfoSetSlice.reducer
export const { getRequesting, getSuccess, getFailure } = volunteerPersonalInfoSetSlice.actions

export const fetchVolunteerPersonalInfoSet = elementFetch(
    volunteerPersonalInfoSet,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) =>
        toastError(`Erreur lors du chargement des choix de jours de présence: ${error.message}`)
)

const shouldFetchVolunteerPersonalInfoSet = (state: AppState, id: number) =>
    state.volunteerPersonalInfoSet?.readyStatus !== "success" ||
    (state.volunteerPersonalInfoSet?.entity && state.volunteerPersonalInfoSet?.entity?.id !== id)

export const fetchVolunteerPersonalInfoSetIfNeed =
    (id = 0, wishes: Partial<VolunteerPersonalInfo> = {}): AppThunk =>
    (dispatch, getState) => {
        let jwt = ""

        if (!id) {
            ;({ jwt, id } = getState().auth)
        }
        if (shouldFetchVolunteerPersonalInfoSet(getState(), id))
            return dispatch(fetchVolunteerPersonalInfoSet(jwt, id, wishes))

        return null
    }
