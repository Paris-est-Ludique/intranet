import { FC, memo } from "react"
import { RouteComponentProps, Link } from "react-router-dom"
import { useDispatch, useSelector, shallowEqual } from "react-redux"
import { Helmet } from "react-helmet"

import { AppState, AppThunk } from "../../store"
import { LoginForm, Notifications } from "../../components"
import styles from "./styles.module.scss"
import { fetchVolunteerNotifsSetIfNeed } from "../../store/volunteerNotifsSet"

export type Props = RouteComponentProps

const HomePage: FC<Props> = (): JSX.Element => {
    const dispatch = useDispatch()
    const readyStatus = useSelector((state: AppState) => state.volunteerNotifsSet.readyStatus)
    const volunteerNotifs = useSelector(
        (state: AppState) => state.volunteerNotifsSet.entity,
        shallowEqual
    )

    const loginError = useSelector((state: AppState) => state.volunteerLogin.error, shallowEqual)
    const jwt = useSelector((state: AppState) => state.auth.jwt, shallowEqual)

    if (!readyStatus || readyStatus === "idle" || readyStatus === "request")
        return <p>Loading...</p>

    if (jwt) {
        return <Notifications dispatch={dispatch} jwt={jwt} volunteerNotifs={volunteerNotifs} />
    }
    return (
        <div>
            <div className={styles.homePage}>
                <div className={styles.loginContent}>
                    <Helmet title="LoginPage" />
                    <LoginForm dispatch={dispatch} error={loginError || ""} />
                </div>
            </div>
            <div className={styles.homePage}>
                <div className={styles.preRegisterContent}>
                    <Link to="/preRegister"> S&apos;informer sur le bénévolat </Link>
                </div>
            </div>
        </div>
    )
}

// Fetch server-side data here
export const loadData = (): AppThunk[] => [fetchVolunteerNotifsSetIfNeed()]

export default memo(HomePage)
