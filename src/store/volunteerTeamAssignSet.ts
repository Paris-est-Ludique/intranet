import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { AppDispatch, AppState, AppThunk } from '.'
import type { StateRequest } from '@/utils/elements'
import { elementFetch } from '@/utils/elements'
import { toastError } from '@/utils/toast'

import type { VolunteerTeamAssign } from '@/services/volunteers'
import { volunteerTeamAssignSet } from '@/services/volunteersAccessors'

type StateVolunteerTeamAssignSet = {
  entity?: VolunteerTeamAssign
} & StateRequest

const initialState: StateVolunteerTeamAssignSet = {
  readyStatus: 'idle',
}

const volunteerTeamAssignSetSlice = createSlice({
  name: 'volunteerTeamAssignSet',
  initialState,
  reducers: {
    getRequesting: () => ({
      readyStatus: 'request',
    }),
    getSuccess: (_state, { payload }: PayloadAction<VolunteerTeamAssign>) => ({
      readyStatus: 'success',
      entity: payload,
    }),
    getFailure: (_state, { payload }: PayloadAction<string>) => ({
      readyStatus: 'failure',
      error: payload,
    }),
  },
})

export const { reducer: volunteerTeamAssignSetReducer, actions: volunteerTeamAssignSetActions }
  = volunteerTeamAssignSetSlice

export const fetchVolunteerTeamAssignSet = elementFetch(
  volunteerTeamAssignSet,
  volunteerTeamAssignSetActions,
  (error: Error) => toastError(`Erreur lors du chargement des assignation d'équipe: ${error.message}`),
)

function selectShouldFetchVolunteerTeamAssignSet(state: AppState, id: number): boolean {
  return (
    state.volunteerTeamAssignSet?.readyStatus !== 'success'
    || (state.volunteerTeamAssignSet?.entity && state.volunteerTeamAssignSet?.entity?.id !== id)
  )
}

export const fetchVolunteerTeamAssignSetIfNeed: AppThunk
  = (id = 0, wishes: Partial<VolunteerTeamAssign> = {}) => (dispatch: AppDispatch, getState: () => AppState) => {
    let jwt = ''

    if (!id) {
      ;({ jwt, id } = getState().auth)
    }

    const shouldFetch = selectShouldFetchVolunteerTeamAssignSet(getState(), id)

    if (shouldFetch) {
      dispatch(fetchVolunteerTeamAssignSet(jwt, id, wishes))
    }
  }
