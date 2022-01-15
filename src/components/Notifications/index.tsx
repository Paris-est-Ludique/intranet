import _ from "lodash"
import React, { memo, useCallback, useEffect, useRef, useState } from "react"
import isNode from "detect-node"
import { useDispatch, useSelector } from "react-redux"
import { fetchVolunteerNotifsSet } from "../../store/volunteerNotifsSet"
import styles from "./styles.module.scss"
import { selectUserJwtToken } from "../../store/auth"
import { VolunteerNotifs } from "../../services/volunteers"
import LogoutButton from "../LogoutButton/LogoutButton"

interface Props {
    // eslint-disable-next-line react/require-default-props
    volunteerNotifs?: VolunteerNotifs
}

const Notifications = ({ volunteerNotifs }: Props): JSX.Element | null => {
    const dispatch = useDispatch()
    const jwtToken = useSelector(selectUserJwtToken)
    const hidden = volunteerNotifs?.hiddenNotifs || []
    const notifs: JSX.Element[] = []

    const onSubmit1 = useCallback(
        (event: React.SyntheticEvent): void => {
            event.preventDefault()
            dispatch(
                fetchVolunteerNotifsSet(jwtToken, 0, {
                    hiddenNotifs: [...(volunteerNotifs?.hiddenNotifs || []), 1],
                })
            )
        },
        [dispatch, jwtToken, volunteerNotifs]
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
    const [participationMessage, setParticipationMessage] = useState("")
    const onChangeValue2 = (e: React.ChangeEvent<HTMLInputElement>) =>
        setParticipation(e.target.value)

    const onSubmit2 = useCallback(
        (event: React.SyntheticEvent): void => {
            event.preventDefault()
            if (participation === "inconnu") {
                setParticipationMessage("Il nous faudrait une réponse ^^")
                return
            }

            dispatch(
                fetchVolunteerNotifsSet(jwtToken, 0, {
                    hiddenNotifs: [...(volunteerNotifs?.hiddenNotifs || []), 2],
                    active: participation,
                })
            )
        },
        [dispatch, jwtToken, volunteerNotifs, participation]
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
                                <label>
                                    <input
                                        type="radio"
                                        value="oui"
                                        name="gender"
                                        checked={participation === "oui"}
                                        onChange={onChangeValue2}
                                    />{" "}
                                    Oui
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="non"
                                        name="gender"
                                        checked={participation === "non"}
                                        onChange={onChangeValue2}
                                    />{" "}
                                    Non
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="peut-etre"
                                        name="gender"
                                        checked={participation === "peut-etre"}
                                        onChange={onChangeValue2}
                                    />{" "}
                                    Je ne sais pas encore
                                </label>
                                {participation === "peut-etre" ? (
                                    <div>
                                        On te le reproposera dans quelques temps.
                                        <br />
                                        Si tu as besoin d&apos;infos, viens nous en parler sur le
                                        serveur Discord ! Pour le rejoindre,{" "}
                                        <a
                                            href="https://discord.com/invite/eXhjKxSBB4"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            clique ici{" "}
                                        </a>
                                        .
                                    </div>
                                ) : null}
                                <div className={styles.formButtons}>
                                    <button type="submit">Confirmer</button>
                                </div>
                                <div className={styles.message}>{participationMessage}</div>
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

    const [acceptsNotifs, setAcceptsNotifs] = useState("")
    const [notifMessage, setNotifMessage] = useState("")

    const mounted = useRef(false)
    useEffect(() => {
        if (mounted.current) {
            return
        }
        mounted.current = true
        if (!isNode) {
            if (volunteerNotifs?.acceptsNotifs === "oui") {
                navigator.serviceWorker.ready.then((registration) =>
                    registration.pushManager.getSubscription().then((existedSubscription) => {
                        const doesAcceptNotifs =
                            _.isEqual(
                                JSON.parse(JSON.stringify(existedSubscription)),
                                JSON.parse(volunteerNotifs?.pushNotifSubscription)
                            ) && volunteerNotifs?.acceptsNotifs === "oui"
                        setAcceptsNotifs(doesAcceptNotifs ? "oui" : "non")
                    })
                )
            } else {
                setAcceptsNotifs("non")
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onChangePushNotifs = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
            event.preventDefault()
            if (isNode) {
                return
            }

            if (!("serviceWorker" in navigator)) {
                return
            }

            const isChecked = event.target.value === "oui"
            if (!isChecked) {
                setNotifMessage("")
                setAcceptsNotifs("non")
                dispatch(
                    fetchVolunteerNotifsSet(jwtToken, 0, {
                        acceptsNotifs: "non",
                    })
                )
                return
            }

            const registration = await navigator.serviceWorker.ready

            if (!registration.pushManager) {
                setNotifMessage(
                    "Il y a un problème avec le push manager. Il faudrait utiliser un navigateur plus récent !"
                )
                return
            }

            const convertedVapidKey = urlBase64ToUint8Array(
                process.env.FORCE_ORANGE_PUBLIC_VAPID_KEY
            )

            function urlBase64ToUint8Array(base64String?: string) {
                if (!base64String) {
                    return ""
                }
                const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
                // eslint-disable-next-line
                const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

                const rawData = atob(base64)
                const outputArray = new Uint8Array(rawData.length)

                for (let i = 0; i < rawData.length; i += 1) {
                    outputArray[i] = rawData.charCodeAt(i)
                }
                return outputArray
            }

            if (!convertedVapidKey) {
                console.error("No convertedVapidKey available")
            }

            try {
                const existedSubscription = await registration.pushManager.getSubscription()

                if (existedSubscription === null) {
                    // No subscription detected, make a request
                    try {
                        const newSubscription = await registration.pushManager.subscribe({
                            applicationServerKey: convertedVapidKey,
                            userVisibleOnly: true,
                        })
                        // New subscription added
                        if (
                            volunteerNotifs?.acceptsNotifs === "oui" &&
                            !subscriptionEqualsSave(
                                newSubscription,
                                volunteerNotifs?.pushNotifSubscription
                            )
                        ) {
                            setNotifMessage(
                                "Un autre navigateur était notifié, mais c'est maintenant celui-ci qui le sera."
                            )
                        } else {
                            setNotifMessage("C'est mémorisé !")
                        }

                        setAcceptsNotifs("oui")
                        dispatch(
                            fetchVolunteerNotifsSet(jwtToken, 0, {
                                pushNotifSubscription: JSON.stringify(newSubscription),
                                acceptsNotifs: "oui",
                            })
                        )
                    } catch (_e) {
                        if (Notification.permission !== "granted") {
                            setNotifMessage(
                                "Mince tu as bloqué les notifications pour le site des bénévoles ! En haut juste à gauche de la barre d'adresse, il y a une icone de cadenas ou de message barré sur lequel cliquer pour annuler ce blocage."
                            )
                        } else {
                            setNotifMessage(
                                "Il y a eu une erreur avec l'enregistrement avec le Service Worker. Il faudrait utiliser un navigateur plus récent !"
                            )
                        }
                    }
                } else {
                    // Existed subscription detected
                    if (
                        volunteerNotifs?.acceptsNotifs === "oui" &&
                        !subscriptionEqualsSave(
                            existedSubscription,
                            volunteerNotifs?.pushNotifSubscription
                        )
                    ) {
                        setNotifMessage(
                            "Un autre navigateur était notifié, mais c'est maintenant celui-ci qui le sera."
                        )
                    } else {
                        setNotifMessage("C'est mémorisé !")
                    }

                    setAcceptsNotifs("oui")
                    dispatch(
                        fetchVolunteerNotifsSet(jwtToken, 0, {
                            pushNotifSubscription: JSON.stringify(existedSubscription),
                            acceptsNotifs: "oui",
                        })
                    )
                }
            } catch (_e) {
                setNotifMessage(
                    "Il y a eu une erreur avec l'enregistrement avec le Service Worker. Il faudrait utiliser un navigateur plus récent !"
                )
            }
        },
        [dispatch, jwtToken, volunteerNotifs]
    )

    function subscriptionEqualsSave(toCheck: PushSubscription, save: string | undefined): boolean {
        if (!save) {
            return !toCheck
        }
        return _.isEqual(JSON.parse(JSON.stringify(toCheck)), JSON.parse(save))
    }

    if (notifs.length === 0) {
        notifs.push(
            <div key="pushNotifs">
                <div className={styles.pushNotificationsPage}>
                    <div className={styles.pushNotificationsContent}>
                        <div className={styles.formLine} key="line-participation">
                            <label>
                                Acceptes-tu de recevoir une alerte dans ton navigateur quand on aura
                                une info ou question importante à te poser ici sur le site ?<br />
                                <span className={styles.sousMessage}>
                                    (Ça simplifierait grandement notre organisation !!)
                                </span>
                                <label>
                                    <input
                                        type="radio"
                                        value="oui"
                                        name="gender"
                                        checked={acceptsNotifs === "oui"}
                                        onChange={onChangePushNotifs}
                                    />{" "}
                                    Oui
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="non"
                                        name="gender"
                                        checked={acceptsNotifs === "non"}
                                        onChange={onChangePushNotifs}
                                    />{" "}
                                    Non
                                </label>
                            </label>
                            <div className={styles.message}>{notifMessage}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (volunteerNotifs === undefined) {
        return null
    }

    return (
        <div>
            {notifs.map<React.ReactNode>((t) => t).reduce((prev, curr) => [prev, curr])}
            <LogoutButton />
        </div>
    )
}

export default memo(Notifications)
