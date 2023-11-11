import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { AppDispatch, AppState, AppThunk } from '.'
import type { StateRequest } from '@/utils/elements'
import { elementFetch } from '@/utils/elements'
import { toastError } from '@/utils/toast'

import type { VolunteerHosting } from '@/services/volunteers'
import { volunteerHostingSet } from '@/services/volunteersAccessors'

type StateVolunteerHostingSet = { entity?: VolunteerHosting } & StateRequest

const initialState: StateVolunteerHostingSet = {
  readyStatus: 'idle',
}

const volunteerHostingSetSlice = createSlice({
  name: 'volunteerHostingSet',
  initialState,
  reducers: {
    getRequesting: () => ({
      readyStatus: 'request',
    }),
    getSuccess: (_state, { payload }: PayloadAction<VolunteerHosting>) => ({
      readyStatus: 'success',
      entity: payload,
    }),
    getFailure: (_state, { payload }: PayloadAction<string>) => ({
      readyStatus: 'failure',
      error: payload,
    }),
  },
})

export const { reducer: volunteerHostingSetReducer, actions: volunteerHostingSetActions } = volunteerHostingSetSlice

export const fetchVolunteerHostingSet = elementFetch(volunteerHostingSet, volunteerHostingSetActions, (error: Error) =>
  toastError(`Erreur lors du chargement des choix de jours de présence: ${error.message}`))

function selectShouldFetchVolunteerHostingSet(state: AppState, id: number) {
  return (
    state.volunteerHostingSet?.readyStatus !== 'success'
    || (state.volunteerHostingSet?.entity && state.volunteerHostingSet?.entity?.id !== id)
  )
}

export const fetchVolunteerHostingSetIfNeed: AppThunk
  = (id = 0, wishes: Partial<VolunteerHosting> = {}) => (dispatch: AppDispatch, getState: () => AppState) => {
    let jwt = ''

    if (!id) {
      ;({ jwt, id } = getState().auth)
    }

    if (selectShouldFetchVolunteerHostingSet(getState(), id)) {
      dispatch(fetchVolunteerHostingSet(jwt, id, wishes))
    }
  }
