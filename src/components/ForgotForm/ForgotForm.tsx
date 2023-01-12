import React, { memo, useCallback, useRef } from "react"
import { get } from "lodash"
import type {} from "redux-thunk/extend-redux"
import { AppDispatch } from "../../store"
import { fetchVolunteerForgot } from "../../store/volunteerForgot"
import styles from "./styles.module.scss"
import FormSubmit from "../Form/FormSubmit/FormSubmit"

interface Props {
    dispatch: AppDispatch
    error: string
    message: string
}

const ForgotForm = ({ dispatch, error, message }: Props): JSX.Element => {
    const emailRef = useRef<HTMLInputElement | null>(null)

    const onSubmit = useCallback(
        (event: React.SyntheticEvent): boolean => {
            event.preventDefault()
            event.stopPropagation()
            const email = get(emailRef, "current.value", "")

            dispatch(fetchVolunteerForgot({ email }))
            return false
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
                <input type="email" id="email" name="utilisateur" ref={emailRef} />
            </div>
            <div className={styles.formButtons}>
                <FormSubmit onClick={onSubmit}>Envoyer</FormSubmit>
            </div>
            <div className={styles.error}>{error}</div>
            <div className={styles.message}>{message}</div>
            <div className={styles.link}>
                <a href="/"> S&apos;identifier </a>
            </div>
        </form>
    )
}

export default memo(ForgotForm)
