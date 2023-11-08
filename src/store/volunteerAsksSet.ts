import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { StateRequest } from './utils'
import { elementFetch, toastError } from './utils'
import type { AppDispatch, AppState, AppThunk } from '.'

import type { VolunteerAsks } from '@/services/volunteers'
import { volunteerAsksSet } from '@/services/volunteersAccessors'

type StateVolunteerAsksSet = { entity?: VolunteerAsks } & StateRequest

const initialState: StateVolunteerAsksSet = {
  readyStatus: 'idle',
}

const volunteerAsksSetSlice = createSlice({
  name: 'volunteerAsksSet',
  initialState,
  reducers: {
    getRequesting: () => ({
      readyStatus: 'request',
    }),
    getSuccess: (_state, { payload }: PayloadAction<VolunteerAsks>) => ({
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
  reducer: volunteerAsksSetReducer,
  actions: volunteerAsksSetActions,
} = volunteerAsksSetSlice

export const fetchVolunteerAsksSet = elementFetch(
  volunteerAsksSet,
  volunteerAsksSetActions,
  (error: Error) => toastError(`Erreur lors du chargement des notifications: ${error.message}`),
)

function selectShouldFetchVolunteerAsksSet(state: AppState, id: number) {
  return state.volunteerAsksSet?.readyStatus !== 'success'
    || (state.volunteerAsksSet?.entity && state.volunteerAsksSet?.entity?.id !== id)
}

export const fetchVolunteerAsksSetIfNeed: AppThunk = (id = 0, notif: Partial<VolunteerAsks> = {}) => (dispatch: AppDispatch, getState: () => AppState) => {
  let jwt = ''

  if (!id) {
    ;({ jwt, id } = getState().auth)
  }

  if (selectShouldFetchVolunteerAsksSet(getState(), id)) {
    dispatch(fetchVolunteerAsksSet(jwt, id, notif))
  }
}
