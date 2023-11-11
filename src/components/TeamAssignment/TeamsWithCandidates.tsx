import type { FC } from 'react'
import { memo, useState } from 'react'
import { useSelector } from 'react-redux'
import TeamWithCandidates from './TeamWithCandidates'
import styles from './styles.module.scss'
import { selectTeamList } from '@/store/teamList'

const TeamsWithCandidates: FC = (): JSX.Element => {
  const teams = useSelector(selectTeamList)
  const [currentTeam, setCurrentTeam] = useState<number>(0)

  return (
    <div>
      <div>Cliquez sur l'équipe à gérer :</div>
      <ul className={styles.teamList}>
        {teams.map((team: any) => (
          <li
            key={team.id}
            className={styles.teamListItem}
          >
            <button
              type="button"
              onClick={() => setCurrentTeam(team.id)}
            >
              {team.name}
            </button>
          </li>
        ))}
      </ul>
      {!!currentTeam && <TeamWithCandidates teamId={currentTeam} />}
    </div>
  )
}

export default memo(TeamsWithCandidates)
