import type React from 'react'
import { memo } from 'react'
import styles from './styles.module.scss'
import type { Team } from '@/services/teams'

interface Props {
  team: Team
}

const TeamItem: React.FC<Props> = ({ team }): JSX.Element => {
  const { name, description } = team
  return (
    <li className={styles.teamItem}>
      <div className={styles.teamName}>{name}</div>
      <div>{description}</div>
    </li>
  )
}

export default memo(TeamItem)
