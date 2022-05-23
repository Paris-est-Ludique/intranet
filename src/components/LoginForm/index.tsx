import React, { memo, useCallback } from "react"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { AppState } from "../../store"
import { fetchVolunteerLogin } from "../../store/volunteerLogin"
import styles from "./styles.module.scss"
import FormSubmit from "../Form/FormSubmit/FormSubmit"

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
                Si tu es bénévole, connecte-toi pour accéder à ton espace.
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
                <FormSubmit>Connexion</FormSubmit>
            </div>
            {loginError && <div className={styles.error}>{loginError}</div>}
            <div className={styles.link}>
                <a href="/oubli"> Demander un nouveau mot de passe </a>
            </div>
        </form>
    )
}

export default memo(LoginForm)
