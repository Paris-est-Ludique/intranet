import { RouteComponentProps } from "react-router-dom"
import React, { memo } from "react"
import { Helmet } from "react-helmet"
import styles from "./styles.module.scss"
import LoginForm from "../../components/LoginForm/LoginForm"

export type Props = RouteComponentProps

const RegisterPage: React.FC<Props> = (): JSX.Element => (
    <div className={styles.loginPage}>
        <div className={styles.loginContent}>
            <Helmet title="RegisterPage" />
            <LoginForm />
        </div>
    </div>
)

export default memo(RegisterPage)