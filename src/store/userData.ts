import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { toast } from "react-toastify"

import { StateRequest } from "./utils"
import { User, getUserData } from "../services/jsonPlaceholder"
import { AppThunk, AppState } from "."

type StateUser = { entity?: User } & StateRequest

export const initialState: StateUser = {
    readyStatus: "idle",
}

const userData = createSlice({
    name: "userData",
    initialState,
    reducers: {
        getRequesting: (_) => ({
            readyStatus: "request",
        }),
        getSuccess: (_, { payload }: PayloadAction<User>) => ({
            readyStatus: "success",
            entity: payload,
        }),
        getFailure: (_, { payload }: PayloadAction<string>) => ({
            readyStatus: "failure",
            error: payload,
        }),
    },
})

export default userData.reducer
export const { getRequesting, getSuccess, getFailure } = userData.actions

export const fetchUserData =
    (id: number): AppThunk =>
    async (dispatch) => {
        dispatch(getRequesting())

        const { error, data } = await getUserData(id)

        if (error) {
            dispatch(getFailure(error.message))
            toast.error(`Erreur lors du chargement de l'utilisateur ${id}: ${error.message}`, {
                position: "top-center",
                autoClose: 6000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        } else {
            dispatch(getSuccess(data as User))
        }
    }

const shouldFetchUserData = (state: AppState, id: number) =>
    state.userData.readyStatus !== "success" ||
    (state.userData.entity && state.userData.entity.membreId !== id)

export const fetchUserDataIfNeed =
    (id: number): AppThunk =>
    (dispatch, getState) => {
        if (shouldFetchUserData(getState(), id)) return dispatch(fetchUserData(id))

        return null
    }
