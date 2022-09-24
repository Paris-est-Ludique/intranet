import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { shallowEqual, useSelector } from "react-redux"
import { useCallback } from "react"
import { StateRequest, toastError, elementFetch } from "./utils"
import { VolunteerLoan } from "../services/volunteers"
import { AppThunk, AppState } from "."
import { volunteerLoanSet } from "../services/volunteersAccessors"
import useAction from "../utils/useAction"
import { selectUserJwtToken } from "./auth"

type StateVolunteerLoanSet = {
    entity?: VolunteerLoan
} & StateRequest

export const initialState: StateVolunteerLoanSet = {
    readyStatus: "idle",
}

const volunteerLoanSetSlice = createSlice({
    name: "volunteerLoanSet",
    initialState,
    reducers: {
        getRequesting: (_) => ({
            readyStatus: "request",
        }),
        getSuccess: (_, { payload }: PayloadAction<VolunteerLoan>) => ({
            readyStatus: "success",
            entity: payload,
        }),
        getFailure: (_, { payload }: PayloadAction<string>) => ({
            readyStatus: "failure",
            error: payload,
        }),
    },
})

export default volunteerLoanSetSlice.reducer
export const { getRequesting, getSuccess, getFailure } = volunteerLoanSetSlice.actions

export const fetchVolunteerLoanSet = elementFetch(
    volunteerLoanSet,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) => toastError(`Erreur lors du chargement des emprunts: ${error.message}`)
)

const shouldFetchVolunteerLoanSet = (state: AppState, id: number) =>
    state.volunteerLoanSet?.readyStatus !== "success" ||
    (state.volunteerLoanSet?.entity && state.volunteerLoanSet?.entity?.id !== id)

export const fetchVolunteerLoanSetIfNeed =
    (id = 0, loan: Partial<VolunteerLoan> = {}): AppThunk =>
    (dispatch, getState) => {
        let jwt = ""

        if (!id) {
            ;({ jwt, id } = getState().auth)
        }

        if (shouldFetchVolunteerLoanSet(getState(), id))
            return dispatch(fetchVolunteerLoanSet(jwt, id, loan))

        return null
    }

type SetFunction = (newVolunteerLoan: VolunteerLoan) => void

export const useVolunteerLoan = (): [VolunteerLoan | undefined, SetFunction] => {
    const save = useAction(fetchVolunteerLoanSet)
    const jwtToken = useSelector(selectUserJwtToken)
    const volunteerLoan = useSelector(
        (state: AppState) => state.volunteerLoanSet?.entity,
        shallowEqual
    )

    const saveVolunteerLoan: SetFunction = useCallback(
        (newVolunteerLoan) => {
            save(jwtToken, 0, newVolunteerLoan)
        },
        [save, jwtToken]
    )

    return [volunteerLoan, saveVolunteerLoan]
}
