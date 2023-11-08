import { useCallback } from 'react'
import classnames from 'classnames'
import FormButton from '../Form/FormButton/FormButton'
import styles from './styles.module.scss'
import { addAsk, useAskTools } from './utils'
import { fetchVolunteerAsksSet } from '@/store/volunteerAsksSet'

export function AskGazette(asks: JSX.Element[], id: number): void {
  const { dispatch, jwtToken, volunteerAsks } = useAskTools()

  const onSubmit = useCallback((): void => {
    dispatch(
      fetchVolunteerAsksSet(jwtToken, 0, {
        hiddenAsks: [...(volunteerAsks?.hiddenAsks || []), id],
      }),
    )
  }, [dispatch, id, jwtToken, volunteerAsks?.hiddenAsks])

  addAsk(
    asks,
    id,
    volunteerAsks,
    true,
    true,
    <form>
      <div className={classnames(styles.notifIntro, styles.notifCentered)} key="login-intro">
        La
        {' '}
        <a
          href="https://mailchi.mp/3c75c3b3a20f/gazette_2020_02-8978118"
          onClick={onSubmit}
        >
          gazette de février
        </a>
        {' '}
        est disponible !
        <br />
        <div className={styles.formButtons}>
          <FormButton onClick={onSubmit}>Ok, masquer</FormButton>
        </div>
      </div>
    </form>,
  )
}
