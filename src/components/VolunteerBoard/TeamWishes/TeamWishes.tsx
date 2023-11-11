import type { FC } from 'react'
import { memo, useCallback } from 'react'
import get from 'lodash/get'
import { useSelector } from 'react-redux'
import { useUserTeamWishes } from '../teamWishes.utils'
import styles from './styles.module.scss'
import { MODAL_IDS, displayModal } from '@/store/ui'
import useAction from '@/utils/useAction'
import { selectTeamList } from '@/store/teamList'

interface Props {
  afterSubmit?: () => void | undefined
}

const TeamWishes: FC<Props> = (): JSX.Element | null => {
  const teams = useSelector(selectTeamList)
  const [teamWishesData] = useUserTeamWishes()
  const teamWishesString = get(teamWishesData, 'teamWishes', [])
    .map((id: number): string =>
      get(
        teams.find((team) => team && team.id === id),
        'name',
        '',
      ),
    )
    .filter((name: string) => name)
    .join(', ')
  const comment = get(teamWishesData, 'teamWishesComment', '')
  const execDisplayModal = useAction(displayModal)
  const onEdit = useCallback(() => execDisplayModal(MODAL_IDS.TEAMWISHES), [execDisplayModal])

  return (
    <div className={styles.root}>
      <div className={styles.title}>Mon choix d'équipe</div>
      {teamWishesString && (
        <div className={styles.line}>
          Mes équipes préférées :
          {' '}
          <b>{teamWishesString}</b>
        </div>
      )}
      {!teamWishesString && <span className={styles.lineEmpty}>Non renseignés</span>}
      {comment && (
        <div className={styles.commentLine}>
          <span className={styles.commentLineTitle}>Mon commentaire :</span>
          <span className={styles.commentLineText}>{comment}</span>
        </div>
      )}
      <div className={styles.editButton}>
        <button type="button" onClick={onEdit}>
          Modifier
        </button>
      </div>
    </div>
  )
}

export default memo(TeamWishes)
