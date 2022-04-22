import { PayloadAction, createSlice, createSelector } from "@reduxjs/toolkit"

import { StateRequest, toastError, elementFetch } from "./utils"
import { VolunteerDiscordId } from "../services/volunteers"
import { AppThunk, AppState } from "."
import { volunteerDiscordIdGet } from "../services/volunteersAccessors"

type StateVolunteerDiscordId = { entity?: VolunteerDiscordId } & StateRequest

export const initialState: StateVolunteerDiscordId = {
    readyStatus: "idle",
}

const volunteerDiscordId = createSlice({
    name: "volunteerDiscordId",
    initialState,
    reducers: {
        getRequesting: (_) => ({
            readyStatus: "request",
        }),
        getSuccess: (_, { payload }: PayloadAction<VolunteerDiscordId>) => ({
            readyStatus: "success",
            entity: payload,
        }),
        getFailure: (_, { payload }: PayloadAction<string>) => ({
            readyStatus: "failure",
            error: payload,
        }),
    },
})

export default volunteerDiscordId.reducer
export const { getRequesting, getSuccess, getFailure } = volunteerDiscordId.actions

export const fetchVolunteerDiscordId = elementFetch(
    volunteerDiscordIdGet,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) =>
        toastError(`Erreur lors du chargement du discordId d'un bénévole: ${error.message}`)
)

const shouldFetchVolunteerDiscordId = (state: AppState, id: number) =>
    state.volunteerDiscordId.readyStatus !== "success" ||
    (state.volunteerDiscordId.entity && state.volunteerDiscordId.entity.id !== id)

export const fetchVolunteerDiscordIdIfNeed =
    (id = 0): AppThunk =>
    (dispatch, getState) => {
        let jwt = ""

        if (!id) {
            ;({ jwt, id } = getState().auth)
        }
        if (shouldFetchVolunteerDiscordId(getState(), id))
            return dispatch(fetchVolunteerDiscordId(jwt, id))

        return null
    }

export const selectVolunteerDiscordId = createSelector(
    (state: AppState) => state,
    (state): string | undefined => state.volunteerDiscordId?.entity?.discordId
)
