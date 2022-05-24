import { History } from "history"
import { connectRouter } from "connected-react-router"

import announcementList from "./announcementList"
import auth from "./auth"
import boxList from "./boxList"
import gameList from "./gameList"
import gameDetailsUpdate from "./gameDetailsUpdate"
import miscDiscordInvitation from "./miscDiscordInvitation"
import miscMeetingDateList from "./miscMeetingDateList"
import postulantAdd from "./postulantAdd"
import teamList from "./teamList"
import ui from "./ui"
import volunteerPartialAdd from "./volunteerPartialAdd"
import volunteerAsksSet from "./volunteerAsksSet"
import volunteerDayWishesSet from "./volunteerDayWishesSet"
import volunteerDiscordId from "./volunteerDiscordId"
import volunteerForgot from "./volunteerForgot"
import volunteerList from "./volunteerList"
import volunteerLogin from "./volunteerLogin"
import volunteerKnowledgeSet from "./volunteerKnowledgeSet"
import volunteerParticipationDetailsSet from "./volunteerParticipationDetailsSet"
import volunteerSet from "./volunteerSet"
import volunteerTeamAssignSet from "./volunteerTeamAssignSet"
import volunteerTeamWishesSet from "./volunteerTeamWishesSet"
import wishAdd from "./wishAdd"
import wishList from "./wishList"

// Use inferred return type for making correctly Redux types
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (history: History) => ({
    announcementList,
    auth,
    boxList,
    gameList,
    gameDetailsUpdate,
    miscDiscordInvitation,
    miscMeetingDateList,
    postulantAdd,
    teamList,
    ui,
    volunteerPartialAdd,
    volunteerAsksSet,
    volunteerDayWishesSet,
    volunteerDiscordId,
    volunteerForgot,
    volunteerList,
    volunteerLogin,
    volunteerKnowledgeSet,
    volunteerParticipationDetailsSet,
    volunteerSet,
    volunteerTeamAssignSet,
    volunteerTeamWishesSet,
    wishAdd,
    wishList,
    router: connectRouter(history) as any,
    // Register more reducers...
})
