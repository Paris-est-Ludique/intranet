import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'
import type { AppState } from './index'

const initialState = {
  modalId: '',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    displayModal: (state, action: PayloadAction<string>) => {
      state.modalId = action.payload
    },
    hideModal: (state) => {
      state.modalId = ''
    },
  },
})

export const {
  actions: uiActions,
  reducer: uiReducer,
} = uiSlice

export const { displayModal, hideModal } = uiActions

const selectUiData = (state: AppState) => state.ui

export const selectActiveModalId = createSelector(selectUiData, ui => ui.modalId)

export const MODAL_IDS = {
  BRUNCH: 'BRUNCH',
  DAYWISHES: 'DAYWISHES',
  HOSTING: 'HOSTING',
  MEALS: 'MEALS',
  PARTICIPATIONDETAILS: 'PARTICIPATIONDETAILS',
  PERSONALINFO: 'PERSONALINFO',
  RETEX: 'RETEX',
  TEAMWISHES: 'TEAMWISHES',
}
