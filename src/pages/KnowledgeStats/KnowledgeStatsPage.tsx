import { FC, memo } from "react"
import { useSelector } from "react-redux"
import { RouteComponentProps } from "react-router-dom"
import { Helmet } from "react-helmet"

import { AppThunk } from "../../store"
import styles from "../Knowledge/styles.module.scss"
import { KnowledgeStats, fetchForKnowledgeCard, LoginForm } from "../../components"
import { selectUserJwtToken } from "../../store/auth"

export type Props = RouteComponentProps

const KnowledgeStatsPage: FC<Props> = (): JSX.Element => {
    const jwtToken = useSelector(selectUserJwtToken)
    if (jwtToken === undefined) return <p>Loading...</p>
    if (!jwtToken) {
        return <LoginForm loginNeeded />
    }
    return (
        <div className={styles.knowledgesPage}>
            <div className={styles.knowledgesContent}>
                <Helmet title="Stats des jeux connus" />
                <KnowledgeStats />
            </div>
        </div>
    )
}

// Fetch server-side data here
export const loadData = (): AppThunk[] => [...fetchForKnowledgeCard.map((f) => f())]

export default memo(KnowledgeStatsPage)
