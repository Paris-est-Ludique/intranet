import { History } from "history"
import { connectRouter } from "connected-react-router"

import announcementList from "./announcementList"
import auth from "./auth"
import boxList from "./boxList"
import gameList from "./gameList"
import gameWithVolunteersList from "./gameWithVolunteersList"
import gameDetailsUpdate from "./gameDetailsUpdate"
import miscDiscordInvitation from "./miscDiscordInvitation"
import miscFestivalDateList from "./miscFestivalDateList"
import miscMeetingDateList from "./miscMeetingDateList"
import postulantAdd from "./postulantAdd"
import retexSet from "./retexSet"
import teamList from "./teamList"
import ui from "./ui"
import volunteerPartialAdd from "./volunteerPartialAdd"
import volunteerAsksSet from "./volunteerAsksSet"
import volunteerDayWishesSet from "./volunteerDayWishesSet"
import volunteerDiscordId from "./volunteerDiscordId"
import volunteerForgot from "./volunteerForgot"
import volunteerHostingSet from "./volunteerHostingSet"
import volunteerMealsSet from "./volunteerMealsSet"
import volunteerList from "./volunteerList"
import volunteerLoanSet from "./volunteerLoanSet"
import volunteerLogin from "./volunteerLogin"
import volunteerKnowledgeSet from "./volunteerKnowledgeSet"
import volunteerDetailedKnowledgeList from "./volunteerDetailedKnowledgeList"
import volunteerParticipationDetailsSet from "./volunteerParticipationDetailsSet"
import volunteerPersonalInfoSet from "./volunteerPersonalInfoSet"
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
    gameWithVolunteersList,
    gameDetailsUpdate,
    miscDiscordInvitation,
    miscFestivalDateList,
    miscMeetingDateList,
    postulantAdd,
    retexSet,
    teamList,
    ui,
    volunteerPartialAdd,
    volunteerAsksSet,
    volunteerDayWishesSet,
    volunteerDiscordId,
    volunteerForgot,
    volunteerHostingSet,
    volunteerMealsSet,
    volunteerList,
    volunteerLoanSet,
    volunteerLogin,
    volunteerKnowledgeSet,
    volunteerDetailedKnowledgeList,
    volunteerParticipationDetailsSet,
    volunteerPersonalInfoSet,
    volunteerSet,
    volunteerTeamAssignSet,
    volunteerTeamWishesSet,
    wishAdd,
    wishList,
    router: connectRouter(history) as any,
    // Register more reducers...
})
