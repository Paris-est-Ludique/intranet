import { History } from "history"
import { connectRouter } from "connected-react-router"

import membreList from "./membreList"
import membre from "./membre"
import jeuJavList from "./jeuJavList"
import envieList from "./envieList"

// Use inferred return type for making correctly Redux types
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (history: History) => ({
    membreList,
    membre,
    jeuJavList,
    envieList,
    router: connectRouter(history) as any,
    // Register more reducers...
})
