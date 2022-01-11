import _ from "lodash"
import React, { memo, useCallback, useEffect, useRef, useState } from "react"
import isNode from "detect-node"
import { shallowEqual, useSelector } from "react-redux"
import { AppDispatch, AppState } from "../../store"
import { fetchVolunteerNotifsSet } from "../../store/volunteerNotifsSet"
import styles from "./styles.module.scss"
import { logoutUser } from "../../store/auth"
import { unsetJWT } from "../../services/auth"
import { VolunteerNotifs } from "../../services/volunteers"

interface Props {
    dispatch: AppDispatch
    jwt: string
}
let prevNotifs: VolunteerNotifs | undefined

const Notifications = ({ dispatch, jwt }: Props): JSX.Element | null => {
    const volunteerNotifs = useSelector((state: AppState) => {
        const notifs = state.volunteerNotifsSet.entity
        if (notifs) {
            prevNotifs = notifs
            return notifs
        }
        return prevNotifs
    }, shallowEqual)

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
                                <label>
                                    <input
                                        type="radio"
                                        value="inconnu"
                                        name="gender"
                                        checked={participation === "inconnu"}
                                        onChange={onChangeValue2}
                                    />{" "}
                                    -
                                </label>
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
                    fetchVolunteerNotifsSet(jwt, 0, {
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
                            setNotifMessage("C'est enregistré !")
                        }

                        setAcceptsNotifs("oui")
                        dispatch(
                            fetchVolunteerNotifsSet(jwt, 0, {
                                pushNotifSubscription: JSON.stringify(newSubscription),
                                acceptsNotifs: "oui",
                            })
                        )
                    } catch (_e) {
                        if (Notification.permission !== "granted") {
                            setNotifMessage(
                                "Mince tu as bloqué toutes notifications pour le site des bénévoles, l'exact opposé de ce qu'il fallait :) Pour annuler ça, les instructions sont ici : https://support.pushcrew.com/support/solutions/articles/9000098467-how-to-unblock-notifications-from-a-website-that-you-once-blocked-"
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
                        setNotifMessage("C'est enregistré !")
                    }

                    setAcceptsNotifs("oui")
                    dispatch(
                        fetchVolunteerNotifsSet(jwt, 0, {
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
        [dispatch, jwt, volunteerNotifs]
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
                <div className={styles.notificationsPage}>
                    <div className={styles.notificationsContent}>
                        <div className={styles.formLine} key="line-participation">
                            <label>
                                Acceptes-tu d&apos;être notifié(e) ici quand on aura des questions
                                ou informations importantes pour toi ?
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

    if (volunteerNotifs === undefined) {
        return null
    }

    return <div>{notifs.map<React.ReactNode>((t) => t).reduce((prev, curr) => [prev, curr])}</div>
}

export default memo(Notifications)
