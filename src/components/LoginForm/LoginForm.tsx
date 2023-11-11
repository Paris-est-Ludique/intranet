import { memo, useCallback, useRef } from 'react'
import get from 'lodash/get'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import FormSubmit from '../Form/FormSubmit/FormSubmit'
import styles from './styles.module.scss'
import type { AppState } from '@/store'
import { fetchVolunteerLogin, fetchVolunteerLoginToRoot } from '@/store/volunteerLogin'

interface Props {
  redirectToRoot?: boolean
  loginNeeded?: boolean
}

function LoginForm({ redirectToRoot, loginNeeded }: Props): JSX.Element {
  const dispatch = useDispatch()
  const loginError = useSelector((state: AppState) => state.volunteerLogin.error, shallowEqual)

  const emailRef = useRef<HTMLInputElement | null>(null)
  const passwordRef = useRef<HTMLInputElement | null>(null)

  const onSubmit = useCallback(
    (event: React.SyntheticEvent): boolean => {
      event.preventDefault()
      event.stopPropagation()
      const email = get(emailRef, 'current.value', '')
      const password = get(passwordRef, 'current.value', '')

      dispatch(
        (redirectToRoot ? fetchVolunteerLoginToRoot : fetchVolunteerLogin)({
          email,
          password,
        }),
      )

      return false
    },
    [dispatch, redirectToRoot],
  )

  const loginForm = (
    <form>
      <div
        className={styles.formLine}
        key="line-email"
      >
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="utilisateur"
          ref={emailRef}
        />
      </div>
      <div
        className={styles.formLine}
        key="line-password"
      >
        <label htmlFor="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          name="motdepasse"
          ref={passwordRef}
        />
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

  return (
    <>
      {loginNeeded && (
        <div className={styles.loginPage}>
          <div className={styles.loginContent}>
            <div className={styles.loginIntro}>Tu dois t'identifier pour accéder à cette page !</div>
            {loginForm}
          </div>
        </div>
      )}

      {redirectToRoot && loginForm}

      {!loginNeeded && !redirectToRoot && (
        <>
          <div
            className={styles.loginIntro}
            key="login-intro"
          >
            Si tu es bénévole ou que tu l'as déjà été, connecte-toi pour accéder à ton espace.
          </div>
          {loginForm}
        </>
      )}
    </>
  )
}

// Set default props

LoginForm.defaultProps = {
  redirectToRoot: undefined,
  loginNeeded: undefined,
}

export default memo(LoginForm)
