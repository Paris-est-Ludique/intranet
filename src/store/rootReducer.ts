import { History } from "history"
import { connectRouter } from "connected-react-router"

import envieAdd from "./envieAdd"
import envieList from "./envieList"
import jeuJavList from "./jeuJavList"
import membre from "./membre"
import membreAdd from "./membreAdd"
import membreList from "./membreList"
import membreSet from "./membreSet"

// Use inferred return type for making correctly Redux types
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (history: History) => ({
    envieAdd,
    envieList,
    jeuJavList,
    membre,
    membreAdd,
    membreList,
    membreSet,
    router: connectRouter(history) as any,
    // Register more reducers...
})
