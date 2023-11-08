import isEmpty from 'lodash/isEmpty'
import type { Dispatch } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import styles from './styles.module.scss'
import type { VolunteerAsks } from '@/services/volunteers'
import type { AppState } from '@/store'
import { selectUserJwtToken } from '@/store/auth'

let prevVolunteerAsks: VolunteerAsks | undefined

interface AskTools {
  dispatch: Dispatch<any>
  jwtToken: string
  volunteerAsks: VolunteerAsks | undefined
}

export function useAskTools(): AskTools {
  const dispatch = useDispatch()
  const jwtToken = useSelector(selectUserJwtToken)
  const volunteerAsks = useSelector((state: AppState) => {
    const vAsks = state.volunteerAsksSet?.entity
    if (vAsks) {
      prevVolunteerAsks = vAsks
      return vAsks
    }
    return prevVolunteerAsks
  }, shallowEqual)
  return { dispatch, jwtToken, volunteerAsks }
}

export function addAsk(
  asks: JSX.Element[],
  id: number,
  volunteerAsks: VolunteerAsks | undefined,
  isNarrow: boolean,
  needToShow: boolean,
  children: JSX.Element | undefined,
): void {
  const hidden = volunteerAsks?.hiddenAsks || []
  if (hidden.includes(id) || !isEmpty(asks) || !needToShow) {
    return
  }

  asks.push(
    <div key={id}>
      <div className={styles.notificationsPage}>
        <div
          className={
                        isNarrow ? styles.notificationsContentNarrow : styles.notificationsContent
                    }
        >
          {children}
        </div>
      </div>
    </div>,
  )
}

export const answerLaterOnProfile = (
  <>
    Tu pourras y répondre plus tard sur la page
    {' '}
    <a href="/profil">Mon profil</a>
    .
  </>
)

export function answerLaterOnProfileBefore(textDate: string): JSX.Element {
  return (
    <>
      Tu pourras y répondre plus tard sur la page
      {' '}
      <a href="/profil">Mon profil</a>
      .
      <br />
      Il nous fait une réponse avant le
      {' '}
      {textDate}
    </>
  )
}
