import { History } from "history"
import { connectRouter } from "connected-react-router"

import userList from "./userList"
import userData from "./userData"
import jeuxJavList from "./jeuxJavList"

// Use inferred return type for making correctly Redux types
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (history: History) => ({
    userList,
    userData,
    jeuxJavList,
    router: connectRouter(history) as any,
    // Register more reducers...
})
