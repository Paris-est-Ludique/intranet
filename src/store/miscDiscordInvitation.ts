import first from 'lodash/first'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'
import type { AppDispatch, AppState, AppThunk, EntitiesRequest } from '.'
import type { StateRequest } from '@/utils/elements'
import { elementListFetch } from '@/utils/elements'
import { toastError } from '@/utils/toast'

import type { MiscDiscordInvitation } from '@/services/miscs'
import { miscDiscordInvitation } from '@/services/miscsAccessors'

const miscDiscordAdapter = createEntityAdapter<MiscDiscordInvitation>()

const initialState = miscDiscordAdapter.getInitialState({
  readyStatus: 'idle',
} as StateRequest)

const miscDiscordInvitationSlice = createSlice({
  name: 'miscDiscordInvitation',
  initialState,
  reducers: {
    getRequesting: (state) => {
      state.readyStatus = 'request'
    },
    getSuccess: (state, { payload }: PayloadAction<MiscDiscordInvitation[]>) => {
      state.readyStatus = 'success'
      miscDiscordAdapter.setAll(state, payload)
    },
    getFailure: (state, { payload }: PayloadAction<string>) => {
      state.readyStatus = 'failure'
      state.error = payload
    },
  },
})

export const {
  reducer: miscDiscordInvitationReducer,
  actions: miscDiscordInvitationActions,
} = miscDiscordInvitationSlice

export const fetchMiscDiscordInvitation = elementListFetch(
  miscDiscordInvitation,
  miscDiscordInvitationActions,
  (error: Error) => toastError(`Erreur lors du chargement des données diverses: ${error.message}`),
)

function selectShouldFetchMiscDiscordInvitation(state: AppState) {
  return state.miscDiscordInvitation.readyStatus !== 'success'
}

export const fetchMiscDiscordInvitationIfNeed: AppThunk = () => (dispatch: AppDispatch, getState: () => AppState) => {
  const { jwt } = getState().auth
  if (selectShouldFetchMiscDiscordInvitation(getState())) {
    dispatch(fetchMiscDiscordInvitation(jwt))
  }
}

export const refreshMiscDiscordInvitation: AppThunk = (jwt: string) => (dispatch: AppDispatch) => dispatch(fetchMiscDiscordInvitation(jwt))

export function selectMiscDiscordInvitationState(state: AppState): EntitiesRequest<MiscDiscordInvitation> {
  return state.miscDiscordInvitation
}

export const selectMiscDiscordInvitation = createSelector(
  selectMiscDiscordInvitationState,
  ({ ids, entities, readyStatus }) => {
    if (readyStatus !== 'success')
      return ''
    const id = first(ids)
    if (id === undefined)
      return ''
    return entities[id]?.discordInvitation || ''
  },
)
