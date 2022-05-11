import { FC, memo } from "react"
import { useSelector } from "react-redux"
import { RouteComponentProps } from "react-router-dom"
import { Helmet } from "react-helmet"

import { AppThunk } from "../../store"
import styles from "./styles.module.scss"
import { BoxList, KnowledgeIntro, fetchForKnowledge } from "../../components"
import { selectUserJwtToken } from "../../store/auth"

export type Props = RouteComponentProps

const KnowledgesPage: FC<Props> = (): JSX.Element => {
    const jwtToken = useSelector(selectUserJwtToken)
    if (jwtToken === undefined) return <p>Loading...</p>
    if (!jwtToken) {
        return <div>Besoin d'être identifié</div>
    }
    return (
        <div className={styles.knowledgesPage}>
            <div className={styles.knowledgesContent}>
                <Helmet title="KnowledgesPage" />
                <KnowledgeIntro />
                <BoxList />
            </div>
        </div>
    )
}

// Fetch server-side data here
export const loadData = (): AppThunk[] => [...fetchForKnowledge.map((f) => f())]

export default memo(KnowledgesPage)
