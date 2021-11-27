import React, { memo, useCallback } from "react"
import styles from "./styles.module.scss"

const RegisterForm = (): JSX.Element => {
    const onSubmit = useCallback((event: React.SyntheticEvent): void => {
        event.preventDefault()
        const target = event.target as typeof event.target & {
            firstname: { value: string }
            lastname: { value: string }
            email: { value: string }
            phone: { value: string }
        }
        const firstname = target.firstname.value
        const lastname = target.lastname.value
        const email = target.email.value
        const phone = target.phone.value

        console.log("register fields checked", firstname, lastname, email, phone)

        // call service with fields
    }, [])

    /*
    prenom
    nom
    mail
    tel
    j'ai déjà été bénévole pour PEL
    un petit mot...
     */

    return (
        <form onSubmit={onSubmit}>
            <dl className={styles.registerIntro} key="register-intro">
                <dt>Qu&apos;est-ce le festival ?</dt>
                <dd>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                    fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                </dd>
                <dt>Être bénévole à PEL c&apos;est :</dt>
                <dd>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                    fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                </dd>
            </dl>
            <div className={styles.formLine} key="line-firstname">
                <label htmlFor="firstname">Prénom</label>
                <input type="text" id="firstname" />
            </div>
            <div className={styles.formLine} key="line-lastname">
                <label htmlFor="lastname">Nom</label>
                <input type="text" id="lastname" />
            </div>
            <div className={styles.formLine} key="line-email">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" />
            </div>
            <div className={styles.formLine} key="line-phone">
                <label htmlFor="phone">Téléphone</label>
                <input type="text" id="phone" />
            </div>
            <div className={styles.formLine} key="line-already-volunteer">
                <div>J&apos;ai déjà été bénévole</div>
                <input
                    type="radio"
                    name="alreadyVolunteer"
                    id="alreadyVolunteer-yes"
                    className={styles.inputRadio}
                />
                <label htmlFor="alreadyVolunteer-yes">Oui</label>
                <input
                    type="radio"
                    name="alreadyVolunteer"
                    id="alreadyVolunteer-no"
                    className={styles.inputRadio}
                />
                <label htmlFor="alreadyVolunteer-no">Non</label>
            </div>
            <div className={styles.formLine} key="line-message">
                <label htmlFor="message">
                    Des petits mots sympas, questions, envies, des infos sur toi, des compétences
                    dont tu aimerais te servir... dis-nous !!!
                </label>
                <textarea name="message" id="message" />
            </div>
            <div className={styles.formButtons}>
                <button type="submit">Je deviens bénévole</button>
            </div>
        </form>
    )
}

export default memo(RegisterForm)
