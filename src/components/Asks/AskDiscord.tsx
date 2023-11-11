import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import FormButton from '../Form/FormButton/FormButton'
import styles from './styles.module.scss'
import { addAsk, useAskTools } from './utils'
import { fetchVolunteerAsksSet } from '@/store/volunteerAsksSet'
import { fetchVolunteerDiscordIdIfNeed, selectVolunteerDiscordId } from '@/store/volunteerDiscordId'
import { fetchMiscDiscordInvitationIfNeed, selectMiscDiscordInvitation } from '@/store/miscDiscordInvitation'

export function AskDiscord(asks: JSX.Element[], id: number): void {
  const { dispatch, jwtToken, volunteerAsks } = useAskTools()
  const discordId: string | undefined = useSelector(selectVolunteerDiscordId)
  const discordInvitation = useSelector(selectMiscDiscordInvitation)

  const onSubmit = useCallback((): void => {
    dispatch(
      fetchVolunteerAsksSet(jwtToken, 0, {
        hiddenAsks: [...(volunteerAsks?.hiddenAsks || []), id],
      }),
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
        Discord nous permet gratuitement et sans pub de s'écrire entre bénévoles et donc de s'organiser super
        efficacement !
        <br />
        L’appli est dispo ici :
        <br />
        Android : https://play.google.com/store/apps/details?id=com.discord
        <br />
        iPhone : https://apps.apple.com/fr/app/discord-discute-partage/id985746746
        <br />
        Puis rejoindre le serveur PeL ici :
        {' '}
        <a
          href={discordInvitation}
          onClick={onSubmit}
        >
          {discordInvitation}
        </a>
        <br />
        C’est un peu déroutant au début, mais extrêmement pratique car les discussions sont organisées par thème, par
        sujet, par équipe, que tu peux demander à suivre de près en activant les notifications, ou ignorer totalement.
        En parallèle du téléphone ou à la place, tu peux aussi y accéder depuis un navigateur :
        {' '}
        <a href="https://discord.com/login">https://discord.com/login</a>
        <br />
      </p>
      <p>Prends le temps de le rejoindre maintenant, c'est via cet outil que la plupart des équipes s'organisent !</p>
      <p>
        Pour s'y retrouver tellement on est nombreux (plus de 200), il est nécessaire d'avoir son prénom comme alias.
        Voir même d'avoir ensuite la première lettre de ton nom de famille si un autre bénévole présent sur le serveur a
        le même prénom.
      </p>

      <div className={styles.formButtons}>
        <FormButton onClick={onSubmit}>Ok, noté</FormButton>
      </div>
    </div>,
  )
}

export const fetchForAskDiscord = [fetchVolunteerDiscordIdIfNeed, fetchMiscDiscordInvitationIfNeed]
