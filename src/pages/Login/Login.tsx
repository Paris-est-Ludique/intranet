import { RouteComponentProps } from "react-router-dom"
import React, { memo, useCallback } from "react"
import { Helmet } from "react-helmet"
import styles from "./styles.module.scss"

export type Props = RouteComponentProps

const Login: React.FC<Props> = (): JSX.Element => {
    const onSubmit = useCallback((event: React.SyntheticEvent): void => {
        event.preventDefault()
        const target = event.target as typeof event.target & {
            email: { value: string }
            password: { value: string }
        }
        const email = target.email.value
        const password = target.password.value

        console.log("email and password checked", email, password)

        // call service with email & password
    }, [])

    return (
        <div className={styles.Login}>
            <Helmet title="Login" />
            <form onSubmit={onSubmit} className={styles.form}>
                <div className={styles.LoginIntro} key="login-intro">
                    Connectez-vous pour accéder à votre espace.
                </div>
                <div className={styles.formLine} key="line-email">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" />
                </div>
                <div className={styles.formLine} key="line-password">
                    <label htmlFor="password">Mot de passe</label>
                    <input type="password" id="password" />
                </div>
                <div className={styles.formButtons}>
                    <button type="submit">Connexion</button>
                </div>
            </form>
        </div>
    )
}

export default memo(Login)
