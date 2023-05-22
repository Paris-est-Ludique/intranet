import { FC, memo } from "react"
import { useSelector } from "react-redux"
import { RouteComponentProps } from "react-router-dom"
import { Helmet } from "react-helmet"

import { AppThunk } from "../../store"
import styles from "./styles.module.scss"
import { LoansIntro, Loans, fetchForLoans, LoginForm } from "../../components"
import { selectUserJwtToken } from "../../store/auth"

export type Props = RouteComponentProps

const LoansPage: FC<Props> = (): JSX.Element => {
    const jwtToken = useSelector(selectUserJwtToken)
    if (jwtToken === undefined) return <p>Loading...</p>
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

// Fetch server-side data here
export const loadData = (): AppThunk[] => [...fetchForLoans.map((f) => f())]

export default memo(LoansPage)
