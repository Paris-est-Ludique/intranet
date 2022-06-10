import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppState } from "./index"

const initialState = {
    modalId: "",
}

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        displayModal: (state, action: PayloadAction<string>) => {
            state.modalId = action.payload
        },
        hideModal: (state) => {
            state.modalId = ""
        },
    },
})

export default uiSlice.reducer

export const { displayModal, hideModal } = uiSlice.actions

const selectUiData = (state: AppState) => state.ui

export const selectActiveModalId = createSelector(selectUiData, (ui) => ui.modalId)

export const MODAL_IDS = {
    DAYWISHES: "DAYWISHES",
    HOSTING: "HOSTING",
    MEALS: "MEALS",
    PARTICIPATIONDETAILS: "PARTICIPATIONDETAILS",
    TEAMWISHES: "TEAMWISHES",
}
