import { useCallback } from "react"
import { useSelector } from "react-redux"
import { fetchVolunteerAsksSet } from "../../store/volunteerAsksSet"
import styles from "./styles.module.scss"
import { useAskTools, addAsk } from "./utils"
import FormButton from "../Form/FormButton/FormButton"
import {
    fetchVolunteerDiscordIdIfNeed,
    selectVolunteerDiscordId,
} from "../../store/volunteerDiscordId"

export function AskDiscord(asks: JSX.Element[], id: number): void {
    const { dispatch, jwtToken, volunteerAsks } = useAskTools()
    const discordId: number | undefined = useSelector(selectVolunteerDiscordId)

    const onSubmit = useCallback((): void => {
        dispatch(
            fetchVolunteerAsksSet(jwtToken, 0, {
                hiddenAsks: [...(volunteerAsks?.hiddenAsks || []), id],
            })
        )
    }, [dispatch, id, jwtToken, volunteerAsks?.hiddenAsks])

    const needToShow = !discordId

    addAsk(
        asks,
        id,
        volunteerAsks,
        true,
        needToShow,
        <div className={styles.formLine}>
            <p>
                Discord nous permet gratuitement et sans pub de s'écrire entre bénévoles via nos
                navigateurs ou smartphones. Et donc de s'organiser super efficacement !<br />
                C'est un peu déroutant au début, mais extrêmement pratique car à chaque sujet de
                discussion correspond un salon différent que tu peux demander à suivre ou ignorer
                totalement via la gestion des notifications.
                <br />
                Pour rejoindre le serveur PeL, voici le lien d'invitation à cliquer :{" "}
                <a href="https://discord.gg/eXhjKxSBB4" onClick={onSubmit}>
                    https://discord.gg/eXhjKxSBB4
                </a>{" "}
                !
            </p>
            <p>
                Prends le temps de le rejoindre maintenant, c'est via cet outil que la plupart des
                équipes s'organisent !
            </p>
            <p>
                Pour s'y retrouver tellement on est nombreux (plus de 120), il est nécessaire
                d'avoir son prénom comme alias. Voir même d'avoir ensuite la première lettre de ton
                nom de famille si un autre bénévole présent sur le serveur a le même prénom. Pour
                changer ton alias uniquement sur le serveur PeL, il faut faire un clique droit sur
                l'icône ronde du serveur en haut à gauche, et aller dans “Modifier le profil du
                serveur”.
            </p>

            <div className={styles.formButtons}>
                <FormButton onClick={onSubmit}>Ok, noté</FormButton>
            </div>
        </div>
    )
}

// Fetch server-side data here
export const fetchFor = [fetchVolunteerDiscordIdIfNeed]
