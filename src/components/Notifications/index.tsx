import _ from "lodash"
import React, { memo, useCallback, useState } from "react"
import { AppDispatch } from "../../store"
import { fetchVolunteerNotifsSet } from "../../store/volunteerNotifsSet"
import { VolunteerNotifs } from "../../services/volunteers"
import styles from "./styles.module.scss"
import { logoutUser } from "../../store/auth"
import { unsetJWT } from "../../services/auth"

interface Props {
    dispatch: AppDispatch
    jwt: string
    // eslint-disable-next-line react/require-default-props
    volunteerNotifs?: VolunteerNotifs
}

const Notifications = ({ dispatch, jwt, volunteerNotifs }: Props): JSX.Element => {
    const hidden = volunteerNotifs?.hiddenNotifs || []
    const notifs: JSX.Element[] = []

    const onSubmit1 = useCallback(
        (event: React.SyntheticEvent): void => {
            event.preventDefault()
            dispatch(
                fetchVolunteerNotifsSet(jwt, 0, {
                    hiddenNotifs: [...(volunteerNotifs?.hiddenNotifs || []), 1],
                })
            )
        },
        [dispatch, jwt, volunteerNotifs]
    )

    if (!_.includes(hidden, 1)) {
        notifs.push(
            <div key="1">
                <div className={styles.notificationsPage}>
                    <div className={styles.notificationsContent}>
                        <form onSubmit={onSubmit1}>
                            Salut {volunteerNotifs?.firstname} !
                            <div className={styles.notifIntro} key="login-intro">
                                Ici tu seras notifié(e) des nouvelles importantes et des questions
                                pour lesquelles il nous faudrait absolument ta réponse.
                                <div className={styles.formButtons}>
                                    <button type="submit">Ok, continuer</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }

    const [participation, setParticipation] = useState(volunteerNotifs?.active || "inconnu")
    const onChangeValue2 = (e: React.ChangeEvent<HTMLInputElement>) =>
        setParticipation(e.target.value)

    const onSubmit2 = useCallback(
        (event: React.SyntheticEvent): void => {
            event.preventDefault()

            dispatch(
                fetchVolunteerNotifsSet(jwt, 0, {
                    hiddenNotifs: [...(volunteerNotifs?.hiddenNotifs || []), 2],
                    active: participation,
                })
            )
        },
        [dispatch, jwt, volunteerNotifs, participation]
    )

    if (!_.includes(hidden, 2)) {
        notifs.push(
            <div key="2">
                <div className={styles.notificationsPage}>
                    <div className={styles.notificationsContent}>
                        <div className={styles.formLine} key="line-participation">
                            <form onSubmit={onSubmit2}>
                                Si les conditions sanitaires te le permettent, souhaites-tu être
                                bénévole à PeL 2022 ?<br />
                                <input
                                    type="radio"
                                    value="inconnu"
                                    name="gender"
                                    checked={participation === "inconnu"}
                                    onChange={onChangeValue2}
                                />{" "}
                                -<br />
                                <input
                                    type="radio"
                                    value="oui"
                                    name="gender"
                                    checked={participation === "oui"}
                                    onChange={onChangeValue2}
                                />{" "}
                                Oui
                                <br />
                                <input
                                    type="radio"
                                    value="non"
                                    name="gender"
                                    checked={participation === "non"}
                                    onChange={onChangeValue2}
                                />{" "}
                                Non
                                <br />
                                <input
                                    type="radio"
                                    value="peut-etre"
                                    name="gender"
                                    checked={participation === "peut-etre"}
                                    onChange={onChangeValue2}
                                />{" "}
                                Je ne sais pas encore
                                <br />
                                {participation === "peut-etre" ? (
                                    <div>
                                        On te redemandera dans quelques temps. Si tu as des
                                        questions
                                    </div>
                                ) : null}
                                <div className={styles.formButtons}>
                                    <button type="submit">Confirmer</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    /* DISCORD
    Discord nous donne à tous la parole via nos téléphone ou navigateurs, pour organiser le meilleur des festivals !
Il permet de discuter sujet par sujet entre tous les bénévoles, entre les membres d'une même équipe, ou avec ton référent.
Il permet de choisir les sujets spécifiques sur lesquels être notifié de nouveaux messages.

Rejoindre les 86 bénévoles déjà présents sur le serveur se fait en cliquant ici.
Tu n'y es absolument pas obligé(e) ! C'est juste plus pratique.
*/

    const onClick = useCallback(
        (event: React.SyntheticEvent): void => {
            event.preventDefault()
            unsetJWT()
            dispatch(logoutUser())
        },
        [dispatch]
    )

    notifs.push(
        <div key="logout" className={styles.formButtons}>
            <button type="button" onClick={onClick}>
                Se déconnecter
            </button>
        </div>
    )

    return <div>{notifs.map<React.ReactNode>((t) => t).reduce((prev, curr) => [prev, curr])}</div>
}

export default memo(Notifications)
