import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { AppDispatch, AppState, AppThunk } from '.'
import type { StateRequest } from '@/utils/elements'
import { elementFetch } from '@/utils/elements'
import { toastError } from '@/utils/toast'

import type { VolunteerDayWishes } from '@/services/volunteers'
import { volunteerDayWishesSet } from '@/services/volunteersAccessors'

type StateVolunteerDayWishesSet = {
  entity?: VolunteerDayWishes
} & StateRequest

const initialState: StateVolunteerDayWishesSet = {
  readyStatus: 'idle',
}

const volunteerDayWishesSetSlice = createSlice({
  name: 'volunteerDayWishesSet',
  initialState,
  reducers: {
    getRequesting: () => ({
      readyStatus: 'request',
    }),
    getSuccess: (_state, { payload }: PayloadAction<VolunteerDayWishes>) => ({
      readyStatus: 'success',
      entity: payload,
    }),
    getFailure: (_state, { payload }: PayloadAction<string>) => ({
      readyStatus: 'failure',
      error: payload,
    }),
  },
})

export const { reducer: volunteerDayWishesSetReducer, actions: volunteerDayWishesSetActions }
  = volunteerDayWishesSetSlice

export const fetchVolunteerDayWishesSet = elementFetch(
  volunteerDayWishesSet,
  volunteerDayWishesSetActions,
  (error: Error) => toastError(`Erreur lors du chargement des choix de jours de présence: ${error.message}`),
)

function selectShouldFetchVolunteerDayWishesSet(state: AppState, id: number) {
  return (
    state.volunteerDayWishesSet?.readyStatus !== 'success'
    || (state.volunteerDayWishesSet?.entity && state.volunteerDayWishesSet?.entity?.id !== id)
  )
}

export const fetchVolunteerDayWishesSetIfNeed: AppThunk
  = (id = 0, wishes: Partial<VolunteerDayWishes> = {}) => (dispatch: AppDispatch, getState: () => AppState) => {
    let jwt = ''

    if (!id) {
      ;({ jwt, id } = getState().auth)
    }

    if (selectShouldFetchVolunteerDayWishesSet(getState(), id)) {
      dispatch(fetchVolunteerDayWishesSet(jwt, id, wishes))
    }
  }
