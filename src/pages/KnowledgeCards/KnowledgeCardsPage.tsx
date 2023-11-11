import type { FC } from 'react'
import { memo } from 'react'
import { useSelector } from 'react-redux'
import type { RouteComponentProps } from 'react-router-dom'

import type { AppThunk } from '@/store'
import KnowledgeCard, { fetchForKnowledgeCard } from '@/components/Knowledge/KnowledgeCard'
import LoginForm from '@/components/LoginForm/LoginForm'
import { selectUserJwtToken } from '@/store/auth'

export type Props = RouteComponentProps

const KnowledgeCardsPage: FC<Props> = (): JSX.Element => {
  const jwtToken = useSelector(selectUserJwtToken)

  if (jwtToken === undefined) {
    return <p>Loading...</p>
  }
  if (!jwtToken) {
    return <LoginForm loginNeeded />
  }

  return <KnowledgeCard />
}

export function loadData(): AppThunk[] {
  return [...fetchForKnowledgeCard.map(f => f())]
}

export default memo(KnowledgeCardsPage)
