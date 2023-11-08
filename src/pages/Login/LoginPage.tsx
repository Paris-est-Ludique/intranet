import type React from 'react'
import { memo } from 'react'
import styles from './styles.module.scss'
import type { RouteComponentProps } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import LoginForm from '@/components/LoginForm/LoginForm'

export type Props = RouteComponentProps

const LoginPage: React.FC<Props> = (): JSX.Element => (
  <div className={styles.loginPage}>
    <div className={styles.loginContent}>
      <Helmet title="LoginPage" />
      <LoginForm />
    </div>
  </div>
)

export default memo(LoginPage)
