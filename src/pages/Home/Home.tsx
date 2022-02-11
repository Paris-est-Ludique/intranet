import { FC, memo } from "react"
import { RouteComponentProps, Link } from "react-router-dom"
import { useSelector, shallowEqual } from "react-redux"
import { Helmet } from "react-helmet"

import { AppState, AppThunk } from "../../store"
import { LoginForm, Notifications, fetchForTeamWishesForm } from "../../components"
import styles from "./styles.module.scss"
import { fetchVolunteerNotifsSetIfNeed } from "../../store/volunteerNotifsSet"
import { VolunteerNotifs } from "../../services/volunteers"
import { selectUserJwtToken } from "../../store/auth"

export type Props = RouteComponentProps

let prevNotifs: VolunteerNotifs | undefined

const HomePage: FC<Props> = (): JSX.Element => {
    const jwtToken = useSelector(selectUserJwtToken)

    const volunteerNotifs = useSelector((state: AppState) => {
        const notifs = state.volunteerNotifsSet?.entity
        if (notifs) {
            prevNotifs = notifs
            return notifs
        }
        return prevNotifs
    }, shallowEqual)

    if (jwtToken === undefined) return <p>Loading...</p>

    if (jwtToken) {
        return <Notifications volunteerNotifs={volunteerNotifs} />
    }
    return (
        <div>
            <div className={styles.homePage}>
                <div className={styles.loginContent}>
                    <Helmet title="LoginPage" />
                    <LoginForm />
                </div>
            </div>
            <div className={styles.homePage}>
                <div className={styles.navigationLink}>
                    <Link to="/preRegister"> S&apos;informer sur le bénévolat </Link>
                </div>
            </div>
        </div>
    )
}

// Fetch server-side data here
export const loadData = (): AppThunk[] => [
    fetchVolunteerNotifsSetIfNeed(),
    ...fetchForTeamWishesForm.map((f) => f()),
]

export default memo(HomePage)
