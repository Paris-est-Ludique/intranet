import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { StateRequest } from './utils'
import { elementFetch } from './utils'

import type { VolunteerLogin } from '@/services/volunteers'
import { setJWT } from '@/services/auth'
import { volunteerLogin } from '@/services/volunteersAccessors'

type StateVolunteer = { entity?: VolunteerLogin } & StateRequest

const initialState: StateVolunteer = {
  readyStatus: 'idle',
}

const volunteerLoginSlice = createSlice({
  name: 'volunteerLogin',
  initialState,
  reducers: {
    getRequesting: () => ({
      readyStatus: 'request',
    }),
    getSuccess: (_state, { payload }: PayloadAction<VolunteerLogin>) => ({
      readyStatus: 'success',
      entity: payload,
    }),
    getFailure: (_state, { payload }: PayloadAction<string>) => ({
      readyStatus: 'failure',
      error: payload,
    }),
  },
})

export const {
  reducer: volunteerLoginReducer,
  actions: volunteerLoginActions,
} = volunteerLoginSlice

export const fetchVolunteerLoginToRoot = elementFetch<
  VolunteerLogin,
  Parameters<typeof volunteerLogin>
>(volunteerLogin,
  volunteerLoginActions,
  undefined,
  (login: VolunteerLogin) => {
    setJWT(login.jwt, login.id, login.roles)

    if (location?.pathname) {
      location.pathname = '/'
    }
  },
)

export const fetchVolunteerLogin = elementFetch<VolunteerLogin, Parameters<typeof volunteerLogin>>(
  volunteerLogin,
  volunteerLoginActions,
  undefined,
  (login: VolunteerLogin) => {
    setJWT(login.jwt, login.id, login.roles)

    location?.reload()
  },
)
