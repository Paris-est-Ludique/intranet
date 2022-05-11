import { FC, memo } from "react"
import { RouteComponentProps } from "react-router-dom"
import { Helmet } from "react-helmet"

import { AppThunk } from "../../store"
import styles from "./styles.module.scss"
import { BoxList, KnowledgeIntro, fetchForKnowledge } from "../../components"

export type Props = RouteComponentProps

const KnowledgesPage: FC<Props> = (): JSX.Element => (
    <div className={styles.knowledgesPage}>
        <div className={styles.knowledgesContent}>
            <Helmet title="KnowledgesPage" />
            <KnowledgeIntro />
            <BoxList />
        </div>
    </div>
)

// Fetch server-side data here
export const loadData = (): AppThunk[] => [...fetchForKnowledge.map((f) => f())]

export default memo(KnowledgesPage)
