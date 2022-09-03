import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { shallowEqual, useSelector } from "react-redux"
import { useCallback } from "react"
import { StateRequest, toastError, elementFetch } from "./utils"
import { VolunteerKnowledge } from "../services/volunteers"
import { AppThunk, AppState } from "."
import { volunteerKnowledgeSet } from "../services/volunteersAccessors"
import useAction from "../utils/useAction"
import { selectUserJwtToken } from "./auth"

type StateVolunteerKnowledgeSet = {
    entity?: VolunteerKnowledge
} & StateRequest

export const initialState: StateVolunteerKnowledgeSet = {
    readyStatus: "idle",
}

const volunteerKnowledgeSetSlice = createSlice({
    name: "volunteerKnowledgeSet",
    initialState,
    reducers: {
        getRequesting: (_) => ({
            readyStatus: "request",
        }),
        getSuccess: (_, { payload }: PayloadAction<VolunteerKnowledge>) => ({
            readyStatus: "success",
            entity: payload,
        }),
        getFailure: (_, { payload }: PayloadAction<string>) => ({
            readyStatus: "failure",
            error: payload,
        }),
    },
})

export default volunteerKnowledgeSetSlice.reducer
export const { getRequesting, getSuccess, getFailure } = volunteerKnowledgeSetSlice.actions

export const fetchVolunteerKnowledgeSet = elementFetch(
    volunteerKnowledgeSet,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) => toastError(`Erreur lors du chargement des connaissances: ${error.message}`)
)

const shouldFetchVolunteerKnowledgeSet = (state: AppState, id: number) =>
    state.volunteerKnowledgeSet?.readyStatus !== "success" ||
    (state.volunteerKnowledgeSet?.entity && state.volunteerKnowledgeSet?.entity?.id !== id)

export const fetchVolunteerKnowledgeSetIfNeed =
    (id = 0, knowledge: Partial<VolunteerKnowledge> = {}): AppThunk =>
    (dispatch, getState) => {
        let jwt = ""

        if (!id) {
            ;({ jwt, id } = getState().auth)
        }

        if (shouldFetchVolunteerKnowledgeSet(getState(), id))
            return dispatch(fetchVolunteerKnowledgeSet(jwt, id, knowledge))

        return null
    }

type SetFunction = (newVolunteerKnowledge: VolunteerKnowledge) => void

export const useVolunteerKnowledge = (): [VolunteerKnowledge | undefined, SetFunction] => {
    const save = useAction(fetchVolunteerKnowledgeSet)
    const jwtToken = useSelector(selectUserJwtToken)
    const volunteerKnowledge = useSelector(
        (state: AppState) => state.volunteerKnowledgeSet?.entity,
        shallowEqual
    )

    const saveVolunteerKnowledge: SetFunction = useCallback(
        (newVolunteerKnowledge) => {
            save(jwtToken, 0, newVolunteerKnowledge)
        },
        [save, jwtToken]
    )

    return [volunteerKnowledge, saveVolunteerKnowledge]
}
