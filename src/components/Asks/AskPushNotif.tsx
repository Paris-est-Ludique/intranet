import _ from "lodash"
import React, { useCallback, useEffect, useRef, useState } from "react"
import isNode from "detect-node"
import { fetchVolunteerAsksSet } from "../../store/volunteerAsksSet"
import styles from "./styles.module.scss"
import { useAskTools, addAsk } from "./utils"
import FormButton from "../Form/FormButton/FormButton"
import { toastError, toastSuccess } from "../../store/utils"

export function AskPushNotif(asks: JSX.Element[], id: number): void {
    const { dispatch, jwtToken, volunteerAsks } = useAskTools()

    const [acceptsNotifs, setAcceptsNotifs] = useState("")

    const mounted = useRef(false)
    useEffect(() => {
        if (mounted.current) {
            return
        }
        mounted.current = true
        if (!isNode) {
            if (volunteerAsks?.acceptsNotifs === "oui") {
                navigator.serviceWorker.ready.then((registration) =>
                    registration.pushManager.getSubscription().then((existedSubscription) => {
                        const doesAcceptNotifs =
                            _.isEqual(
                                JSON.parse(JSON.stringify(existedSubscription)),
                                JSON.parse(volunteerAsks?.pushNotifSubscription)
                            ) && volunteerAsks?.acceptsNotifs === "oui"
                        setAcceptsNotifs(doesAcceptNotifs ? "oui" : "non")
                    })
                )
            } else {
                setAcceptsNotifs("non")
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) =>
        setAcceptsNotifs(e.target.value)

    const onSubmit = useCallback(async (): Promise<void> => {
        if (isNode) {
            return
        }

        if (!("serviceWorker" in navigator)) {
            return
        }

        if (acceptsNotifs === "non") {
            dispatch(
                fetchVolunteerAsksSet(jwtToken, 0, {
                    hiddenAsks: [...(volunteerAsks?.hiddenAsks || []), id],
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
                fetchVolunteerAsksSet(jwtToken, 0, {
                    hiddenAsks: [...(volunteerAsks?.hiddenAsks || []), id],
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
                        volunteerAsks?.acceptsNotifs === "oui" &&
                        !subscriptionEqualsSave(
                            newSubscription,
                            volunteerAsks?.pushNotifSubscription
                        )
                    ) {
                        toastSuccess(
                            "Un autre navigateur était notifié, mais c'est maintenant celui-ci qui le sera."
                        )
                    }

                    dispatch(
                        fetchVolunteerAsksSet(jwtToken, 0, {
                            pushNotifSubscription: JSON.stringify(newSubscription),
                            acceptsNotifs: "oui",
                            hiddenAsks: [...(volunteerAsks?.hiddenAsks || []), id],
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
                    volunteerAsks?.acceptsNotifs === "oui" &&
                    !subscriptionEqualsSave(
                        existedSubscription,
                        volunteerAsks?.pushNotifSubscription
                    )
                ) {
                    toastSuccess(
                        "Un autre navigateur était notifié, mais c'est maintenant celui-ci qui le sera."
                    )
                }

                dispatch(
                    fetchVolunteerAsksSet(jwtToken, 0, {
                        pushNotifSubscription: JSON.stringify(existedSubscription),
                        acceptsNotifs: "oui",
                        hiddenAsks: [...(volunteerAsks?.hiddenAsks || []), id],
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
        id,
        jwtToken,
        volunteerAsks?.acceptsNotifs,
        volunteerAsks?.hiddenAsks,
        volunteerAsks?.pushNotifSubscription,
    ])

    function subscriptionEqualsSave(toCheck: PushSubscription, save: string | undefined): boolean {
        if (!save) {
            return !toCheck
        }
        return _.isEqual(JSON.parse(JSON.stringify(toCheck)), JSON.parse(save))
    }

    const needToShow =
        volunteerAsks?.acceptsNotifs !== "oui" && volunteerAsks?.acceptsNotifs !== "non"

    addAsk(
        asks,
        id,
        volunteerAsks,
        true,
        needToShow,
        <div className={styles.formLine} key="line-participation">
            <label>
                Acceptes-tu de recevoir une alerte dans ton navigateur quand on en aura
                d&apos;autres à t'afficher ici ?<br />
                <span className={styles.sousMessage}>
                    (Ça nous simplifierait la vie, on a des soucis à contacter les bénévoles par
                    email.)
                </span>
                <label>
                    <input
                        type="radio"
                        value="oui"
                        name="notifs"
                        checked={acceptsNotifs === "oui"}
                        onChange={onChangeValue}
                    />{" "}
                    Oui
                </label>
                <label>
                    <input
                        type="radio"
                        value="non"
                        name="notifs"
                        checked={acceptsNotifs === "non"}
                        onChange={onChangeValue}
                    />{" "}
                    Non
                </label>
            </label>

            <div className={styles.formButtons}>
                <FormButton onClick={onSubmit}>Enregistrer</FormButton>
            </div>
        </div>
    )
}
