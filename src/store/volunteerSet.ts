import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'
import type { StateRequest } from '@/utils/elements'
import { elementFetch } from '@/utils/elements'
import { toastError, toastSuccess } from '@/utils/toast'
import type { AppDispatch, AppState, AppThunk } from '@/store'

import type { Volunteer } from '@/services/volunteers'
import { volunteerSet } from '@/services/volunteersAccessors'

type StateVolunteer = { entity?: Volunteer } & StateRequest

const initialState: StateVolunteer = {
  readyStatus: 'idle',
}

const volunteerSetSlice = createSlice({
  name: 'volunteerSet',
  initialState,
  reducers: {
    getRequesting: () => ({
      readyStatus: 'request',
    }),
    getSuccess: (_state, { payload }: PayloadAction<Volunteer>) => ({
      readyStatus: 'success',
      entity: payload,
    }),
    getFailure: (_state, { payload }: PayloadAction<string>) => ({
      readyStatus: 'failure',
      error: payload,
    }),
  },
})

export const { reducer: volunteerSetReducer, actions: volunteerSetActions } = volunteerSetSlice

export const fetchVolunteerSet = elementFetch(
  volunteerSet,
  volunteerSetActions,
  (error: Error) => toastError(`Erreur lors de la modification d'un bénévole: ${error.message}`),
  () => toastSuccess('Bénévole modifié !'),
)

export const fetchVolunteerSetIfNeed: AppThunk
  = (newPartialVolunteer: Partial<Volunteer>) => (dispatch: AppDispatch, getState: () => AppState) => {
    const { jwt } = getState().auth

    dispatch(fetchVolunteerSet(jwt, newPartialVolunteer))
  }

export const selectVolunteerSet = createSelector(
  (state: AppState) => state,
  (state: AppState): Volunteer | undefined => state.volunteerSet?.entity,
)
