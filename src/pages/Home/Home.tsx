import { FC, memo } from "react"
import { RouteComponentProps } from "react-router-dom"
import { useSelector } from "react-redux"
import { Helmet } from "react-helmet"

import { AppThunk } from "../../store"
import { fetchForAsks, LoginForm, Asks } from "../../components"
import styles from "./styles.module.scss"
import { fetchVolunteerAsksSetIfNeed } from "../../store/volunteerAsksSet"
import { selectUserJwtToken } from "../../store/auth"

export type Props = RouteComponentProps

const HomePage: FC<Props> = (): JSX.Element => {
    const jwtToken = useSelector(selectUserJwtToken)

    if (jwtToken === undefined) return <p>Loading...</p>

    if (jwtToken) {
        return <Asks />
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
                    <a href="/sinscrire"> S&apos;informer sur le bénévolat </a>
                </div>
            </div>
        </div>
    )
}

// Fetch server-side data here
export const loadData = (): AppThunk[] => [
    fetchVolunteerAsksSetIfNeed(),
    ...fetchForAsks.map((f) => f()),
]

export default memo(HomePage)
