import _ from "lodash"
import { PayloadAction, createSlice, createEntityAdapter, createSelector } from "@reduxjs/toolkit"

import { StateRequest, toastError, elementListFetch } from "./utils"
import { MiscDiscordInvitation } from "../services/miscs"
import { AppThunk, AppState, EntitiesRequest } from "."
import { miscDiscordInvitation } from "../services/miscsAccessors"

const miscAdapter = createEntityAdapter<MiscDiscordInvitation>()

export const initialState = miscAdapter.getInitialState({
    readyStatus: "idle",
} as StateRequest)

const miscDiscordInvitationSlice = createSlice({
    name: "miscDiscordInvitation",
    initialState,
    reducers: {
        getRequesting: (state) => {
            state.readyStatus = "request"
        },
        getSuccess: (state, { payload }: PayloadAction<MiscDiscordInvitation[]>) => {
            state.readyStatus = "success"
            miscAdapter.setAll(state, payload)
        },
        getFailure: (state, { payload }: PayloadAction<string>) => {
            state.readyStatus = "failure"
            state.error = payload
        },
    },
})

export default miscDiscordInvitationSlice.reducer
export const { getRequesting, getSuccess, getFailure } = miscDiscordInvitationSlice.actions

export const fetchMiscDiscordInvitation = elementListFetch(
    miscDiscordInvitation,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) => toastError(`Erreur lors du chargement des données diverses: ${error.message}`)
)

const shouldFetchMiscDiscordInvitation = (state: AppState) =>
    state.miscDiscordInvitation.readyStatus !== "success"

export const fetchMiscDiscordInvitationIfNeed = (): AppThunk => (dispatch, getState) => {
    const { jwt } = getState().auth
    if (shouldFetchMiscDiscordInvitation(getState()))
        return dispatch(fetchMiscDiscordInvitation(jwt))

    return null
}

export const refreshMiscDiscordInvitation =
    (jwt: string): AppThunk =>
    (dispatch) =>
        dispatch(fetchMiscDiscordInvitation(jwt))

export const selectMiscDiscordInvitationState = (
    state: AppState
): EntitiesRequest<MiscDiscordInvitation> => state.miscDiscordInvitation

export const selectMiscDiscordInvitation = createSelector(
    selectMiscDiscordInvitationState,
    ({ ids, entities, readyStatus }) => {
        if (readyStatus !== "success") return ""
        const id = _.first(ids)
        if (id === undefined) return ""
        return entities[id]?.discordInvitation || ""
    }
)
