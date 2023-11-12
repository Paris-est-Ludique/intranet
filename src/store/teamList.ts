import get from 'lodash/get'

import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AppDispatch, AppState, AppThunk, EntitiesRequest } from '.'
import type { StateRequest } from '@/utils/elements'
import { elementListFetch } from '@/utils/elements'
import { toastError } from '@/utils/toast'
import type { Team } from '@/services/teams'
import { teamListGet } from '@/services/teamsAccessors'

const teamAdapter = createEntityAdapter<Team>()

const initialState = teamAdapter.getInitialState({
  readyStatus: 'idle',
} as StateRequest)

const teamListSlice = createSlice({
  name: 'teamList',
  initialState,
  reducers: {
    getRequesting: state => {
      state.readyStatus = 'request'
    },
    getSuccess: (state, { payload }: PayloadAction<Team[]>) => {
      state.readyStatus = 'success'
      teamAdapter.setAll(state, payload)
    },
    getFailure: (state, { payload }: PayloadAction<string>) => {
      state.readyStatus = 'failure'
      state.error = payload
    },
  },
})

export const teamListActions = teamListSlice.actions
export const teamListReducer = teamListSlice.reducer

export const fetchTeamList = elementListFetch(teamListGet, teamListActions, (error: Error) =>
  toastError(`Erreur lors du chargement des équipes: ${error.message}`))

function selectShouldFetchTeamList(state: AppState) {
  return state.teamList.readyStatus !== 'success'
}

export const fetchTeamListIfNeed: AppThunk = () => (dispatch: AppDispatch, getState: () => AppState) => {
  if (selectShouldFetchTeamList(getState())) {
    dispatch(fetchTeamList())
  }
}

export function selectTeamListState(state: AppState): EntitiesRequest<Team> {
  return state.teamList
}

export const selectTeamList = createSelector(selectTeamListState, ({ ids, entities, readyStatus }) => {
  if (readyStatus !== 'success') {
    return []
  }

  return ids.map(id => entities[id])
})

export const selectSortedTeams = createSelector(selectTeamList, teams =>
  [...teams].sort((a, b) => get(a, 'order', 0) - get(b, 'order', 0)))

export const selectSortedActiveTeams = createSelector(selectTeamList, teams =>
  [...teams.filter(team => get(team, 'status') === 'active')].sort((a, b) => get(a, 'order', 0) - get(b, 'order', 0)))
