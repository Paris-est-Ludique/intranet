import { FC, memo } from "react"
import ContentTitle from "../ui/Content/ContentTitle"
import withUserConnected from "../../utils/withUserConnected"
import { fetchTeamListIfNeed } from "../../store/teamList"
import { fetchVolunteerListIfNeed } from "../../store/volunteerList"
import VolunteersWithTeamWishes from "./VolunteersWithTeamWishes"

const TeamAssignment: FC = (): JSX.Element => (
    <>
        <ContentTitle title="Affectation aux équipes" />
        <VolunteersWithTeamWishes />
    </>
)

export default memo(withUserConnected(TeamAssignment))

export const fetchFor = [fetchTeamListIfNeed, fetchVolunteerListIfNeed]
