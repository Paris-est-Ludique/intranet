import type React from 'react'
import { memo } from 'react'
import { useSelector } from 'react-redux'
import styles from './styles.module.scss'
import TeamItem from './TeamItem'
import { selectSortedTeams } from '@/store/teamList'

const TeamList: React.FC = (): JSX.Element | null => {
  const teams = useSelector(selectSortedTeams)
  if (!teams || teams.length === 0)
    return null

  const shownTeams = teams.filter(team => team?.status !== 'inactive')

  return (
    <ul className={styles.teamList}>
      {shownTeams.map((team: any) => (
        <TeamItem team={team} key={team.id} />
      ))}
    </ul>
  )
}

export default memo(TeamList)
