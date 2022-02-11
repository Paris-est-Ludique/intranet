import { FC, memo } from "react"
import { RouteComponentProps } from "react-router-dom"
import { useSelector } from "react-redux"

import { AppThunk } from "../../store"
import { selectUserJwtToken } from "../../store/auth"
import Page from "../../components/Page/Page"
import Board from "../../components/VolunteerBoard/Board"
import { fetchVolunteerDayWishesSetIfNeed } from "../../store/volunteerDayWishesSet"
import { fetchVolunteerParticipationDetailsSetIfNeed } from "../../store/volunteerParticipationDetailsSet"
import { fetchForTeamWishesForm } from "../../components"

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
    ...fetchForTeamWishesForm.map((f) => f()),
]

export default memo(BoardPage)
