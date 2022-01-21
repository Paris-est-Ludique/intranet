import { FC, memo } from "react"
import { RouteComponentProps } from "react-router-dom"
import { Helmet } from "react-helmet"

import { AppThunk } from "../../store"
import { fetchTeamListIfNeed } from "../../store/teamList"
import styles from "./styles.module.scss"
import TeamList from "../../components/Teams/TeamList"
import TeamIntro from "../../components/Teams/TeamIntro"

export type Props = RouteComponentProps

const TeamsPage: FC<Props> = (): JSX.Element => (
    <div className={styles.teamsPage}>
        <div className={styles.teamsContent}>
            <Helmet title="TeamsPage" />
            <TeamIntro />
            <TeamList />
        </div>
    </div>
)

// Fetch server-side data here
export const loadData = (): AppThunk[] => [fetchTeamListIfNeed()]

export default memo(TeamsPage)
