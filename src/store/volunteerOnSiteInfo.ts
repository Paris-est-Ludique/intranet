import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit"

import { StateRequest, toastError, elementFetch } from "./utils"
import { VolunteerOnSiteInfo } from "../services/volunteers"
import { AppThunk, AppState } from "."
import { volunteerOnSiteInfoGet } from "../services/volunteersAccessors"

type StateVolunteerOnSiteInfo = { entity?: VolunteerOnSiteInfo } & StateRequest

export const initialState: StateVolunteerOnSiteInfo = {
    readyStatus: "idle",
}

const volunteerOnSiteInfo = createSlice({
    name: "volunteerOnSiteInfo",
    initialState,
    reducers: {
        getRequesting: (_) => ({
            readyStatus: "request",
        }),
        getSuccess: (_, { payload }: PayloadAction<VolunteerOnSiteInfo>) => ({
            readyStatus: "success",
            entity: payload,
        }),
        getFailure: (_, { payload }: PayloadAction<string>) => ({
            readyStatus: "failure",
            error: payload,
        }),
    },
})

export default volunteerOnSiteInfo.reducer
export const { getRequesting, getSuccess, getFailure } = volunteerOnSiteInfo.actions

export const fetchVolunteerOnSiteInfo = elementFetch(
    volunteerOnSiteInfoGet,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) =>
        toastError(`Erreur lors du chargement des infos sur site d'un bénévole: ${error.message}`)
)

const shouldFetchVolunteerOnSiteInfo = (state: AppState, id: number) =>
    state.volunteerOnSiteInfo.readyStatus !== "success" ||
    (state.volunteerOnSiteInfo.entity && state.volunteerOnSiteInfo.entity.id !== id)

export const fetchVolunteerOnSiteInfoIfNeed =
    (id = 0): AppThunk =>
    (dispatch, getState) => {
        let jwt = ""

        if (!id) {
            ;({ jwt, id } = getState().auth)
        }
        if (shouldFetchVolunteerOnSiteInfo(getState(), id))
            return dispatch(fetchVolunteerOnSiteInfo(jwt, id))

        return null
    }

export const selectVolunteerOnSiteInfo = createSelector(
    (state: AppState) => state,
    (state): VolunteerOnSiteInfo | undefined => state.volunteerOnSiteInfo?.entity
)
