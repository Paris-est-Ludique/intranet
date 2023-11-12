import { createBrowserHistory, createMemoryHistory } from 'history'
import { configureStore } from '@reduxjs/toolkit'
import type { Action, EntityState } from '@reduxjs/toolkit'
import type { ThunkAction } from 'redux-thunk'
import { combineReducers } from 'redux'
import { createReduxHistoryContext } from 'redux-first-history'

import type { StateRequest } from '@/utils/elements'
import { IS_DEV, IS_SSR } from '@/utils/constants'

import { announcementListReducer } from '@/store/announcementList'
import { authReducer } from '@/store/auth'
import { boxListReducer } from '@/store/boxList'
import { gameListReducer } from '@/store/gameList'
import { gameWithVolunteersListReducer } from '@/store/gameWithVolunteersList'
import { gameDetailsUpdateReducer } from '@/store/gameDetailsUpdate'
import { miscDiscordInvitationReducer } from '@/store/miscDiscordInvitation'
import { miscFestivalDateListReducer } from '@/store/miscFestivalDateList'
import { miscMeetingDateListReducer } from '@/store/miscMeetingDateList'
import { postulantAddReducer } from '@/store/postulantAdd'
import { retexSetReducer } from '@/store/retexSet'
import { teamListReducer } from '@/store/teamList'
import { uiReducer } from '@/store/ui'
import { volunteerPartialAddReducer } from '@/store/volunteerPartialAdd'
import { volunteerAsksSetReducer } from '@/store/volunteerAsksSet'
import { volunteerDayWishesSetReducer } from '@/store/volunteerDayWishesSet'
import { volunteerDiscordIdReducer } from '@/store/volunteerDiscordId'
import { volunteerForgotReducer } from '@/store/volunteerForgot'
import { volunteerHostingSetReducer } from '@/store/volunteerHostingSet'
import { volunteerMealsSetReducer } from '@/store/volunteerMealsSet'
import { volunteerListReducer } from '@/store/volunteerList'
import { volunteerLoanSetReducer } from '@/store/volunteerLoanSet'
import { volunteerLoginReducer } from '@/store/volunteerLogin'
import { volunteerKnowledgeSetReducer } from '@/store/volunteerKnowledgeSet'
import { volunteerOnSiteInfoReducer } from '@/store/volunteerOnSiteInfo'
import { volunteerDetailedKnowledgeListReducer } from '@/store/volunteerDetailedKnowledgeList'
import { volunteerParticipationDetailsSetReducer } from '@/store/volunteerParticipationDetailsSet'
import { volunteerPersonalInfoSetReducer } from '@/store/volunteerPersonalInfoSet'
import { volunteerSetReducer } from '@/store/volunteerSet'
import { volunteerTeamAssignSetReducer } from '@/store/volunteerTeamAssignSet'
import { volunteerTeamWishesSetReducer } from '@/store/volunteerTeamWishesSet'
import { wishAddReducer } from '@/store/wishAdd'
import { wishListReducer } from '@/store/wishList'

function createHistory(pathname?: string) {
  return createReduxHistoryContext({
    history:
      IS_SSR
        ? createMemoryHistory({ initialEntries: pathname ? [pathname] : [] })
        : createBrowserHistory(),
  })
}

interface ConfigureStore {
  pathname?: string
}

export function setupStore({ pathname }: ConfigureStore = {}) {
  const { createReduxHistory, routerMiddleware, routerReducer } = createHistory(
    pathname,
  )

  const store = configureStore({
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

  const history = createReduxHistory(store)

  return {
    store,
    history,
  }
}

const { store } = setupStore()

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk = ThunkAction<void, AppState, unknown, Action<string>>
export type EntitiesRequest<T> = EntityState<T> & StateRequest
export type ValueRequest<T> = { value?: T } & StateRequest
