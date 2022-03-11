import { PayloadAction, createSlice } from "@reduxjs/toolkit"

import { StateRequest, toastError, elementFetch } from "./utils"
import { VolunteerDayWishes } from "../services/volunteers"
import { AppThunk, AppState } from "."
import { volunteerDayWishesSet } from "../services/volunteersAccessors"

type StateVolunteerDayWishesSet = { entity?: VolunteerDayWishes } & StateRequest

export const initialState: StateVolunteerDayWishesSet = {
    readyStatus: "idle",
}

const volunteerDayWishesSetSlice = createSlice({
    name: "volunteerDayWishesSet",
    initialState,
    reducers: {
        getRequesting: (_) => ({
            readyStatus: "request",
        }),
        getSuccess: (_, { payload }: PayloadAction<VolunteerDayWishes>) => ({
            readyStatus: "success",
            entity: payload,
        }),
        getFailure: (_, { payload }: PayloadAction<string>) => ({
            readyStatus: "failure",
            error: payload,
        }),
    },
})

export default volunteerDayWishesSetSlice.reducer
export const { getRequesting, getSuccess, getFailure } = volunteerDayWishesSetSlice.actions

export const fetchVolunteerDayWishesSet = elementFetch(
    volunteerDayWishesSet,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) => toastError(`Erreur lors du chargement des notifications: ${error.message}`)
)

const shouldFetchVolunteerDayWishesSet = (state: AppState, id: number) =>
    state.volunteerDayWishesSet?.readyStatus !== "success" ||
    (state.volunteerDayWishesSet?.entity && state.volunteerDayWishesSet?.entity?.id !== id)

export const fetchVolunteerDayWishesSetIfNeed =
    (id = 0, wishes: Partial<VolunteerDayWishes> = {}): AppThunk =>
    (dispatch, getState) => {
        let jwt = ""

        if (!id) {
            ;({ jwt, id } = getState().auth)
        }
        if (shouldFetchVolunteerDayWishesSet(getState(), id))
            return dispatch(fetchVolunteerDayWishesSet(jwt, id, wishes))

        return null
    }
