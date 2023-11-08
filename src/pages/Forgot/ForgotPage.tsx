import type React from 'react'
import { memo } from 'react'
import styles from './styles.module.scss'
import type { RouteComponentProps } from 'react-router-dom'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'

import type { AppState } from '@/store'
import ForgotForm from '@/components/ForgotForm/ForgotForm'

export type Props = RouteComponentProps

const ForgotPage: React.FC<Props> = (): JSX.Element => {
  const dispatch = useDispatch()
  const forgotError = useSelector((state: AppState) => state.volunteerForgot.error, shallowEqual)
  const forgotMessage = useSelector(
    (state: AppState) => state.volunteerForgot.entity?.message,
    shallowEqual,
  )

  return (
    <div className={styles.forgotPage}>
      <div className={styles.forgotContent}>
        <Helmet title="ForgotPage" />
        <ForgotForm
          dispatch={dispatch}
          error={forgotError || ''}
          message={forgotMessage || ''}
        />
      </div>
    </div>
  )
}

export default memo(ForgotPage)
