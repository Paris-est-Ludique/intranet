import { FC, memo } from "react"
import ContentTitle from "../ui/Content/ContentTitle"
import withUserConnected from "../../utils/withUserConnected"
import { fetchTeamListIfNeed } from "../../store/teamList"
import { fetchVolunteerListIfNeed } from "../../store/volunteerList"
import TeamsWithCandidates from "./TeamsWithCandidates"
import withUserRole from "../../utils/withUserRole"
import ROLES from "../../utils/roles.constants"

const TeamAssignment: FC = (): JSX.Element => (
    <>
        <ContentTitle title="Gestion des équipes" />
        <TeamsWithCandidates />
    </>
)

export default withUserRole(ROLES.ASSIGNER, memo(withUserConnected(TeamAssignment)))

export const fetchFor = [fetchTeamListIfNeed, fetchVolunteerListIfNeed]
