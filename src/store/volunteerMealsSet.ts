import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { AppDispatch, AppState, AppThunk } from '.'
import type { StateRequest } from '@/utils/elements'
import { elementFetch } from '@/utils/elements'
import { toastError } from '@/utils/toast'

import type { VolunteerMeals } from '@/services/volunteers'
import { volunteerMealsSet } from '@/services/volunteersAccessors'

type StateVolunteerMealsSet = { entity?: VolunteerMeals } & StateRequest

const initialState: StateVolunteerMealsSet = {
  readyStatus: 'idle',
}

const volunteerMealsSetSlice = createSlice({
  name: 'volunteerMealsSet',
  initialState,
  reducers: {
    getRequesting: () => ({
      readyStatus: 'request',
    }),
    getSuccess: (_state, { payload }: PayloadAction<VolunteerMeals>) => ({
      readyStatus: 'success',
      entity: payload,
    }),
    getFailure: (_state, { payload }: PayloadAction<string>) => ({
      readyStatus: 'failure',
      error: payload,
    }),
  },
})

export const volunteerMealsSetActions = volunteerMealsSetSlice.actions
export const volunteerMealsSetReducer = volunteerMealsSetSlice.reducer

export const fetchVolunteerMealsSet = elementFetch(volunteerMealsSet, volunteerMealsSetActions, (error: Error) =>
  toastError(`Erreur lors du chargement des choix des repas: ${error.message}`))

function selectShouldFetchVolunteerMealsSet(state: AppState, id: number) {
  return (
    state.volunteerMealsSet?.readyStatus !== 'success'
    || (state.volunteerMealsSet?.entity && state.volunteerMealsSet?.entity?.id !== id)
  )
}

export const fetchVolunteerMealsSetIfNeed: AppThunk
  = (id = 0, wishes: Partial<VolunteerMeals> = {}) => (dispatch: AppDispatch, getState: () => AppState) => {
    let jwt = ''

    if (!id) {
      ;({ jwt, id } = getState().auth)
    }

    if (selectShouldFetchVolunteerMealsSet(getState(), id)) {
      dispatch(fetchVolunteerMealsSet(jwt, id, wishes))
    }
  }
