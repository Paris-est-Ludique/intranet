import type { FC } from 'react'
import { memo } from 'react'
import type { RouteComponentProps } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import styles from './styles.module.scss'

import type { AppThunk } from '@/store'
import Asks, { fetchForAsks } from '@/components/Asks/Asks'
import LoginForm from '@/components/LoginForm/LoginForm'
import { fetchVolunteerAsksSetIfNeed } from '@/store/volunteerAsksSet'
import { selectUserJwtToken } from '@/store/auth'

export type Props = RouteComponentProps

const HomePage: FC<Props> = (): JSX.Element => {
  const jwtToken = useSelector(selectUserJwtToken)

  if (jwtToken === undefined)
    return <p>Loading...</p>

  if (jwtToken) {
    return <Asks />
  }
  return (
    <div>
      <div className={styles.homePage}>
        <div className={styles.loginContent}>
          <Helmet title="LoginPage" />
          <LoginForm />
        </div>
      </div>
      <div className={styles.homePage}>
        <div className={styles.navigationLink}>
          <a href="/sinscrire"> S&apos;informer sur le bénévolat </a>
        </div>
      </div>
    </div>
  )
}

export function loadData(): AppThunk[] {
  return [
    fetchVolunteerAsksSetIfNeed(),
    ...fetchForAsks.map(f => f()),
  ]
}

export default memo(HomePage)
