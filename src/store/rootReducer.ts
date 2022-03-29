import { History } from "history"
import { connectRouter } from "connected-react-router"

import auth from "./auth"
import gameList from "./gameList"
import announcementList from "./announcementList"
import preVolunteerAdd from "./preVolunteerAdd"
import preVolunteerCount from "./preVolunteerCount"
import teamList from "./teamList"
import ui from "./ui"
import volunteer from "./volunteer"
import volunteerAdd from "./volunteerAdd"
import volunteerList from "./volunteerList"
import volunteerSet from "./volunteerSet"
import volunteerLogin from "./volunteerLogin"
import volunteerForgot from "./volunteerForgot"
import volunteerAsksSet from "./volunteerAsksSet"
import volunteerParticipationDetailsSet from "./volunteerParticipationDetailsSet"
import volunteerDayWishesSet from "./volunteerDayWishesSet"
import volunteerTeamWishesSet from "./volunteerTeamWishesSet"
import wishAdd from "./wishAdd"
import wishList from "./wishList"

// Use inferred return type for making correctly Redux types
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (history: History) => ({
    auth,
    gameList,
    announcementList,
    preVolunteerAdd,
    preVolunteerCount,
    teamList,
    ui,
    volunteer,
    volunteerAdd,
    volunteerList,
    volunteerSet,
    volunteerLogin,
    volunteerForgot,
    volunteerAsksSet,
    volunteerParticipationDetailsSet,
    volunteerDayWishesSet,
    volunteerTeamWishesSet,
    wishAdd,
    wishList,
    router: connectRouter(history) as any,
    // Register more reducers...
})
