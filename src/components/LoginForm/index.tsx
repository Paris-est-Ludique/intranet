import { memo, useCallback, useRef } from "react"
import { get } from "lodash"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { AppState } from "../../store"
import { fetchVolunteerLogin } from "../../store/volunteerLogin"
import styles from "./styles.module.scss"
import FormSubmit from "../Form/FormSubmit/FormSubmit"

const LoginForm = (): JSX.Element => {
    const dispatch = useDispatch()
    const loginError = useSelector((state: AppState) => state.volunteerLogin.error, shallowEqual)

    const emailRef = useRef<HTMLInputElement | null>(null)
    const passwordRef = useRef<HTMLInputElement | null>(null)

    const onSubmit = useCallback(
        (event: React.SyntheticEvent): boolean => {
            event.preventDefault()
            event.stopPropagation()
            const email = get(emailRef, "current.value", "")
            const password = get(passwordRef, "current.value", "")

            dispatch(fetchVolunteerLogin({ email, password }))
            return false
        },
        [dispatch]
    )

    return (
        <form>
            <div className={styles.loginIntro} key="login-intro">
                Si tu es bénévole, connecte-toi pour accéder à ton espace.
            </div>
            <div className={styles.formLine} key="line-email">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="utilisateur" ref={emailRef} />
            </div>
            <div className={styles.formLine} key="line-password">
                <label htmlFor="password">Mot de passe</label>
                <input type="password" id="password" name="motdepasse" ref={passwordRef} />
            </div>
            <div className={styles.formButtons}>
                <FormSubmit onClick={onSubmit}>Connexion</FormSubmit>
            </div>
            {loginError && <div className={styles.error}>{loginError}</div>}
            <div className={styles.link}>
                <a href="/oubli"> Demander un nouveau mot de passe </a>
            </div>
        </form>
    )
}

export default memo(LoginForm)
