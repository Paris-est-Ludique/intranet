import { useCallback } from 'react'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { shallowEqual, useSelector } from 'react-redux'

import { selectUserJwtToken } from './auth'
import type { AppDispatch, AppState, AppThunk } from '.'
import type { StateRequest } from '@/utils/elements'
import { elementFetch } from '@/utils/elements'
import { toastError } from '@/utils/toast'
import type { VolunteerKnowledge } from '@/services/volunteers'
import { volunteerKnowledgeSet } from '@/services/volunteersAccessors'
import useAction from '@/utils/useAction'

type StateVolunteerKnowledgeSet = {
  entity?: VolunteerKnowledge
} & StateRequest

const initialState: StateVolunteerKnowledgeSet = {
  readyStatus: 'idle',
}

const volunteerKnowledgeSetSlice = createSlice({
  name: 'volunteerKnowledgeSet',
  initialState,
  reducers: {
    getRequesting: () => ({
      readyStatus: 'request',
    }),
    getSuccess: (_state, { payload }: PayloadAction<VolunteerKnowledge>) => ({
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
  reducer: volunteerKnowledgeSetReducer,
  actions: volunteerKnowledgeSetActions,
} = volunteerKnowledgeSetSlice

export const fetchVolunteerKnowledgeSet = elementFetch(
  volunteerKnowledgeSet,
  volunteerKnowledgeSetActions,
  (error: Error) => toastError(`Erreur lors du chargement des connaissances: ${error.message}`),
)

function selectShouldFetchVolunteerKnowledgeSet(state: AppState, id: number) {
  return state.volunteerKnowledgeSet?.readyStatus !== 'success'
    || (state.volunteerKnowledgeSet?.entity && state.volunteerKnowledgeSet?.entity?.id !== id)
}

export const fetchVolunteerKnowledgeSetIfNeed: AppThunk = (id = 0, knowledge: Partial<VolunteerKnowledge> = {}) => (dispatch: AppDispatch, getState: () => AppState) => {
  let jwt = ''

  if (!id) {
    ;({ jwt, id } = getState().auth)
  }

  if (selectShouldFetchVolunteerKnowledgeSet(getState(), id)) {
    dispatch(fetchVolunteerKnowledgeSet(jwt, id, knowledge))
  }
}

type SetFunction = (newVolunteerKnowledge: VolunteerKnowledge) => void

export function useVolunteerKnowledge(): [VolunteerKnowledge | undefined, SetFunction] {
  const save = useAction(fetchVolunteerKnowledgeSet)
  const jwtToken = useSelector(selectUserJwtToken)
  const volunteerKnowledge = useSelector(
    (state: AppState) => state.volunteerKnowledgeSet?.entity,
    shallowEqual,
  )

  const saveVolunteerKnowledge: SetFunction = useCallback(
    (newVolunteerKnowledge) => {
      save(jwtToken, 0, newVolunteerKnowledge)
    },
    [save, jwtToken],
  )

  return [volunteerKnowledge, saveVolunteerKnowledge]
}
