import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { AppDispatch, AppState, AppThunk } from '.'
import type { StateRequest } from '@/utils/elements'
import { elementFetch } from '@/utils/elements'
import { toastError } from '@/utils/toast'

import type { VolunteerPersonalInfo } from '@/services/volunteers'
import { volunteerPersonalInfoSet } from '@/services/volunteersAccessors'

type StateVolunteerPersonalInfoSet = {
  entity?: VolunteerPersonalInfo
} & StateRequest

const initialState: StateVolunteerPersonalInfoSet = {
  readyStatus: 'idle',
}

const volunteerPersonalInfoSetSlice = createSlice({
  name: 'volunteerPersonalInfoSet',
  initialState,
  reducers: {
    getRequesting: (_state: unknown) => ({
      readyStatus: 'request',
    }),
    getSuccess: (_state: unknown, { payload }: PayloadAction<VolunteerPersonalInfo>) => ({
      readyStatus: 'success',
      entity: payload,
    }),
    getFailure: (_state: unknown, { payload }: PayloadAction<string>) => ({
      readyStatus: 'failure',
      error: payload,
    }),
  },
})

export const { reducer: volunteerPersonalInfoSetReducer, actions: volunteerPersonalInfoSetActions }
  = volunteerPersonalInfoSetSlice

export const fetchVolunteerPersonalInfoSet = elementFetch(
  volunteerPersonalInfoSet,
  volunteerPersonalInfoSetActions,
  (error: Error) => toastError(`Erreur lors du chargement des choix de jours de présence: ${error.message}`),
)

function selectShouldFetchVolunteerPersonalInfoSet(state: AppState, id: number) {
  return (
    state.volunteerPersonalInfoSet?.readyStatus !== 'success'
    || (state.volunteerPersonalInfoSet?.entity && state.volunteerPersonalInfoSet?.entity?.id !== id)
  )
}

export const fetchVolunteerPersonalInfoSetIfNeed: AppThunk
  = (id = 0, wishes: Partial<VolunteerPersonalInfo> = {}) => (dispatch: AppDispatch, getState: () => AppState) => {
    let jwt = ''

    if (!id) {
      ;({ jwt, id } = getState().auth)
    }

    const shouldFetch = selectShouldFetchVolunteerPersonalInfoSet(getState(), id)

    if (shouldFetch) {
      dispatch(fetchVolunteerPersonalInfoSet(jwt, id, wishes))
    }
  }
