import type { FC } from 'react'
import { memo, useCallback } from 'react'
import get from 'lodash/get'
import { useUserHosting } from '../hosting.utils'
import styles from './styles.module.scss'
import useAction from '@/utils/useAction'
import { MODAL_IDS, displayModal } from '@/store/ui'

const Hosting: FC = (): JSX.Element | null => {
  const [userWishes] = useUserHosting()
  const hostingType = get(userWishes, 'hostingType', '')
  const canHostCount = get(userWishes, 'canHostCount', 0)
  const execDisplayModal = useAction(displayModal)
  const onEdit = useCallback(() => execDisplayModal(MODAL_IDS.HOSTING), [execDisplayModal])

  return (
    <div className={styles.hosting}>
      <div className={styles.title}>Mon hébergement</div>
      {(hostingType === '' || hostingType === 'neither') && (
        <div className={styles.hostingLabel}>Je ne peux héberger personnes que ça arrangerait.</div>
      )}
      {hostingType === 'cherche' && (
        <div className={styles.hostingLabel}>
          J'ai précisé mon
          {' '}
          <b>besoin</b>
          {' '}
          d'un hébergement par un bénévole proche du festival
        </div>
      )}
      {hostingType === 'propose' && (
        <div className={styles.hostingLabel}>
          Je peux héberger
          {' '}
          <b>
            {canHostCount}
            {' '}
            bénévole(s)
          </b>
          {' '}
          !
        </div>
      )}

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

export default memo(Hosting)
