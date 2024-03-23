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
    roles?: string[]
}

// Use inferred return type for making correctly Redux types
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const createStore = ({ initialState, url, jwt, id, roles }: Arg = {}) => {
    const history = SSR
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
        devTools: DEV,
    })

    if (jwt && id && roles) {
        store.dispatch(setCurrentUser({ jwt, id, roles }))
    } else {
        store.dispatch(logoutUser())
    }

    return { store, history }
}

const jwt = Cookies.get("jwt")
const id = +(Cookies.get("id") || 0)
const roles = Cookies.get("roles")?.split(",") || []
if (jwt && id && roles) {
    Cookies.set("jwt", jwt, { expires: 3650 })
    Cookies.set("id", `${id}`, { expires: 3650 })
    Cookies.set("roles", roles.join(","), { expires: 3650 })
}
const { store } = createStore({ jwt, id, roles })

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk = ThunkAction<void, AppState, unknown, Action<string>>

export type EntitiesRequest<T> = EntityState<T> & StateRequest

export type ValueRequest<T> = { value?: T } & StateRequest

export default createStore
