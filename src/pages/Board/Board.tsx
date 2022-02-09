import { FC, memo } from "react"
import { RouteComponentProps } from "react-router-dom"
import { useSelector } from "react-redux"

import { AppThunk } from "../../store"
import { selectUserJwtToken } from "../../store/auth"
import Page from "../../components/Page/Page"
import Board from "../../components/VolunteerBoard/Board"
import { fetchVolunteerDayWishesSetIfNeed } from "../../store/volunteerDayWishesSet"
import { fetchVolunteerParticipationDetailsSetIfNeed } from "../../store/volunteerParticipationDetailsSet"
import { fetchVolunteerTeamWishesSetIfNeed } from "../../store/volunteerTeamWishesSet"
import { fetchTeamListIfNeed } from "../../store/teamList"

export type Props = RouteComponentProps

const BoardPage: FC<Props> = (): JSX.Element => {
    const jwtToken = useSelector(selectUserJwtToken)

    if (jwtToken === undefined) return <p>Loading...</p>
    if (jwtToken) {
        return (
            <Page>
                <Board />
            </Page>
        )
    }
    return <div>Besoin d&apos;être identifié</div>
}

// Fetch server-side data here
export const loadData = (): AppThunk[] => [
    fetchVolunteerDayWishesSetIfNeed(),
    fetchVolunteerParticipationDetailsSetIfNeed(),
    fetchVolunteerTeamWishesSetIfNeed(),
    fetchTeamListIfNeed(),
]

export default memo(BoardPage)
