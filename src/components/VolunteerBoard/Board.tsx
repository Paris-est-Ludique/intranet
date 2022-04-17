import { FC, memo } from "react"
import DayWishes from "./DayWishes/DayWishes"
import DayWishesFormModal from "./DayWishesForm/DayWishesFormModal"
import ParticipationDetails from "./ParticipationDetails/ParticipationDetails"
import ParticipationDetailsFormModal from "./ParticipationDetailsForm/ParticipationDetailsFormModal"
import TeamWishes from "./TeamWishes/TeamWishes"
import TeamWishesFormModal from "./TeamWishesForm/TeamWishesFormModal"
import withUserConnected from "../../utils/withUserConnected"
import ContentTitle from "../ui/Content/ContentTitle"
import { fetchFor as fetchForDayWishesForm } from "./DayWishesForm/DayWishesForm"
import { fetchFor as fetchForParticipationDetailsForm } from "./ParticipationDetailsForm/ParticipationDetailsForm"
import { fetchFor as fetchForTeamWishesForm } from "./TeamWishesForm/TeamWishesForm"
import VolunteerTeam from "./VolunteerTeam/VolunteerTeam"

const Board: FC = (): JSX.Element => (
    <>
        <ContentTitle title="Profil spécifique au festival" />
        <DayWishes />
        <DayWishesFormModal />
        <ParticipationDetails />
        <ParticipationDetailsFormModal />
        <TeamWishes />
        <TeamWishesFormModal />
        <VolunteerTeam />
    </>
)

export default memo(withUserConnected(Board))

export const fetchFor = [
    ...fetchForDayWishesForm,
    ...fetchForParticipationDetailsForm,
    ...fetchForTeamWishesForm,
]
