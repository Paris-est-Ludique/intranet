import type { FC } from 'react'
import { memo } from 'react'
import type { RouteComponentProps } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import styles from './styles.module.scss'

import type { AppThunk } from '@/store'
import { fetchTeamListIfNeed } from '@/store/teamList'
import TeamList from '@/components/Teams/TeamList'
import TeamIntro from '@/components/Teams/TeamIntro'

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

export const loadData = (): AppThunk[] => [fetchTeamListIfNeed()]

export default memo(TeamsPage)
