import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppState } from "."

// Define a type for the slice state
interface AuthState {
    jwt: string
    id: number
    roles: string[]
}

// Define the initial state using that type
const initialState: AuthState = {
    jwt: "",
    id: 0,
    roles: [],
}

export const auth = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCurrentUser: (state, action: PayloadAction<AuthState>) => {
            state.jwt = action.payload.jwt
            state.id = action.payload.id
            state.roles = action.payload.roles
        },
        logoutUser: (state) => {
            // Unused, just reload page :/
            state.jwt = ""
            state.id = 0
            state.roles = []
        },
    },
})

export const { setCurrentUser, logoutUser } = auth.actions

const selectAuthData = (state: AppState): AuthState => state.auth

const selectRouter = (state: AppState): AppState["router"] => state.router

export const selectUserJwtToken = createSelector(selectAuthData, (authData) => authData.jwt)

export const routerSelector = createSelector(selectRouter, (authData) => authData)

export const selectUserRoles = createSelector(selectAuthData, (authData) => authData.roles)

export const selectUserId = createSelector(selectAuthData, (authData) => authData.id)

export const isUserConnected = createSelector(selectUserJwtToken, (token) => !!token)

export default auth.reducer
