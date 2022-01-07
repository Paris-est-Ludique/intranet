import { createMemoryHistory, createBrowserHistory } from "history"
import { Action, configureStore, EntityState } from "@reduxjs/toolkit"
import { ThunkAction } from "redux-thunk"
import { routerMiddleware } from "connected-react-router"
import Cookies from "js-cookie"

import createRootReducer from "./rootReducer"
import { StateRequest } from "./utils"
import { setCurrentUser, logoutUser } from "./auth"

interface Arg {
    initialState?: typeof window.__INITIAL_STATE__
    url?: string
    jwt?: string
    id?: number
}

// Use inferred return type for making correctly Redux types
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const createStore = ({ initialState, url, jwt, id }: Arg = {}) => {
    const history = __SERVER__
        ? createMemoryHistory({ initialEntries: [url || "/"] })
        : createBrowserHistory()
    const store = configureStore({
        preloadedState: initialState,
        reducer: createRootReducer(history),
        middleware: (getDefaultMiddleware) => [
            // Included default middlewares: https://redux-toolkit.js.org/api/getDefaultMiddleware#included-default-middleware
            ...getDefaultMiddleware(),
            routerMiddleware(history),
        ],
        devTools: __DEV__,
    })

    if (jwt && id) {
        store.dispatch(setCurrentUser({ jwt, id }))
    } else {
        store.dispatch(logoutUser())
    }

    return { store, history }
}

const storage: any = localStorage
const id = +(Cookies.get("id") || storage?.getItem("id"))
const jwt = Cookies.get("jwt") || storage?.getItem("jwt")

const { store } = createStore({ id, jwt })

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk = ThunkAction<void, AppState, unknown, Action<string>>

export type EntitiesRequest<T> = EntityState<T> & StateRequest

export type ValueRequest<T> = { value?: T } & StateRequest

export default createStore
