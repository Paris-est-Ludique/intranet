import { PayloadAction, createSlice } from "@reduxjs/toolkit"

import { StateRequest, toastError, elementFetch } from "./utils"
import { VolunteerMeals } from "../services/volunteers"
import { AppThunk, AppState } from "."
import { volunteerMealsSet } from "../services/volunteersAccessors"

type StateVolunteerMealsSet = { entity?: VolunteerMeals } & StateRequest

export const initialState: StateVolunteerMealsSet = {
    readyStatus: "idle",
}

const volunteerMealsSetSlice = createSlice({
    name: "volunteerMealsSet",
    initialState,
    reducers: {
        getRequesting: (_) => ({
            readyStatus: "request",
        }),
        getSuccess: (_, { payload }: PayloadAction<VolunteerMeals>) => ({
            readyStatus: "success",
            entity: payload,
        }),
        getFailure: (_, { payload }: PayloadAction<string>) => ({
            readyStatus: "failure",
            error: payload,
        }),
    },
})

export default volunteerMealsSetSlice.reducer
export const { getRequesting, getSuccess, getFailure } = volunteerMealsSetSlice.actions

export const fetchVolunteerMealsSet = elementFetch(
    volunteerMealsSet,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) =>
        toastError(`Erreur lors du chargement des choix de jours de présence: ${error.message}`)
)

const shouldFetchVolunteerMealsSet = (state: AppState, id: number) =>
    state.volunteerMealsSet?.readyStatus !== "success" ||
    (state.volunteerMealsSet?.entity && state.volunteerMealsSet?.entity?.id !== id)

export const fetchVolunteerMealsSetIfNeed =
    (id = 0, wishes: Partial<VolunteerMeals> = {}): AppThunk =>
    (dispatch, getState) => {
        let jwt = ""

        if (!id) {
            ;({ jwt, id } = getState().auth)
        }
        if (shouldFetchVolunteerMealsSet(getState(), id))
            return dispatch(fetchVolunteerMealsSet(jwt, id, wishes))

        return null
    }
