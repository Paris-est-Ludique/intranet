import { PayloadAction, createSlice, createEntityAdapter } from "@reduxjs/toolkit"
import { toast } from "react-toastify"

import { StateRequest } from "./utils"
import { User, getUserList } from "../services/jsonPlaceholder"
import { AppThunk, AppState } from "."

const userAdapter = createEntityAdapter<User>({
    selectId: (user) => user.membreId,
})

export const initialState = userAdapter.getInitialState({
    readyStatus: "idle",
} as StateRequest)

const userList = createSlice({
    name: "userList",
    initialState,
    reducers: {
        getRequesting: (state) => {
            state.readyStatus = "request"
        },
        getSuccess: (state, { payload }: PayloadAction<User[]>) => {
            state.readyStatus = "success"
            userAdapter.setAll(state, payload)
        },
        getFailure: (state, { payload }: PayloadAction<string>) => {
            state.readyStatus = "failure"
            state.error = payload
        },
    },
})

export default userList.reducer
export const { getRequesting, getSuccess, getFailure } = userList.actions

export const fetchUserList = (): AppThunk => async (dispatch) => {
    dispatch(getRequesting())

    const { error, data } = await getUserList()

    if (error) {
        dispatch(getFailure(error.message))
        toast.error(`Erreur lors du chargement des utilisateurs: ${error.message}`, {
            position: "top-center",
            autoClose: 6000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
    } else {
        dispatch(getSuccess(data as User[]))
    }
}

const shouldFetchUserList = (state: AppState) => state.userList.readyStatus !== "success"

export const fetchUserListIfNeed = (): AppThunk => (dispatch, getState) => {
    if (shouldFetchUserList(getState())) return dispatch(fetchUserList())

    return null
}
