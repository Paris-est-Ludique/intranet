import { FC, memo } from "react"
import { RouteComponentProps } from "react-router-dom"
import { useSelector } from "react-redux"

import { AppThunk } from "../../store"
import { selectUserJwtToken } from "../../store/auth"
import Page from "../../components/ui/Page/Page"
import { LoginForm } from "../../components"
import { fetchVolunteerListIfNeed } from "../../store/volunteerList"

export type Props = RouteComponentProps

const BoardPage: FC<Props> = (): JSX.Element => {
    const jwtToken = useSelector(selectUserJwtToken)

    if (jwtToken === undefined) return <p>Loading...</p>
    if (jwtToken) {
        return (
            <Page>
                <div>Liste des bénévoles</div>
            </Page>
        )
    }
    return <LoginForm loginNeeded />
}

// Fetch server-side data here
export const loadData = (): AppThunk[] => [fetchVolunteerListIfNeed()]

export default memo(BoardPage)
