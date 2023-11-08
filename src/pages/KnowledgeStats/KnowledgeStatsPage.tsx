import type { FC } from 'react'
import { memo } from 'react'
import styles from '../Knowledge/styles.module.scss'
import { useSelector } from 'react-redux'
import type { RouteComponentProps } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import type { AppThunk } from '@/store'
// import { KnowledgeStats, LoginForm, fetchForKnowledgeCard } from 
import KnowledgeStats, { fetchForKnowledgeStats } from '@/components/Knowledge/KnowledgeStats'
import LoginForm from '@/components/LoginForm/LoginForm'
import { selectUserJwtToken } from '@/store/auth'

export type Props = RouteComponentProps

const KnowledgeStatsPage: FC<Props> = (): JSX.Element => {
  const jwtToken = useSelector(selectUserJwtToken)
  if (jwtToken === undefined)
    return <p>Loading...</p>
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

export const loadData = (): AppThunk[] => [...fetchForKnowledgeStats.map((f) => f())]

export default memo(KnowledgeStatsPage)
