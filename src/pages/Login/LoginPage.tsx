import { RouteComponentProps } from "react-router-dom"
import { useDispatch, useSelector, shallowEqual } from "react-redux"
import React, { memo } from "react"
import { Helmet } from "react-helmet"

import { AppState } from "../../store"
import { LoginForm } from "../../components"
import styles from "./styles.module.scss"

export type Props = RouteComponentProps

const LoginPage: React.FC<Props> = (): JSX.Element => {
    const dispatch = useDispatch()
    const loginError = useSelector((state: AppState) => state.volunteerLogin.error, shallowEqual)

    return (
        <div className={styles.loginPage}>
            <div className={styles.loginContent}>
                <Helmet title="LoginPage" />
                <LoginForm dispatch={dispatch} error={loginError || ""} />
            </div>
        </div>
    )
}

export default memo(LoginPage)
