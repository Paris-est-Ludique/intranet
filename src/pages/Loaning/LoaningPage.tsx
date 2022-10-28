import { FC, memo } from "react"
import { useSelector } from "react-redux"
import { RouteComponentProps } from "react-router-dom"
import { Helmet } from "react-helmet"

import { AppThunk } from "../../store"
import styles from "./styles.module.scss"
import { LoaningIntro, Loaning, fetchForLoaning } from "../../components"
import { selectUserJwtToken } from "../../store/auth"

export type Props = RouteComponentProps

const LoaningPage: FC<Props> = (): JSX.Element => {
    const jwtToken = useSelector(selectUserJwtToken)
    if (jwtToken === undefined) return <p>Loading...</p>
    if (!jwtToken) {
        return <div>Besoin d'être identifié</div>
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

// Fetch server-side data here
export const loadData = (): AppThunk[] => [...fetchForLoaning.map((f) => f())]

export default memo(LoaningPage)
