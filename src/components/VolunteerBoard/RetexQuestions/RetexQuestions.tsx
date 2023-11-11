import type { FC } from 'react'
import { memo, useCallback } from 'react'
import get from 'lodash/get'

import { useRetex } from '../retex.utils'
import styles from './styles.module.scss'
import { MODAL_IDS, displayModal } from '@/store/ui'
import useAction from '@/utils/useAction'

interface Props {
  afterSubmit?: () => void | undefined
}

const RetexQuestions: FC<Props> = (): JSX.Element | null => {
  const [retex] = useRetex()
  const dayWishes = get(retex, 'dayWishes', '')
  const question2 = get(retex, 'question2', '')
  const question3 = get(retex, 'question3', '')
  const question4 = get(retex, 'question4', '')
  const question5 = get(retex, 'question5', '')
  const question6 = get(retex, 'question6', '')
  const question7 = get(retex, 'question7', '')
  const question8 = get(retex, 'question8', '')
  const execDisplayModal = useAction(displayModal)
  const onEdit = useCallback(() => execDisplayModal(MODAL_IDS.RETEX), [execDisplayModal])
  const weekDays = `,${dayWishes}`.replace(/,S|,D/g, '').replace(/^,/, '')
  const answeredQuestionCount
    = (question2 ? 1 : 0)
    + (question3 ? 1 : 0)
    + (question4 ? 1 : 0)
    + (question5 ? 1 : 0)
    + (question6 ? 1 : 0)
    + (question7 ? 1 : 0)
    + (question8 ? 1 : 0)
  const expectedAnswerCount = weekDays ? 7 : 6

  return (
    <div className={styles.root}>
      <div className={styles.title}>Retour sur PeL 2022</div>
      <div className={styles.line}>
        <span className={answeredQuestionCount < expectedAnswerCount ? styles.lineEmpty : ''}>
          {answeredQuestionCount}
          {' '}
          réponses
          {' '}
        </span>
        sur
        {' '}
        {expectedAnswerCount}
        {answeredQuestionCount >= expectedAnswerCount && <> !</>}
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

export default memo(RetexQuestions)
