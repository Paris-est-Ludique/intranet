import { PayloadAction, createSlice, createEntityAdapter, createSelector } from "@reduxjs/toolkit"
import { sortedUniqBy, sortBy } from "lodash"

import { StateRequest, toastError, elementListFetch, gameTitleOrder } from "./utils"
import { DetailedBox } from "../services/boxes"
import { AppThunk, AppState, EntitiesRequest } from "."
import { detailedBoxListGet } from "../services/boxesAccessors"

const boxAdapter = createEntityAdapter<DetailedBox>()

export const initialState = boxAdapter.getInitialState({
    readyStatus: "idle",
} as StateRequest)

const boxList = createSlice({
    name: "boxList",
    initialState,
    reducers: {
        getRequesting: (state) => {
            state.readyStatus = "request"
        },
        getSuccess: (state, { payload }: PayloadAction<DetailedBox[]>) => {
            state.readyStatus = "success"
            boxAdapter.setAll(state, payload)
        },
        getFailure: (state, { payload }: PayloadAction<string>) => {
            state.readyStatus = "failure"
            state.error = payload
        },
    },
})

export default boxList.reducer
export const { getRequesting, getSuccess, getFailure } = boxList.actions

export const fetchBoxList = elementListFetch(
    detailedBoxListGet,
    getRequesting,
    getSuccess,
    getFailure,
    (error: Error) => toastError(`Erreur lors du chargement des jeux JAV: ${error.message}`)
)

const shouldFetchBoxList = (state: AppState) => state.boxList.readyStatus !== "success"

export const fetchBoxListIfNeed = (): AppThunk => (dispatch, getState) => {
    if (shouldFetchBoxList(getState())) return dispatch(fetchBoxList())

    return null
}

export const selectBoxListState = (state: AppState): EntitiesRequest<DetailedBox> => state.boxList

export const selectBoxList = createSelector(
    selectBoxListState,
    ({ ids, entities, readyStatus }) => {
        if (readyStatus !== "success") return []
        return ids.map((id) => entities[id])
    }
)

export const selectSortedUniqueDetailedBoxes = createSelector(selectBoxList, (boxes) => {
    const validBoxes = boxes.filter((box) => box) as DetailedBox[]
    return sortedUniqBy(sortBy(validBoxes, gameTitleOrder), gameTitleOrder)
})

export const selectContainerSortedDetailedBoxes = createSelector(selectBoxList, (boxes) =>
    sortBy(boxes, "container")
)
