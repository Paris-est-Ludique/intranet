import { History } from "history"
import { connectRouter } from "connected-react-router"

import wishAdd from "./wishAdd"
import wishList from "./wishList"
import javGameList from "./javGameList"
import volunteer from "./volunteer"
import volunteerAdd from "./volunteerAdd"
import volunteerList from "./volunteerList"
import volunteerSet from "./volunteerSet"
import volunteerLogin from "./volunteerLogin"
import volunteerForgot from "./volunteerForgot"
import preVolunteerAdd from "./preVolunteerAdd"
import preVolunteerCount from "./preVolunteerCount"

// Use inferred return type for making correctly Redux types
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (history: History) => ({
    wishAdd,
    wishList,
    javGameList,
    volunteer,
    volunteerAdd,
    volunteerList,
    volunteerSet,
    volunteerLogin,
    volunteerForgot,
    preVolunteerAdd,
    preVolunteerCount,
    router: connectRouter(history) as any,
    // Register more reducers...
})
