import { FC, memo } from "react"
import ContentTitle from "../ui/Content/ContentTitle"
import withUserConnected from "../../utils/withUserConnected"
import { fetchTeamListIfNeed } from "../../store/teamList"
import { fetchVolunteerListIfNeed } from "../../store/volunteerList"
import VolunteersWithTeamWishes from "./VolunteersWithTeamWishes"
import TeamsWithCandidates from "./TeamsWithCandidates"

const TeamAssignment: FC = (): JSX.Element => (
    <>
        <ContentTitle title="Choix par équipes" />
        <TeamsWithCandidates />
        <ContentTitle title="Choix des bénévoles" />
        <VolunteersWithTeamWishes />
    </>
)

export default memo(withUserConnected(TeamAssignment))

export const fetchFor = [fetchTeamListIfNeed, fetchVolunteerListIfNeed]
