import type { FC } from 'react'
import { memo } from 'react'
import styles from './styles.module.scss'
import { useSelector } from 'react-redux'
import type { RouteComponentProps } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import type { AppThunk } from '@/store'
import LoginForm from '@/components/LoginForm/LoginForm'
import KnowledgeBoxList, { fetchForKnowledgeBoxList } from '@/components/Knowledge/KnowledgeBoxList'
import KnowledgeIntro from '@/components/Knowledge/KnowledgeIntro'


import { selectUserJwtToken } from '@/store/auth'
export type Props = RouteComponentProps

const KnowledgesPage: FC<Props> = (): JSX.Element => {
  const jwtToken = useSelector(selectUserJwtToken)
  if (jwtToken === undefined)
    return <p>Loading...</p>
  if (!jwtToken) {
    return <LoginForm loginNeeded />
  }
  return (
    <div className={styles.knowledgesPage}>
      <div className={styles.knowledgesContent}>
        <Helmet title="KnowledgesPage" />
        <KnowledgeIntro />
        <KnowledgeBoxList />
      </div>
    </div>
  )
}

export const loadData = (): AppThunk[] => [...fetchForKnowledgeBoxList.map((f) => f())]

export default memo(KnowledgesPage)
