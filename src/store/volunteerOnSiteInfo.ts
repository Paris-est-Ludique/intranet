import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'
import type { AppDispatch, AppState, AppThunk } from '.'
import type { StateRequest } from '@/utils/elements'
import { elementFetch } from '@/utils/elements'
import { toastError } from '@/utils/toast'

import type { VolunteerOnSiteInfo } from '@/services/volunteers'
import { volunteerOnSiteInfoGet } from '@/services/volunteersAccessors'

type StateVolunteerOnSiteInfo = { entity?: VolunteerOnSiteInfo } & StateRequest

const initialState: StateVolunteerOnSiteInfo = {
  readyStatus: 'idle',
}

const volunteerOnSiteInfoSlice = createSlice({
  name: 'volunteerOnSiteInfo',
  initialState,
  reducers: {
    getRequesting: () => ({
      readyStatus: 'request',
    }),
    getSuccess: (_state, { payload }: PayloadAction<VolunteerOnSiteInfo>) => ({
      readyStatus: 'success',
      entity: payload,
    }),
    getFailure: (_state, { payload }: PayloadAction<string>) => ({
      readyStatus: 'failure',
      error: payload,
    }),
  },
})

export const volunteerOnSiteInfoActions = volunteerOnSiteInfoSlice.actions
export const volunteerOnSiteInfoReducer = volunteerOnSiteInfoSlice.reducer

export const fetchVolunteerOnSiteInfo = elementFetch(
  volunteerOnSiteInfoGet,
  volunteerOnSiteInfoActions,
  (error: Error) => toastError(`Erreur lors du chargement des infos sur site d'un bénévole: ${error.message}`),
)

function selectShouldFetchVolunteerOnSiteInfo(state: AppState, id: number) {
  return (
    state.volunteerOnSiteInfo.readyStatus !== 'success'
    || (state.volunteerOnSiteInfo.entity && state.volunteerOnSiteInfo.entity.id !== id)
  )
}

export const fetchVolunteerOnSiteInfoIfNeed: AppThunk
  = (id = 0) =>
    (dispatch: AppDispatch, getState: () => AppState) => {
      let jwt = ''

      if (!id) {
        ;({ jwt, id } = getState().auth)
      }

      const shouldFetch = selectShouldFetchVolunteerOnSiteInfo(getState(), id)

      if (shouldFetch) {
        dispatch(fetchVolunteerOnSiteInfo(jwt, id))
      }
    }

export const selectVolunteerOnSiteInfo = createSelector(
  (state: AppState) => state,
  (state: AppState): VolunteerOnSiteInfo | undefined => state.volunteerOnSiteInfo?.entity,
)
