import { PayloadAction, createSlice, createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { StateRequest, toastError, elementListFetch } from "./utils"
import { VolunteerDetailedKnowledge } from "../services/volunteers"
import { AppThunk, AppState, EntitiesRequest } from "."
import { volunteerDetailedKnowledgeList } from "../services/volunteersAccessors"

const knowledgeAdapter = createEntityAdapter<VolunteerDetailedKnowledge>()

export const initialState = knowledgeAdapter.getInitialState({
    readyStatus: "idle",
} as StateRequest)

const volunteerDetailedKnowledgeListSlice = createSlice({
    name: "volunteerDetailedKnowledgeList",
    initialState,
    reducers: {
        getRequesting: (state) => {
            state.readyStatus = "request"
        },
        getSuccess: (state, { payload }: PayloadAction<VolunteerDetailedKnowledge[]>) => {
            state.readyStatus = "success"
            knowledgeAdapter.setAll(state, payload)
        },
        getFailure: (state, { payload }: PayloadAction<string>) => {
            state.readyStatus = "failure"
            state.error = payload
        },
    },
})

export default volunteerDetailedKnowledgeListSlice.reducer
export const { getRequesting, getSuccess, getFailure } = volunteerDetailedKnowledgeListSlice.actions

export const fetchVolunteerDetailedKnowledgeList = elementListFetch(
    volunteerDetailedKnowledgeList,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) =>
        toastError(
            `Erreur lors du chargement de la liste de connaissances détaillée: ${error.message}`
        )
)

const shouldFetchVolunteerDetailedKnowledgeList = (state: AppState) =>
    state.volunteerDetailedKnowledgeList?.readyStatus !== "success"

export const fetchVolunteerDetailedKnowledgeListIfNeed =
    (id = 0): AppThunk =>
    (dispatch, getState) => {
        let jwt = ""

        if (!id) {
            ;({ jwt, id } = getState().auth)
        }
        if (shouldFetchVolunteerDetailedKnowledgeList(getState()))
            return dispatch(fetchVolunteerDetailedKnowledgeList(jwt, id))

        return null
    }

export const selectVolunteerDetailedKnowledgeListState = (
    state: AppState
): EntitiesRequest<VolunteerDetailedKnowledge> => state.volunteerDetailedKnowledgeList

export const selectVolunteerDetailedKnowledgeList = createSelector(
    selectVolunteerDetailedKnowledgeListState,
    ({ ids, entities, readyStatus }) => {
        if (readyStatus !== "success") return []
        return ids.map((id) => entities[id]) as VolunteerDetailedKnowledge[]
    }
)
