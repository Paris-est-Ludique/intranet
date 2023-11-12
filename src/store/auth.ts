import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'
import type { AppState } from '.'

interface AuthState {
  jwt: string
  id: number
  roles: string[]
}

const initialState = {
  jwt: '',
  id: 0,
  roles: [],
} as AuthState

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authSetCurrentUser: (state: AuthState, action: PayloadAction<AuthState>) => {
      state.jwt = action.payload.jwt
      state.id = action.payload.id
      state.roles = action.payload.roles
    },
    authLogoutUser: (state: AuthState) => {
      // Unused, just reload page :/

      state.jwt = ''
      state.id = 0
      state.roles = []
    },
  },
})

export const authActions = authSlice.actions
export const authReducer = authSlice.reducer

export const { authSetCurrentUser, authLogoutUser } = authActions

const selectAuthData = (state: AppState): AuthState => state.auth

const selectRouter = (state: AppState): AppState['router'] => state.router

export const selectUserJwtToken = createSelector(selectAuthData, authData => authData.jwt)

export const routerSelector = createSelector(selectRouter, authData => authData)

export const selectUserRoles = createSelector(selectAuthData, authData => authData.roles)

export const selectUserId = createSelector(selectAuthData, authData => authData.id)

export const isUserConnected = createSelector(selectUserJwtToken, token => !!token)
