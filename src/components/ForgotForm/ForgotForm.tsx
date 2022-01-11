import React, { memo, useCallback } from "react"
import { Link } from "react-router-dom"
import { AppDispatch } from "../../store"
import { fetchVolunteerForgot } from "../../store/volunteerForgot"
import styles from "./styles.module.scss"

interface Props {
    dispatch: AppDispatch
    error: string
    message: string
}

const ForgotForm = ({ dispatch, error, message }: Props): JSX.Element => {
    const onSubmit = useCallback(
        (event: React.SyntheticEvent): void => {
            event.preventDefault()
            const target = event.target as typeof event.target & {
                email: { value: string }
            }
            const email = target.email.value

            dispatch(fetchVolunteerForgot({ email }))
        },
        [dispatch]
    )

    return (
        <form onSubmit={onSubmit}>
            <div className={styles.forgotIntro} key="forgot-intro">
                Nous allons te renvoyer un mot de passe à l&apos;adresse suivante.
            </div>
            <div className={styles.formLine} key="line-email">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="utilisateur" />
            </div>
            <div className={styles.formButtons}>
                <button type="submit">Envoyer</button>
            </div>
            <div className={styles.error}>{error}</div>
            <div className={styles.message}>{message}</div>
            <div className={styles.link}>
                <Link to="/"> S&apos;identifier </Link>
            </div>
        </form>
    )
}

export default memo(ForgotForm)
