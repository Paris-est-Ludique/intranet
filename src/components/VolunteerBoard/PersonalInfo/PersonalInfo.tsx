import type { FC } from 'react'
import { memo, useCallback } from 'react'
import get from 'lodash/get'
import { useUserPersonalInfo } from '../personalInfo.utils'
import styles from './styles.module.scss'
import useAction from '@/utils/useAction'
import { MODAL_IDS, displayModal } from '@/store/ui'

const PersonalInfo: FC = (): JSX.Element | null => {
  const [userWishes] = useUserPersonalInfo()
  const firstname = get(userWishes, 'firstname', '')
  const lastname = get(userWishes, 'lastname', '')
  const photo = get(userWishes, 'photo', '')
  const execDisplayModal = useAction(displayModal)
  const onEdit = useCallback(() => execDisplayModal(MODAL_IDS.PERSONALINFO), [execDisplayModal])

  return (
    <div className={styles.personalInfo}>
      <div className={styles.title}>Mes infos personnelles</div>
      <div className={styles.personalInfoLabel}>
        {firstname || 'Aucun prénom'}
        {' '}
        {lastname || 'Aucun nom de famille'}
      </div>

      {/^[0-9]/.test(photo || '') && (
        <div className={styles.personalInfoLabel}>Ta photo est bien renseignée merci !</div>
      )}

      {!/^[0-9]/.test(photo || '') && <div className={styles.personalInfoLabel}>Il faudrait renseigner ta photo !</div>}

      <div className={styles.editButton}>
        <button
          type="button"
          onClick={onEdit}
        >
          Modifier
        </button>
      </div>
    </div>
  )
}

export default memo(PersonalInfo)
