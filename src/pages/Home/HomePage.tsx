import { FC, memo } from "react"
import { RouteComponentProps } from "react-router-dom"
import { Helmet } from "react-helmet"

import { AppThunk } from "../../store"
import styles from "./styles.module.scss"

export type Props = RouteComponentProps

const fetchUserData = () => () => Promise.resolve()

const HomePage: FC<Props> = (): JSX.Element => (
    <div className={styles.homePage}>
        <div className={styles.homeContent}>
            <Helmet title="Home" />
            <div>Tableau de bord</div>
        </div>
    </div>
)

// Fetch server-side data here
export const loadData = (): AppThunk[] => [
    fetchUserData(),
    // More pre-fetched actions...
]

export default memo(HomePage)
