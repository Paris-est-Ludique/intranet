import _, { get } from "lodash"
import React, { memo, useCallback, useEffect, useRef, useState } from "react"
import isNode from "detect-node"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { fetchVolunteerNotifsSet } from "../../store/volunteerNotifsSet"
import styles from "./styles.module.scss"
import { selectUserJwtToken } from "../../store/auth"
import { VolunteerNotifs } from "../../services/volunteers"
import TeamWishesForm, {
    fetchFor as fetchForTeamWishesForm,
} from "../VolunteerBoard/TeamWishesForm/TeamWishesForm"
import { AppState } from "../../store"
import { useUserTeamWishes } from "../VolunteerBoard/teamWishes.utils"
import { useUserDayWishes } from "../VolunteerBoard/daysWishes.utils"
import ParticipationDetailsForm, {
    fetchFor as fetchForarticipationDetailsForm,
} from "../VolunteerBoard/ParticipationDetailsForm/ParticipationDetailsForm"
import DayWishesForm, {
    fetchFor as fetchForDayWishesForm,
} from "../VolunteerBoard/DayWishesForm/DayWishesForm"
import { useUserParticipationDetails } from "../VolunteerBoard/participationDetails.utils"
import FormButton from "../Form/FormButton/FormButton"
import { toastError, toastSuccess } from "../../store/utils"

let prevNotifs: VolunteerNotifs | undefined

