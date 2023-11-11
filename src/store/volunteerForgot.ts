import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { StateRequest } from '@/utils/elements'
import { elementFetch } from '@/utils/elements'

import type { VolunteerForgot } from '@/services/volunteers'
import { volunteerForgot } from '@/services/volunteersAccessors'

type StateVolunteer = { entity?: VolunteerForgot } & StateRequest

const initialState: StateVolunteer = {
  readyStatus: 'idle',
}

const volunteerForgotSlice = createSlice({
  name: 'volunteerForgot',
  initialState,
  reducers: {
    getRequesting: (_state: unknown) => ({
      readyStatus: 'request',
    }),
    getSuccess: (_state: unknown, { payload }: PayloadAction<VolunteerForgot>) => ({
      readyStatus: 'success',
      entity: payload,
    }),
    getFailure: (_state: unknown, { payload }: PayloadAction<string>) => ({
      readyStatus: 'failure',
      error: payload,
    }),
  },
})

export const { reducer: volunteerForgotReducer, actions: volunteerForgotActions } = volunteerForgotSlice

export const fetchVolunteerForgot = elementFetch(volunteerForgot, volunteerForgotActions)
