import { RouteComponentProps } from "react-router-dom"
import React, { memo } from "react"
import { Helmet } from "react-helmet"
import styles from "./styles.module.scss"
import RegisterForm from "../../components/RegisterForm/RegisterForm"

export type Props = RouteComponentProps

const RegisterPage: React.FC<Props> = (): JSX.Element => (
    <div className={styles.registerPage}>
        <div className={styles.registerContent}>
            <Helmet title="RegisterPage" />
            <RegisterForm />
        </div>
    </div>
)

export default memo(RegisterPage)
