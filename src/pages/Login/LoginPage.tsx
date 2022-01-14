import { RouteComponentProps } from "react-router-dom"
import React, { memo } from "react"
import { Helmet } from "react-helmet"

import { LoginForm } from "../../components"
import styles from "./styles.module.scss"

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
