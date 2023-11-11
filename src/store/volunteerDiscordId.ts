import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'
import type { AppDispatch, AppState, AppThunk } from '.'
import type { StateRequest } from '@/utils/elements'
import { elementFetch } from '@/utils/elements'
import { toastError } from '@/utils/toast'

import type { VolunteerDiscordId } from '@/services/volunteers'
import { volunteerDiscordIdGet } from '@/services/volunteersAccessors'

type StateVolunteerDiscordId = { entity?: VolunteerDiscordId } & StateRequest

const initialState: StateVolunteerDiscordId = {
  readyStatus: 'idle',
}

const volunteerDiscordIdSlice = createSlice({
  name: 'volunteerDiscordId',
  initialState,
  reducers: {
    getRequesting: () => ({
      readyStatus: 'request',
    }),
    getSuccess: (_state, { payload }: PayloadAction<VolunteerDiscordId>) => ({
      readyStatus: 'success',
      entity: payload,
    }),
    getFailure: (_state, { payload }: PayloadAction<string>) => ({
      readyStatus: 'failure',
      error: payload,
    }),
  },
})

export const { reducer: volunteerDiscordIdReducer, actions: volunteerDiscordIdActions } = volunteerDiscordIdSlice

export const fetchVolunteerDiscordId = elementFetch(volunteerDiscordIdGet, volunteerDiscordIdActions, (error: Error) =>
  toastError(`Erreur lors du chargement du discordId d'un bénévole: ${error.message}`))

function selectShouldFetchVolunteerDiscordId(state: AppState, id: number) {
  return (
    state.volunteerDiscordId.readyStatus !== 'success'
    || (state.volunteerDiscordId.entity && state.volunteerDiscordId.entity.id !== id)
  )
}

export const fetchVolunteerDiscordIdIfNeed: AppThunk
  = (id = 0) =>
    (dispatch: AppDispatch, getState: () => AppState) => {
      let jwt = ''

      if (!id) {
        ;({ jwt, id } = getState().auth)
      }
      if (selectShouldFetchVolunteerDiscordId(getState(), id)) {
        dispatch(fetchVolunteerDiscordId(jwt, id))
      }
    }

export const selectVolunteerDiscordId = createSelector(
  (state: AppState) => state,
  (state: AppState): string | undefined => state.volunteerDiscordId?.entity?.discordId,
)
