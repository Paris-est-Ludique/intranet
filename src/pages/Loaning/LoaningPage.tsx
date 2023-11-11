import type { FC } from 'react'
import { memo } from 'react'
import { useSelector } from 'react-redux'
import type { RouteComponentProps } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import styles from './styles.module.scss'

import type { AppThunk } from '@/store'
import { selectUserJwtToken } from '@/store/auth'

import Loaning, { fetchForLoaning } from '@/components/Loan/Loaning'
import LoaningIntro from '@/components/Loan/LoaningIntro'
import LoginForm from '@/components/LoginForm/LoginForm'

export type Props = RouteComponentProps

const LoaningPage: FC<Props> = (): JSX.Element => {
  const jwtToken = useSelector(selectUserJwtToken)
  if (jwtToken === undefined)
    return <p>Loading...</p>
  if (!jwtToken) {
    return <LoginForm loginNeeded />
  }
  return (
    <div className={styles.loaningPage}>
      <div className={styles.loaningContent}>
        <Helmet title="LoaningPage" />
        <LoaningIntro />
        <Loaning />
      </div>
    </div>
  )
}

export const loadData = (): AppThunk[] => [...fetchForLoaning.map((f) => f())]

export default memo(LoaningPage)
