import { History } from "history"
import { connectRouter } from "connected-react-router"

import auth from "./auth"
import javGameList from "./javGameList"
import preVolunteerAdd from "./preVolunteerAdd"
import preVolunteerCount from "./preVolunteerCount"
import teamList from "./teamList"
import volunteer from "./volunteer"
import volunteerAdd from "./volunteerAdd"
import volunteerList from "./volunteerList"
import volunteerSet from "./volunteerSet"
import volunteerLogin from "./volunteerLogin"
import volunteerForgot from "./volunteerForgot"
import volunteerNotifsSet from "./volunteerNotifsSet"
import volunteerTeamWishesSet from "./volunteerTeamWishesSet"
import wishAdd from "./wishAdd"
import wishList from "./wishList"

// Use inferred return type for making correctly Redux types
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (history: History) => ({
    auth,
    javGameList,
    preVolunteerAdd,
    preVolunteerCount,
    teamList,
    volunteer,
    volunteerAdd,
    volunteerList,
    volunteerSet,
    volunteerLogin,
    volunteerForgot,
    volunteerNotifsSet,
    volunteerTeamWishesSet,
    wishAdd,
    wishList,
    router: connectRouter(history) as any,
    // Register more reducers...
})
