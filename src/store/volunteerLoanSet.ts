import { useCallback } from 'react'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { shallowEqual, useSelector } from 'react-redux'
import { selectUserJwtToken } from './auth'
import type { AppDispatch, AppState, AppThunk } from '.'
import type { StateRequest } from '@/utils/elements'
import { elementFetch } from '@/utils/elements'
import { toastError } from '@/utils/toast'
import type { VolunteerLoan } from '@/services/volunteers'
import { volunteerLoanSet } from '@/services/volunteersAccessors'
import useAction from '@/utils/useAction'

type StateVolunteerLoanSet = {
  entity?: VolunteerLoan
} & StateRequest

const initialState: StateVolunteerLoanSet = {
  readyStatus: 'idle',
}

const volunteerLoanSetSlice = createSlice({
  name: 'volunteerLoanSet',
  initialState,
  reducers: {
    getRequesting: () => ({
      readyStatus: 'request',
    }),
    getSuccess: (_state, { payload }: PayloadAction<VolunteerLoan>) => ({
      readyStatus: 'success',
      entity: payload,
    }),
    getFailure: (_state, { payload }: PayloadAction<string>) => ({
      readyStatus: 'failure',
      error: payload,
    }),
  },
})

export const volunteerLoanSetActions = volunteerLoanSetSlice.actions
export const volunteerLoanSetReducer = volunteerLoanSetSlice.reducer

export const fetchVolunteerLoanSet = elementFetch(volunteerLoanSet, volunteerLoanSetActions, (error: Error) =>
  toastError(`Erreur lors du chargement des emprunts: ${error.message}`))

function selectShouldFetchVolunteerLoanSet(state: AppState, id: number) {
  return (
    state.volunteerLoanSet?.readyStatus !== 'success'
    || (state.volunteerLoanSet?.entity && state.volunteerLoanSet?.entity?.id !== id)
  )
}

export const fetchVolunteerLoanSetIfNeed: AppThunk
  = (id = 0, loan: Partial<VolunteerLoan> = {}) => (dispatch: AppDispatch, getState: () => AppState) => {
    let jwt = ''

    if (!id) {
      ;({ jwt, id } = getState().auth)
    }

    if (selectShouldFetchVolunteerLoanSet(getState(), id)) {
      return dispatch(fetchVolunteerLoanSet(jwt, id, loan))
    }

    return null
  }

type SetFunction = (newVolunteerLoan: VolunteerLoan) => void

export function useVolunteerLoan(): [VolunteerLoan | undefined, SetFunction] {
  const save = useAction(fetchVolunteerLoanSet)
  const jwtToken = useSelector(selectUserJwtToken)
  const volunteerLoan = useSelector((state: AppState) => state.volunteerLoanSet?.entity, shallowEqual)

  const saveVolunteerLoan: SetFunction = useCallback(
    newVolunteerLoan => {
      save(jwtToken, 0, newVolunteerLoan)
    },
    [save, jwtToken],
  )

  return [volunteerLoan, saveVolunteerLoan]
}
