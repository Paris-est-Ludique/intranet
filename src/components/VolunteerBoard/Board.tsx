import { FC, memo } from "react"
import DayWishes from "./DayWishes/DayWishes"
import DayWishesFormModal from "./DayWishesForm/DayWishesFormModal"
import ParticipationDetails from "./ParticipationDetails/ParticipationDetails"
import ParticipationDetailsFormModal from "./ParticipationDetailsForm/ParticipationDetailsFormModal"
import TeamWishes from "./TeamWishes/TeamWishes"
import TeamWishesFormModal from "./TeamWishesForm/TeamWishesFormModal"
import withUserConnected from "../../utils/withUserConnected"
import { fetchVolunteerDayWishesSetIfNeed } from "../../store/volunteerDayWishesSet"
import { fetchVolunteerParticipationDetailsSetIfNeed } from "../../store/volunteerParticipationDetailsSet"
import { fetchTeamListIfNeed } from "../../store/teamList"
import { fetchVolunteerTeamWishesSetIfNeed } from "../../store/volunteerTeamWishesSet"
import ContentTitle from "../ui/Content/ContentTitle"
import VolunteerConfirmation from "../VolunteerConfirmation/VolunteerConfirmation"

const Board: FC = (): JSX.Element => (
    <>
        <VolunteerConfirmation />
        <ContentTitle title="Profil spécifique au festival" />
        <DayWishes />
        <DayWishesFormModal />
        <ParticipationDetails />
        <ParticipationDetailsFormModal />
        <TeamWishes />
        <TeamWishesFormModal />
    </>
)

export default memo(withUserConnected(Board))

export const fetchFor = [
    fetchVolunteerDayWishesSetIfNeed,
    fetchVolunteerParticipationDetailsSetIfNeed,
    fetchTeamListIfNeed,
    fetchVolunteerTeamWishesSetIfNeed,
]
