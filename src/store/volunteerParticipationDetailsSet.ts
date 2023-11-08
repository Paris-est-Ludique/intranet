import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { StateRequest } from './utils'
import { elementFetch, toastError } from './utils'
import type { AppDispatch, AppState, AppThunk } from '.'

import type { VolunteerParticipationDetails } from '@/services/volunteers'
import { volunteerParticipationDetailsSet } from '@/services/volunteersAccessors'

type StateVolunteerParticipationDetailsSet = {
  entity?: VolunteerParticipationDetails
} & StateRequest

const initialState: StateVolunteerParticipationDetailsSet = {
  readyStatus: 'idle',
}

const volunteerParticipationDetailsSetSlice = createSlice({
  name: 'volunteerParticipationDetailsSet',
  initialState,
  reducers: {
    getRequesting: () => ({
      readyStatus: 'request',
    }),
    getSuccess: (_state, { payload }: PayloadAction<VolunteerParticipationDetails>) => ({
      readyStatus: 'success',
      entity: payload,
    }),
    getFailure: (_state, { payload }: PayloadAction<string>) => ({
      readyStatus: 'failure',
      error: payload,
    }),
  },
})

export const {
  reducer: volunteerParticipationDetailsSetReducer,
  actions: volunteerParticipationDetailsSetActions,
} = volunteerParticipationDetailsSetSlice

export const fetchVolunteerParticipationDetailsSet = elementFetch(
  volunteerParticipationDetailsSet,
  volunteerParticipationDetailsSetActions,
  (error: Error) =>
    toastError(`Erreur lors du chargement des détails de participation: ${error.message}`),
)

function selectShouldFetchVolunteerParticipationDetailsSet(state: AppState, id: number) {
  return state.volunteerParticipationDetailsSet?.readyStatus !== 'success'
    || (state.volunteerParticipationDetailsSet?.entity
        && state.volunteerParticipationDetailsSet?.entity?.id !== id)
}

export const fetchVolunteerParticipationDetailsSetIfNeed: AppThunk = (id = 0, wishes: Partial<VolunteerParticipationDetails> = {}) => (dispatch: AppDispatch, getState: () => AppState) => {
  let jwt = ''

  if (!id) {
    ;({ jwt, id } = getState().auth)
  }

  const shouldFetch = selectShouldFetchVolunteerParticipationDetailsSet(getState(), id)
  if (shouldFetch) {
    dispatch(fetchVolunteerParticipationDetailsSet(jwt, id, wishes))
  }
}
