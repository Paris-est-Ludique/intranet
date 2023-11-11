import type { FC } from 'react'
import { memo } from 'react'
import type { RouteComponentProps } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Helmet } from 'react-helmet'
import styles from './styles.module.scss'

import type { AppThunk } from '@/store'
import RegisterForm, { fetchForRegisterForm } from '@/components/RegisterForm/RegisterForm'

export type Props = RouteComponentProps

const RegisterPage: FC<Props> = (): JSX.Element => {
  const dispatch = useDispatch()
  return (
    <div className={styles.registerPage}>
      <div className={styles.registerContent}>
        <Helmet title="RegisterPage" />
        <RegisterForm dispatch={dispatch} />
      </div>
    </div>
  )
}

export const loadData = (): AppThunk[] => [...fetchForRegisterForm.map((f) => f())]

export default memo(RegisterPage)
