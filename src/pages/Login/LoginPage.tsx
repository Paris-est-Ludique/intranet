import { RouteComponentProps } from "react-router-dom"
import React, { memo } from "react"
import { Helmet } from "react-helmet"
import styles from "./styles.module.scss"
import LoginForm from "../../components/LoginForm/LonginForm"

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
