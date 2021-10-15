import { History } from "history"
import { connectRouter } from "connected-react-router"

import userList from "./userList"
import userData from "./userData"
import javGameList from "./javGameList"

// Use inferred return type for making correctly Redux types
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (history: History) => ({
    userList,
    userData,
    javGameList,
    router: connectRouter(history) as any,
    // Register more reducers...
})
