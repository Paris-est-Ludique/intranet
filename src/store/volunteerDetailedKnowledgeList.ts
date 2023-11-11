import type { PayloadAction } from '@reduxjs/toolkit'
import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'
import type { AppDispatch, AppState, AppThunk, EntitiesRequest } from '.'
import type { StateRequest } from '@/utils/elements'
import { elementListFetch } from '@/utils/elements'
import { toastError } from '@/utils/toast'
import type { VolunteerDetailedKnowledge } from '@/services/volunteers'
import { volunteerDetailedKnowledgeList } from '@/services/volunteersAccessors'

const knowledgeListAdapter = createEntityAdapter<VolunteerDetailedKnowledge>()

const initialState = knowledgeListAdapter.getInitialState({
  readyStatus: 'idle',
} as StateRequest)

const volunteerDetailedKnowledgeListSlice = createSlice({
  name: 'volunteerDetailedKnowledgeList',
  initialState,
  reducers: {
    getRequesting: state => {
      state.readyStatus = 'request'
    },
    getSuccess: (state, { payload }: PayloadAction<VolunteerDetailedKnowledge[]>) => {
      state.readyStatus = 'success'
      initialState.setAll(state, payload)
    },
    getFailure: (state, { payload }: PayloadAction<string>) => {
      state.readyStatus = 'failure'
      state.error = payload
    },
  },
})

export const { reducer: volunteerDetailedKnowledgeListReducer, actions: volunteerDetailedKnowledgeListActions }
  = volunteerDetailedKnowledgeListSlice

export const fetchVolunteerDetailedKnowledgeList = elementListFetch(
  volunteerDetailedKnowledgeList,
  volunteerDetailedKnowledgeListActions,
  (error: Error) => toastError(`Erreur lors du chargement de la liste de connaissances détaillée: ${error.message}`),
)

function selectShouldFetchVolunteerDetailedKnowledgeList(state: AppState): boolean {
  return state.volunteerDetailedKnowledgeList?.readyStatus !== 'success'
}

export const fetchVolunteerDetailedKnowledgeListIfNeed: AppThunk
  = (id = 0) =>
    (dispatch: AppDispatch, getState: () => AppState) => {
      let jwt = ''

      if (!id) {
        ;({ jwt, id } = getState().auth)
      }

      if (selectShouldFetchVolunteerDetailedKnowledgeList(getState())) {
        dispatch(fetchVolunteerDetailedKnowledgeList(jwt, id))
      }
    }

export function selectVolunteerDetailedKnowledgeListState(
  state: AppState,
): EntitiesRequest<VolunteerDetailedKnowledge> {
  return state.volunteerDetailedKnowledgeList
}

export const selectVolunteerDetailedKnowledgeList = createSelector(
  selectVolunteerDetailedKnowledgeListState,
  ({ ids, entities, readyStatus }) => {
    if (readyStatus !== 'success') {
      return []
    }

    return ids.map(id => entities[id]) as VolunteerDetailedKnowledge[]
  },
)
