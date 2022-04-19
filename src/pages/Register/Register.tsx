import { FC, memo } from "react"
import { RouteComponentProps } from "react-router-dom"
import { useDispatch } from "react-redux"
import { Helmet } from "react-helmet"

import { AppThunk } from "../../store"
import { RegisterForm } from "../../components"
import styles from "./styles.module.scss"

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

// Fetch server-side data here
export const loadData = (): AppThunk[] => []

export default memo(RegisterPage)
