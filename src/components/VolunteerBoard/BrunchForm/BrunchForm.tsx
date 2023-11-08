import type { FC, ReactNode } from 'react'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import classnames from 'classnames'
import get from 'lodash/get'
import set from 'lodash/set'
import { useBrunch } from '../brunch.utils'
import FormButton from '../../Form/FormButton/FormButton'
import IgnoreButton from '../../Form/IgnoreButton/IgnoreButton'
import styles from './styles.module.scss'
import { fetchRetexSetIfNeed } from '@/store/retexSet'

interface Props {
  children?: ReactNode | undefined
  afterSubmit?: () => void | undefined
}

const BrunchForm: FC<Props> = ({ children, afterSubmit }): JSX.Element | null => {
  const [brunchPresence, setBrunchPresence] = useState<string>('inconnue')
  const question1Ref = useRef<HTMLInputElement | null>(null)
  const question1Default = '-1'

  const [retex, saveBrunch] = useBrunch()

  const onSubmit = useCallback(() => {
    if (!retex) {
      return
    }
    const question1 = +get(question1Ref, 'current.value', question1Default)
    saveBrunch(retex.id, question1)
    if (afterSubmit)
      afterSubmit()
  }, [afterSubmit, retex, saveBrunch])

  const onBrunchPresenceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const presence = e.target.value
    setBrunchPresence(presence)
    const guestCountDefault = { 'oui': 1, 'non': 0, 'peut-etre': -1 }[presence]
    set(question1Ref, 'current.value', `${guestCountDefault}`)
  }, [])

  useEffect(() => {
    const question1 = +get(retex, 'question1', question1Default)

    set(question1Ref, 'current.value', `${question1}`)
    
    if (question1 >= 1) {
      setBrunchPresence('oui')
    }
    else if (question1 === 0) {
      setBrunchPresence('non')
    }
    else {
      setBrunchPresence('peut-etre')
    }
  }, [setBrunchPresence, retex])

  return (
    <div>
      <div className={styles.title}>Inscription au brunch</div>
      <div className={styles.inputWrapper}>
        <div className={styles.leftCol}>
          <div className={styles.brunchTitle}>
            Viendras-tu au brunch samedi 1er octobre ? Le boulodrome (19 route des
            fortifications) nous sera réservé de 10h à 18h.
          </div>
        </div>
        <div className={styles.rightCol}>
          <label className={styles.brunchLabel}>
            <input
              type="radio"
              value="oui"
              name="brunchPresence"
              onChange={onBrunchPresenceChange}
              checked={brunchPresence === 'oui'}
            />
            {' '}
            Oui
          </label>
          <label className={styles.brunchLabel}>
            <input
              type="radio"
              value="non"
              name="brunchPresence"
              onChange={onBrunchPresenceChange}
              checked={brunchPresence === 'non'}
            />
            {' '}
            Non
          </label>
          <label className={styles.brunchLabel}>
            <input
              type="radio"
              value="peut-etre"
              name="brunchPresence"
              onChange={onBrunchPresenceChange}
              checked={brunchPresence === 'peut-etre'}
            />
            {' '}
            Je ne sais pas encore
          </label>
        </div>
      </div>

      <div
        className={classnames(
          styles.inputWrapper,
          brunchPresence === 'oui' ? null : styles.invisible,
        )}
      >
        <div className={styles.leftCol}>
          <div className={styles.guestCountTitle}>
            À combien viendras-tu ? Le brunch est pour les bénévoles ayant participé à
            la dernière édition (y compris ceux empêchés à la dernière minute), ainsi
            qu'aux éventuels +1 conjoints et enfants. Mais pas les amis, pour lesquels
            d'autres rdv seront proposés au cours de l'année.
          </div>
        </div>
        <div className={styles.rightCol}>
          <input className={styles.guestCountLabel} type="text" ref={question1Ref} />
        </div>
      </div>

      <div className={styles.buttonWrapper}>
        <FormButton onClick={onSubmit}>Enregistrer</FormButton>
        {children === undefined && (
          <>
            {' '}
            <FormButton onClick={afterSubmit} type="grey">
              Annuler
            </FormButton>
            {' '}
          </>
        )}
        {children !== undefined && (
          <>
            {' '}
            <IgnoreButton onClick={afterSubmit} text="Ignorer pour l'instant">
              {children}
            </IgnoreButton>
            {' '}
          </>
        )}
      </div>
    </div>
  )
}

BrunchForm.defaultProps = {
  children: undefined,
  afterSubmit: undefined,
}

export default memo(BrunchForm)

export const fetchForBrunchForm = [fetchRetexSetIfNeed]
