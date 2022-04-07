import { FC, memo } from "react"
import { RouteComponentProps } from "react-router-dom"
import { useSelector } from "react-redux"

import { AppThunk } from "../../store"
import { selectUserJwtToken } from "../../store/auth"
import Page from "../../components/ui/Page/Page"
import { TeamAssignment, fetchForTeamAssignment } from "../../components"

export type Props = RouteComponentProps

const TeamAssignmentPage: FC<Props> = (): JSX.Element => {
    const jwtToken = useSelector(selectUserJwtToken)

    if (jwtToken === undefined) return <p>Loading...</p>
    if (jwtToken) {
        return (
            <Page>
                <TeamAssignment />
            </Page>
        )
    }
    return <div>Besoin d'être identifié</div>
}

// Fetch server-side data here
export const loadData = (): AppThunk[] => [...fetchForTeamAssignment.map((f) => f())]

export default memo(TeamAssignmentPage)
