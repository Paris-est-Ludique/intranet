import { RouteComponentProps } from "react-router-dom"
import { useDispatch, useSelector, shallowEqual } from "react-redux"
import React, { memo } from "react"
import { Helmet } from "react-helmet"

import { AppState } from "../../store"
import LoginForm from "../../components/LoginForm/LoginForm"
import styles from "./styles.module.scss"

export type Props = RouteComponentProps

const RegisterPage: React.FC<Props> = (): JSX.Element => {
    const dispatch = useDispatch()
    const loginError = useSelector((state: AppState) => state.volunteerLogin.error, shallowEqual)

    return (
        <div className={styles.loginPage}>
            <div className={styles.loginContent}>
                <Helmet title="RegisterPage" />
                <LoginForm dispatch={dispatch} error={loginError || ""} />
            </div>
        </div>
    )
}

export default memo(RegisterPage)
