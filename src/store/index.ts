import { createBrowserHistory, createMemoryHistory } from 'history'
import { configureStore } from '@reduxjs/toolkit'
import type { Action, EntityState } from '@reduxjs/toolkit'
import type { ThunkAction } from 'redux-thunk'

import { combineReducers } from 'redux'
import { createReduxHistoryContext } from 'redux-first-history'
import type { StateRequest } from './utils'

const {
  createReduxHistory,
  routerMiddleware,
  routerReducer,
} = createReduxHistoryContext({ history: IS_SSR ? createMemoryHistory() : createBrowserHistory() })

export const store = configureStore({
  // preloadedState: initialState,
  reducer: combineReducers({
    announcementList: announcementListReducer,
    auth: authReducer,
    boxList: boxListReducer,
    gameList: gameListReducer,
    gameWithVolunteersList: gameWithVolunteersListReducer,
    gameDetailsUpdate: gameDetailsUpdateReducer,
    miscDiscordInvitation: miscDiscordInvitationReducer,
    miscFestivalDateList: miscFestivalDateListReducer,
    miscMeetingDateList: miscMeetingDateListReducer,
    postulantAdd: postulantAddReducer,
    retexSet: retexSetReducer,
    teamList: teamListReducer,
    ui: uiReducer,
    volunteerPartialAdd: volunteerPartialAddReducer,
    volunteerAsksSet: volunteerAsksSetReducer,
    volunteerDayWishesSet: volunteerDayWishesSetReducer,
    volunteerDiscordId: volunteerDiscordIdReducer,
    volunteerForgot: volunteerForgotReducer,
    volunteerHostingSet: volunteerHostingSetReducer,
    volunteerMealsSet: volunteerMealsSetReducer,
    volunteerList: volunteerListReducer,
    volunteerLoanSet: volunteerLoanSetReducer,
    volunteerLogin: volunteerLoginReducer,
    volunteerKnowledgeSet: volunteerKnowledgeSetReducer,
    volunteerOnSiteInfo: volunteerOnSiteInfoReducer,
    volunteerDetailedKnowledgeList: volunteerDetailedKnowledgeListReducer,
    volunteerParticipationDetailsSet: volunteerParticipationDetailsSetReducer,
    volunteerPersonalInfoSet: volunteerPersonalInfoSetReducer,
    volunteerSet: volunteerSetReducer,
    volunteerTeamAssignSet: volunteerTeamAssignSetReducer,
    volunteerTeamWishesSet: volunteerTeamWishesSetReducer,
    wishAdd: wishAddReducer,
    wishList: wishListReducer,
    router: routerReducer,
  }),
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(routerMiddleware),
  devTools: IS_DEV,
})

export const history = createReduxHistory(store)

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk = ThunkAction<void, AppState, unknown, Action<string>>

export type EntitiesRequest<T> = EntityState<T> & StateRequest

export type ValueRequest<T> = { value?: T } & StateRequest
