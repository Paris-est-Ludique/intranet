import { FC, memo } from "react"
import { useSelector } from "react-redux"
import { RouteComponentProps } from "react-router-dom"

import { AppThunk } from "../../store"
import { KnowledgeCard, fetchForKnowledgeCard } from "../../components"
import { selectUserJwtToken } from "../../store/auth"

export type Props = RouteComponentProps

const KnowledgeCardsPage: FC<Props> = (): JSX.Element => {
    const jwtToken = useSelector(selectUserJwtToken)
    if (jwtToken === undefined) return <p>Loading...</p>
    if (!jwtToken) {
        return <div>Besoin d'être identifié</div>
    }
    return <KnowledgeCard />
}

// Fetch server-side data here
export const loadData = (): AppThunk[] => [...fetchForKnowledgeCard.map((f) => f())]

export default memo(KnowledgeCardsPage)
