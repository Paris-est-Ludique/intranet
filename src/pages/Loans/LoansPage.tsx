import type { FC } from 'react'
import { memo } from 'react'
import { useSelector } from 'react-redux'
import type { RouteComponentProps } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import styles from './styles.module.scss'

import type { AppThunk } from '@/store'
import { selectUserJwtToken } from '@/store/auth'
import Loans, { fetchForLoans } from '@/components/Loan/Loans'
import LoansIntro from '@/components/Loan/LoansIntro'
import LoginForm from '@/components/LoginForm/LoginForm'

export type Props = RouteComponentProps

const LoansPage: FC<Props> = (): JSX.Element => {
  const jwtToken = useSelector(selectUserJwtToken)
  if (jwtToken === undefined)
    return <p>Loading...</p>
  if (!jwtToken) {
    return <LoginForm loginNeeded />
  }
  return (
    <div className={styles.loaningPage}>
      <div className={styles.loaningContent}>
        <Helmet title="LoansPage" />
        <LoansIntro />
        <Loans />
      </div>
    </div>
  )
}

export const loadData = (): AppThunk[] => [...fetchForLoans.map((f) => f())]

export default memo(LoansPage)
