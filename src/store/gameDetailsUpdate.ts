import { PayloadAction, createSlice, createEntityAdapter } from "@reduxjs/toolkit"

import { StateRequest, toastError, toastSuccess, elementListFetch } from "./utils"
import { Game } from "../services/games"
import { gameDetailsUpdate } from "../services/gamesAccessors"
import { AppState, AppThunk } from "."

const gameAdapter = createEntityAdapter<Game>()

const gameDetailsUpdateSlice = createSlice({
    name: "gameDetailsUpdate",
    initialState: gameAdapter.getInitialState({
        readyStatus: "idle",
    } as StateRequest),
    reducers: {
        getRequesting: (state) => {
            state.readyStatus = "request"
        },
        getSuccess: (state, { payload }: PayloadAction<Game[]>) => {
            state.readyStatus = "success"
            gameAdapter.setAll(state, payload)
        },
        getFailure: (state, { payload }: PayloadAction<string>) => {
            state.readyStatus = "failure"
            state.error = payload
        },
    },
})

export default gameDetailsUpdateSlice.reducer
export const { getRequesting, getSuccess, getFailure } = gameDetailsUpdateSlice.actions

export const fetchGameDetailsUpdate = elementListFetch(
    gameDetailsUpdate,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) => toastError(`Erreur lors de la modification d'un bénévole: ${error.message}`),
    () => toastSuccess("Bénévole modifié !")
)

const shouldFetchGameDetailsUpdate = (state: AppState) =>
    state.volunteerList.readyStatus !== "success"

export const fetchGameDetailsUpdateIfNeed = (): AppThunk => (dispatch, getState) => {
    const { jwt } = getState().auth
    if (shouldFetchGameDetailsUpdate(getState())) return dispatch(fetchGameDetailsUpdate(jwt))

    return null
}
