import React, { memo, useCallback } from "react"
import { Link } from "react-router-dom"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { AppState } from "../../store"
import { fetchVolunteerLogin } from "../../store/volunteerLogin"
import styles from "./styles.module.scss"

const LoginForm = (): JSX.Element => {
    const dispatch = useDispatch()
    const loginError = useSelector((state: AppState) => state.volunteerLogin.error, shallowEqual)

    const onSubmit = useCallback(
        (event: React.SyntheticEvent): void => {
            event.preventDefault()
            const target = event.target as typeof event.target & {
                email: { value: string }
                password: { value: string }
            }
            const email = target.email.value
            const password = target.password.value

            dispatch(fetchVolunteerLogin({ email, password }))
        },
        [dispatch]
    )

    return (
        <form onSubmit={onSubmit}>
            <div className={styles.loginIntro} key="login-intro">
                Si vous êtes bénévole, connectez-vous pour accéder à votre espace.
            </div>
            <div className={styles.formLine} key="line-email">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="utilisateur" />
            </div>
            <div className={styles.formLine} key="line-password">
                <label htmlFor="password">Mot de passe</label>
                <input type="password" id="password" name="motdepasse" />
            </div>
            <div className={styles.formButtons}>
                <button type="submit">Connexion</button>
            </div>
            {loginError && <div className={styles.error}>{loginError}</div>}
            <div className={styles.link}>
                <Link to="/forgot"> Demander un nouveau mot de passe </Link>
            </div>
        </form>
    )
}

export default memo(LoginForm)
