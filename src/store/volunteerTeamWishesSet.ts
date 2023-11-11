import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { AppDispatch, AppState, AppThunk } from '.'
import type { StateRequest } from '@/utils/elements'
import { elementFetch } from '@/utils/elements'
import { toastError } from '@/utils/toast'

import type { VolunteerTeamWishes } from '@/services/volunteers'
import { volunteerTeamWishesSet } from '@/services/volunteersAccessors'

type StateVolunteerTeamWishesSet = {
  entity?: VolunteerTeamWishes
} & StateRequest

const initialState: StateVolunteerTeamWishesSet = {
  readyStatus: 'idle',
}

const volunteerTeamWishesSetSlice = createSlice({
  name: 'volunteerTeamWishesSet',
  initialState,
  reducers: {
    getRequesting: () => ({
      readyStatus: 'request',
    }),
    getSuccess: (_state, { payload }: PayloadAction<VolunteerTeamWishes>) => ({
      readyStatus: 'success',
      entity: payload,
    }),
    getFailure: (_state, { payload }: PayloadAction<string>) => ({
      readyStatus: 'failure',
      error: payload,
    }),
  },
})

export const { reducer: volunteerTeamWishesSetReducer, actions: volunteerTeamWishesSetActions }
  = volunteerTeamWishesSetSlice

export const fetchVolunteerTeamWishesSet = elementFetch(
  volunteerTeamWishesSet,
  volunteerTeamWishesSetActions,
  (error: Error) => toastError(`Erreur lors du chargement des choix d'équipe: ${error.message}`),
)

function selectShouldFetchVolunteerTeamWishesSet(state: AppState, id: number): boolean {
  return (
    state.volunteerTeamWishesSet?.readyStatus !== 'success'
    || (state.volunteerTeamWishesSet?.entity && state.volunteerTeamWishesSet?.entity?.id !== id)
  )
}

export const fetchVolunteerTeamWishesSetIfNeed: AppThunk
  = (id = 0, wishes: Partial<VolunteerTeamWishes> = {}) => (dispatch: AppDispatch, getState: () => AppState) => {
    let jwt = ''

    if (!id) {
      ;({ jwt, id } = getState().auth)
    }

    const shouldFetch = selectShouldFetchVolunteerTeamWishesSet(getState(), id)

    if (shouldFetch) {
      dispatch(fetchVolunteerTeamWishesSet(jwt, id, wishes))
    }
  }
