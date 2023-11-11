import type { FC } from 'react'
import { memo, useCallback } from 'react'
import get from 'lodash/get'
import { useBrunch } from '../brunch.utils'
import styles from './styles.module.scss'
import { MODAL_IDS, displayModal } from '@/store/ui'
import useAction from '@/utils/useAction'

interface Props {
  afterSubmit?: () => void | undefined
}

const Brunch: FC<Props> = (): JSX.Element | null => {
  const [retex] = useBrunch()
  const question1 = get(retex, 'question1', -1)
  const execDisplayModal = useAction(displayModal)
  const onEdit = useCallback(() => execDisplayModal(MODAL_IDS.BRUNCH), [execDisplayModal])

  return (
    <div className={styles.root}>
      <div className={styles.title}>Inscription au brunch</div>
      <div className={styles.line}>
        {question1 === -1 && (
          <>
            Ma présence au brunch est
            {' '}
            <span className={styles.lineEmpty}>non renseignée</span>
          </>
        )}
        {question1 === 0 && <>Je ne viendrai pas au brunch </>}
        {question1 > 0 && (
          <>
            Je viendrai au brunch
            {question1 > 1 && (
              <>
                {' '}
                avec
                {+question1 - 1}
                {' '}
                personne(s)
              </>
            )}
          </>
        )}
      </div>
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

export default memo(Brunch)
