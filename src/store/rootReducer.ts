import { History } from "history"
import { connectRouter } from "connected-react-router"

import announcementList from "./announcementList"
import auth from "./auth"
import gameList from "./gameList"
import miscDiscordInvitation from "./miscDiscordInvitation"
import miscMeetingDateList from "./miscMeetingDateList"
import postulantAdd from "./postulantAdd"
import teamList from "./teamList"
import ui from "./ui"
import volunteerAdd from "./volunteerPartialAdd"
import volunteerDiscordId from "./volunteerDiscordId"
import volunteerList from "./volunteerList"
import volunteerSet from "./volunteerSet"
import volunteerLogin from "./volunteerLogin"
import volunteerForgot from "./volunteerForgot"
import volunteerAsksSet from "./volunteerAsksSet"
import volunteerParticipationDetailsSet from "./volunteerParticipationDetailsSet"
import volunteerDayWishesSet from "./volunteerDayWishesSet"
import volunteerTeamWishesSet from "./volunteerTeamWishesSet"
import volunteerTeamAssignSet from "./volunteerTeamAssignSet"
import wishAdd from "./wishAdd"
import wishList from "./wishList"

// Use inferred return type for making correctly Redux types
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (history: History) => ({
    announcementList,
    auth,
    gameList,
    miscDiscordInvitation,
    miscMeetingDateList,
    postulantAdd,
    teamList,
    ui,
    volunteerAdd,
    volunteerDiscordId,
    volunteerList,
    volunteerSet,
    volunteerLogin,
    volunteerForgot,
    volunteerAsksSet,
    volunteerParticipationDetailsSet,
    volunteerDayWishesSet,
    volunteerTeamWishesSet,
    volunteerTeamAssignSet,
    wishAdd,
    wishList,
    router: connectRouter(history) as any,
    // Register more reducers...
})