const Notifications = (): JSX.Element | null => {
    const dispatch = useDispatch()
    const jwtToken = useSelector(selectUserJwtToken)
    const volunteerNotifs = useSelector((state: AppState) => {
        const notifs = state.volunteerNotifsSet?.entity
        if (notifs) {
            prevNotifs = notifs
            return notifs
        }
        return prevNotifs
    }, shallowEqual)
    const hidden = volunteerNotifs?.hiddenNotifs || []
    const notifs: JSX.Element[] = []

    const onSubmit1 = useCallback((): void => {
        dispatch(
            fetchVolunteerNotifsSet(jwtToken, 0, {
                hiddenNotifs: [...(volunteerNotifs?.hiddenNotifs || []), 1],
            })
        )
    }, [dispatch, jwtToken, volunteerNotifs])

    if (!_.includes(hidden, 1)) {
        notifs.push(
            <div key="1">
                <div className={styles.notificationsPage}>
                    <div className={styles.notificationsContentNarrow}>
                        <form>
                            Salut {volunteerNotifs?.firstname} !
                            <div className={styles.notifIntro} key="login-intro">
                                Ici tu seras notifié(e) des nouvelles importantes et des questions
                                pour lesquelles il nous faudrait absolument ta réponse.
                                <div className={styles.formButtons}>
                                    <FormButton onClick={onSubmit1}>Ok, continuer</FormButton>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }

    // const [participation, setParticipation] = useState(volunteerNotifs?.active || "inconnu")
    // const [participationMessage, setParticipationMessage] = useState("")
    // const onChangeValue2 = (e: React.ChangeEvent<HTMLInputElement>) =>
    //     setParticipation(e.target.value)

    // const onSubmit2 = useCallback(
    //     (): void => {
    //         if (participation === "inconnu") {
    //             setParticipationMessage("Il nous faudrait une réponse ^^")
    //             return
    //         }

    //         dispatch(
    //             fetchVolunteerNotifsSet(jwtToken, 0, {
    //                 hiddenNotifs: [...(volunteerNotifs?.hiddenNotifs || []), 2],
    //                 active: participation,
    //             })
    //         )
    //     },
    //     [dispatch, jwtToken, volunteerNotifs, participation]
    // )

    // if (!_.includes(hidden, 2)) {
    //     notifs.push(
    //         <div key="2">
    //             <div className={styles.notificationsPage}>
    //                 <div className={styles.notificationsContentNarrow}>
    //                     <div className={styles.formLine} key="line-participation">
    //                         <form>
    //                             Si les conditions sanitaires te le permettent, souhaites-tu être
    //                             bénévole à PeL 2022 ?<br />
    //                             <label>
    //                                 <input
    //                                     type="radio"
    //                                     value="oui"
    //                                     name="participation"
    //                                     checked={participation === "oui"}
    //                                     onChange={onChangeValue2}
    //                                 />{" "}
    //                                 Oui
    //                             </label>
    //                             <label>
    //                                 <input
    //                                     type="radio"
    //                                     value="non"
    //                                     name="participation"
    //                                     checked={participation === "non"}
    //                                     onChange={onChangeValue2}
    //                                 />{" "}
    //                                 Non
    //                             </label>
    //                             <label>
    //                                 <input
    //                                     type="radio"
    //                                     value="peut-etre"
    //                                     name="participation"
    //                                     checked={participation === "peut-etre"}
    //                                     onChange={onChangeValue2}
    //                                 />{" "}
    //                                 Je ne sais pas encore
    //                             </label>
    //                             {participation === "peut-etre" ? (
    //                                 <div>
    //                                     On te le reproposera dans quelques temps.
    //                                     <br />
    //                                     Si tu as besoin d&apos;infos, viens nous en parler sur le
    //                                     serveur Discord ! Pour le rejoindre,{" "}
    //                                     <a
    //                                         href="https://discord.com/invite/eXhjKxSBB4"
    //                                         target="_blank"
    //                                         rel="noreferrer"
    //                                     >
    //                                         clique ici{" "}
    //                                     </a>
    //                                     .
    //                                 </div>
    //                             ) : null}
    //                             <div className={styles.formButtons}>
    //                                 <FormButton onClick={onSubmit2}>Confirmer</FormButton>
    //                             </div>
    //                             <div className={styles.message}>{participationMessage}</div>
    //                         </form>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     )
    // }

    // const onSubmit3 = useCallback((): void => {
    //     dispatch(
    //         fetchVolunteerNotifsSet(jwtToken, 0, {
    //             hiddenNotifs: [...(volunteerNotifs?.hiddenNotifs || []), 3],
    //         })
    //     )
    // }, [dispatch, jwtToken, volunteerNotifs])

    // if (!_.includes(hidden, 3)) {
    //     notifs.push(
    //         <div key="3">
    //             <div className={styles.notificationsPage}>
    //                 <div className={styles.notificationsContentNarrow}>
    //                     <form>
    //                         <div
    //                             className={classnames(styles.notifIntro, styles.notifCentered)}
    //                             key="login-intro"
    //                         >
    //                             La{" "}
    //                             <a
    //                                 href="https://mailchi.mp/3c75c3b3a20f/gazette_2020_02-8978118"
    //                                 onClick={onSubmit3}
    //                             >
    //                                 gazette de février
    //                             </a>{" "}
    //                             est disponible !<br />
    //                             <div className={styles.formButtons}>
    //                                 <FormButton onClick={onSubmit3}>Ok, masquer</FormButton>
    //                             </div>
    //                         </div>
    //                     </form>
    //                 </div>
    //             </div>
    //         </div>
    //     )
    // }

    const answerLaterOnProfile = (
        <>
            Tu pourras y répondre plus tard sur la page <a href="/profil">Mon profil</a>.
        </>
    )

    const onSubmit10 = useCallback((): void => {
        dispatch(
            fetchVolunteerNotifsSet(jwtToken, 0, {
                hiddenNotifs: [...(volunteerNotifs?.hiddenNotifs || []), 10],
            })
        )
    }, [dispatch, jwtToken, volunteerNotifs])

    const [userWishes] = useUserDayWishes()
    const participation10 = get(userWishes, "active", "inconnu")
    const newSelection = get(userWishes, "dayWishes", [])
    const comment10 = get(userWishes, "dayWishesComment", "")
    const needToShow10 = participation10 === "inconnu" || (newSelection.length === 0 && !comment10)

    if (!_.includes(hidden, 10) && _.isEmpty(notifs) && needToShow10) {
        notifs.push(
            <div key="10">
                <div className={styles.notificationsPage}>
                    <div className={styles.notificationsContent}>
                        <DayWishesForm afterSubmit={onSubmit10}>
                            {answerLaterOnProfile}
                        </DayWishesForm>
                    </div>
                </div>
            </div>
        )
    }

    const onSubmit11 = useCallback((): void => {
        dispatch(
            fetchVolunteerNotifsSet(jwtToken, 0, {
                hiddenNotifs: [...(volunteerNotifs?.hiddenNotifs || []), 11],
            })
        )
    }, [dispatch, jwtToken, volunteerNotifs])

    const [teamWishesData] = useUserTeamWishes()
    const teamWishesString = get(teamWishesData, "teamWishes", [])
    const comment = get(teamWishesData, "teamWishesComment", "")
    const needToShow11 = teamWishesString.length === 0 && !comment

    if (!_.includes(hidden, 11) && _.isEmpty(notifs) && needToShow11) {
        notifs.push(
            <div key="11">
                <div className={styles.notificationsPage}>
                    <div className={styles.notificationsContent}>
                        <TeamWishesForm afterSubmit={onSubmit11}>
                            {answerLaterOnProfile}
                        </TeamWishesForm>
                    </div>
                </div>
            </div>
        )
    }

    const onSubmit12 = useCallback((): void => {
        dispatch(
            fetchVolunteerNotifsSet(jwtToken, 0, {
                hiddenNotifs: [...(volunteerNotifs?.hiddenNotifs || []), 12],
            })
        )
    }, [dispatch, jwtToken, volunteerNotifs])

    const [participationDetails] = useUserParticipationDetails()
    const tshirtSize = get(participationDetails, "tshirtSize", "")
    const food = get(participationDetails, "food", "")
    const needToShow12 = !tshirtSize && !food

    if (!_.includes(hidden, 12) && _.isEmpty(notifs) && needToShow12) {
        notifs.push(
            <div key="12">
                <div className={styles.notificationsPage}>
                    <div className={styles.notificationsContent}>
                        <ParticipationDetailsForm afterSubmit={onSubmit12}>
                            {answerLaterOnProfile}
                        </ParticipationDetailsForm>
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

    const onChangeValue99 = (e: React.ChangeEvent<HTMLInputElement>) =>
        setAcceptsNotifs(e.target.value)

    const onSubmit99 = useCallback(async (): Promise<void> => {
        if (isNode) {
            return
        }

        if (!("serviceWorker" in navigator)) {
            return
        }

        if (acceptsNotifs === "non") {
            setAcceptsNotifs("non")
            dispatch(
                fetchVolunteerNotifsSet(jwtToken, 0, {
                    hiddenNotifs: [...(volunteerNotifs?.hiddenNotifs || []), 99],
                    acceptsNotifs: "non",
                })
            )
            return
        }

        const registration = await navigator.serviceWorker.ready

        if (!registration.pushManager) {
            toastError(
                "Il y a un problème avec le push manager. Il faudrait utiliser un navigateur plus récent !"
            )
            dispatch(
                fetchVolunteerNotifsSet(jwtToken, 0, {
                    hiddenNotifs: [...(volunteerNotifs?.hiddenNotifs || []), 99],
                })
            )
            return
        }

        const convertedVapidKey = urlBase64ToUint8Array(process.env.FORCE_ORANGE_PUBLIC_VAPID_KEY)

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
            toastError("No convertedVapidKey available")
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
                        toastSuccess(
                            "Un autre navigateur était notifié, mais c'est maintenant celui-ci qui le sera."
                        )
                    }

                    dispatch(
                        fetchVolunteerNotifsSet(jwtToken, 0, {
                            pushNotifSubscription: JSON.stringify(newSubscription),
                            acceptsNotifs: "oui",
                            hiddenNotifs: [...(volunteerNotifs?.hiddenNotifs || []), 99],
                        })
                    )
                } catch (_e) {
                    if (Notification.permission !== "granted") {
                        toastError(
                            "Mince tu as bloqué les notifications pour le site des bénévoles ! En haut juste à gauche de la barre d'adresse, il y a une icone de cadenas ou de message barré sur lequel cliquer pour annuler ce blocage.",
                            false
                        )
                    } else {
                        toastError(
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
                    toastSuccess(
                        "Un autre navigateur était notifié, mais c'est maintenant celui-ci qui le sera."
                    )
                }

                dispatch(
                    fetchVolunteerNotifsSet(jwtToken, 0, {
                        pushNotifSubscription: JSON.stringify(existedSubscription),
                        acceptsNotifs: "oui",
                        hiddenNotifs: [...(volunteerNotifs?.hiddenNotifs || []), 99],
                    })
                )
            }
        } catch (_e) {
            toastError(
                "Il y a eu une erreur avec l'enregistrement avec le Service Worker. Il faudrait utiliser un navigateur plus récent !"
            )
        }
    }, [
        acceptsNotifs,
        dispatch,
        jwtToken,
        volunteerNotifs?.acceptsNotifs,
        volunteerNotifs?.hiddenNotifs,
        volunteerNotifs?.pushNotifSubscription,
    ])

    function subscriptionEqualsSave(toCheck: PushSubscription, save: string | undefined): boolean {
        if (!save) {
            return !toCheck
        }
        return _.isEqual(JSON.parse(JSON.stringify(toCheck)), JSON.parse(save))
    }

    const needToShow99 = volunteerNotifs?.acceptsNotifs !== "oui"

    if (!_.includes(hidden, 99) && _.isEmpty(notifs) && needToShow99) {
        notifs.push(
            <div key="pushNotifs">
                <div className={styles.notificationsPage}>
                    <div className={styles.notificationsContent}>
                        <div className={styles.formLine} key="line-participation">
                            <label>
                                Acceptes-tu de recevoir une alerte dans ton navigateur quand on en
                                aura d&apos;autres à t'afficher ici ?<br />
                                <span className={styles.sousMessage}>
                                    (Ça nous simplifierait la vie, on a des soucis à contacter les
                                    bénévoles par email.)
                                </span>
                                <label>
                                    <input
                                        type="radio"
                                        value="oui"
                                        name="gender"
                                        checked={acceptsNotifs === "oui"}
                                        onChange={onChangeValue99}
                                    />{" "}
                                    Oui
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="non"
                                        name="gender"
                                        checked={acceptsNotifs === "non"}
                                        onChange={onChangeValue99}
                                    />{" "}
                                    Non
                                </label>
                            </label>

                            <div className={styles.formButtons}>
                                <FormButton onClick={onSubmit99}>Enregistrer</FormButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (_.isEmpty(notifs)) {
        notifs.push(
            <div key="pushNotifs">
                <div className={styles.notificationsPage}>
                    <div className={styles.notificationsContent}>
                        <div className={styles.formLine} key="line-participation">
                            <label>
                                Tu as fait le tour des dernières infos ou questions importantes,
                                merci ! :)
                                <br />
                                Nous te préviendrons quand il y en aura de nouvelles.
                                <br />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (volunteerNotifs === undefined) {
        return null
    }

    return <div>{notifs.map<React.ReactNode>((t) => t).reduce((prev, curr) => [prev, curr])}</div>
}

export default memo(Notifications)

// Fetch server-side data here
export const fetchFor = [
    ...fetchForTeamWishesForm,
    ...fetchForarticipationDetailsForm,
    ...fetchForDayWishesForm,
]
