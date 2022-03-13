import { PayloadAction, createSlice, createSelector } from "@reduxjs/toolkit"
import get from "lodash/get"

import { StateRequest, toastError, elementFetch } from "./utils"
import { VolunteerNotifs } from "../services/volunteers"
import { AppThunk, AppState } from "."
import { volunteerNotifsSet } from "../services/volunteersAccessors"

type StateVolunteerNotifsSet = { entity?: VolunteerNotifs } & StateRequest

export const initialState: StateVolunteerNotifsSet = {
    readyStatus: "idle",
}

const volunteerNotifsSetSlice = createSlice({
    name: "volunteerNotifsSet",
    initialState,
    reducers: {
        getRequesting: (_) => ({
            readyStatus: "request",
        }),
        getSuccess: (_, { payload }: PayloadAction<VolunteerNotifs>) => ({
            readyStatus: "success",
            entity: payload,
        }),
        getFailure: (_, { payload }: PayloadAction<string>) => ({
            readyStatus: "failure",
            error: payload,
        }),
    },
})

export default volunteerNotifsSetSlice.reducer
export const { getRequesting, getSuccess, getFailure } = volunteerNotifsSetSlice.actions

export const fetchVolunteerNotifsSet = elementFetch(
    volunteerNotifsSet,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) => toastError(`Erreur lors du chargement des notifications: ${error.message}`)
)

const shouldFetchVolunteerNotifsSet = (state: AppState, id: number) =>
    state.volunteerNotifsSet?.readyStatus !== "success" ||
    (state.volunteerNotifsSet?.entity && state.volunteerNotifsSet?.entity?.id !== id)

export const fetchVolunteerNotifsSetIfNeed =
    (id = 0, notif: Partial<VolunteerNotifs> = {}): AppThunk =>
    (dispatch, getState) => {
        let jwt = ""

        if (!id) {
            ;({ jwt, id } = getState().auth)
        }
        if (shouldFetchVolunteerNotifsSet(getState(), id))
            return dispatch(fetchVolunteerNotifsSet(jwt, id, notif))

        return null
    }

export const openedNotifsIds = [1, 2, 3]

export const selectVolunteerNotifsSetState = (state: AppState): StateVolunteerNotifsSet =>
    state.volunteerNotifsSet

export const selectHiddenNotifs = createSelector(selectVolunteerNotifsSetState, (notifState) =>
    get(notifState, "entity.hiddenNotifs", [])
)

export const selectWaitingsNotifs = createSelector(selectHiddenNotifs, (hidden) =>
    openedNotifsIds.filter((id) => !hidden.find((hiddenId: number) => hiddenId === id))
)

export const hasWaitingNotifs = createSelector(
    selectWaitingsNotifs,
    (waiting) => waiting.length > 0
)
