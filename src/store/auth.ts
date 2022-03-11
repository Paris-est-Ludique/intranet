import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppState } from "."

// Define a type for the slice state
interface AuthState {
    id: number
    roles: string[]
    jwt: string
}

// Define the initial state using that type
const initialState: AuthState = {
    id: 0,
    roles: [],
    jwt: "",
}

export const auth = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCurrentUser: (state, action: PayloadAction<AuthState>) => {
            state.id = action.payload.id
            state.roles = action.payload.roles
            state.jwt = action.payload.jwt
        },
        logoutUser: (state) => {
            // Unused, just reload page :/
            state.id = 0
            state.roles = []
            state.jwt = ""
        },
    },
})

export const { setCurrentUser, logoutUser } = auth.actions

export const selectAuthData = (state: AppState): AuthState => state.auth

export const selectUserJwtToken = createSelector(selectAuthData, (authData) => authData.jwt)

export const selectUserRoles = createSelector(selectAuthData, (authData) => authData.roles)

export const isUserConnected = createSelector(selectUserJwtToken, (token) => !!token)

export default auth.reducer
