import React, { memo, useState } from "react"
import { useSelector, shallowEqual } from "react-redux"
import { toast } from "react-toastify"
import _ from "lodash"
import styles from "./styles.module.scss"

import { fetchPreMemberAdd } from "../../store/preMemberAdd"
import { AppDispatch, AppState } from "../../store"

interface Props {
    dispatch: AppDispatch
}

const RegisterForm = ({ dispatch }: Props): JSX.Element => {
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [email, setEmail] = useState("")
    const [mobile, setMobile] = useState("")
    const [alreadyVolunteer, setAlreadyVolunteer] = useState(false)
    const [comment, setComment] = useState("")
    const [sending, setSending] = useState(false)

    const onFirstnameChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFirstname(e.target.value)
    const onLastnameChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
        setLastname(e.target.value)
    const onEmailChanged = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)
    const onMobileChanged = (e: React.ChangeEvent<HTMLInputElement>) => setMobile(e.target.value)
    const onAlreadyVolunteer = (e: React.ChangeEvent<HTMLInputElement>) =>
        setAlreadyVolunteer(!!e.target.value)
    const onNotYesVolunteer = (e: React.ChangeEvent<HTMLInputElement>) =>
        setAlreadyVolunteer(!e.target.value)
    const onCommentChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
        setComment(e.target.value)

    const onSubmit = () => {
        if (firstname && lastname && email && mobile && !sending) {
            dispatch(
                fetchPreMemberAdd({
                    firstname,
                    lastname,
                    email,
                    mobile,
                    alreadyVolunteer,
                    comment,
                })
            )

            setSending(true)
        } else {
            toast.warning("Il faut remplir tous les champs (sauf le dernier)", {
                position: "top-center",
                autoClose: 6000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        }
    }

    const { error, entities: preMember } = useSelector(
        (state: AppState) => state.preMemberAdd,
        shallowEqual
    )

    let sendSuccess
    if (!_.isEmpty(preMember)) {
        if (sending) {
            setSending(false)
        }
        sendSuccess = <span className={styles.success}>Formulaire envoyé !</span>
    }

    let sendError
    if (error && _.isEmpty(preMember)) {
        if (sending) {
            setSending(false)
        }
        sendError = <span className={styles.error}>{error}</span>
    }

    let sendingElement
    if (sending) {
        sendingElement = <span className={styles.sending}>Envoi en cours...</span>
    }
    /*
    firstname
    lastname
    mail
    tel
    j'ai déjà été bénévole pour PEL
    un petit mot...
     */

    return (
        <form onSubmit={onSubmit}>
            <dl className={styles.registerIntro} key="register-intro">
                <dt>Qu&apos;est-ce que Paris est Ludique ?</dt>
                <dd>
                    <p>
                        Un festival en plein air dédiée aux <b>jeux de société modernes</b> sous
                        toutes leurs formes.
                    </p>
                    <p>
                        En 2019 lors de la dernière édition, ce sont <b>16 000</b> joueurs qui se
                        sont réunis sous 300 chapiteaux et 2 000 tables.
                    </p>
                    <p>
                        Les 2 jours que durent le festival sont entièrement dédiés à ce que le
                        public <b>JOUE</b>, que ce soit sur les stands d&apos;éditeurs,
                        d&apos;associations, d&apos;animateurs bénévoles, du coin des petits
                        joueurs, de l&apos;espace tournois, ou de l&apos;espace prototypes.
                    </p>
                </dd>
                <dt>Et les bénévoles de PeL ?</dt>
                <dd>
                    <p>
                        L&apos;organisation du festival est <b>entièrement gérée par nous</b>, les
                        bénévoles. À aucun moment ça ne ressemble à du travail : nous faisons tout
                        pour passer <b>un aussi bon moment que les visiteurs</b> :)
                    </p>
                    <p>
                        D&apos;ailleurs, un soir par mois nous nous réunissons pour un apéro ludique
                        où discuter de l&apos;organisation ! On joue autant que les visiteurs, mais
                        sur toute l&apos;année ^^
                    </p>
                    <p>
                        Pendant le festival de 2019, nous étions <b>187 bénévoles</b> organisés en
                        équipes qui chouchoutent les visiteurs en les accueillant, en
                        s&apos;assurant que tout se passe bien, ou encore en expliquant des règles
                        de jeux.
                    </p>
                    <p>
                        Une équipe est même dédiée au bien être des bénévoles en leur servant à
                        boire et à manger dans un espace à part où faire des pauses régulières. Et
                        puis nous hébergeons ceux d&apos;entre nous qui habitent loin de Paris. Le
                        confort avant tout !
                    </p>
                    <p>
                        Certains bénévoles sont visiteurs le samedi ou le dimanche pour vivre le
                        festival de l&apos;intérieur. Les deux jours avant et le jour après le
                        festival, ceux qui le peuvent viennent préparer et ranger. Bref, chacun
                        participe à la hauteur de ses envies et disponibilités !
                    </p>
                    <p>
                        Le samedi soir quand les visiteurs sont partis, nous prolongeons la fête en
                        dînant avec les auteurs, illustrateurs et éditeurs présents sur le festival.
                    </p>
                </dd>
                <dt>
                    Si l&apos;expérience pourrait vous tenter, remplissez le formulaire suivant pour
                    en discuter lors d&apos;un des gros apéros mensuels !<br />
                    Cette inscription ne vous oblige en rien il s&apos;agit juste d&apos;une prise
                    de contact.
                    <br />
                    Les prochains sont les 21 décembre et 27 janvier, mais nous vous appelerons
                    d&apos;ici là pour les détails :)
                    <br />
                    <span className={styles.lightTitle}>(Déjà au moins 8 inscrits !)</span>
                </dt>
                <dd>
                    <div className={styles.formLine} key="line-firstname">
                        <label htmlFor="firstname">Prénom</label>
                        <input
                            type="text"
                            id="firstname"
                            required
                            value={firstname}
                            onChange={onFirstnameChanged}
                        />
                    </div>
                    <div className={styles.formLine} key="line-lastname">
                        <label htmlFor="lastname">Nom</label>
                        <input
                            type="text"
                            id="lastname"
                            required
                            value={lastname}
                            onChange={onLastnameChanged}
                        />
                    </div>
                    <div className={styles.formLine} key="line-email">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            required
                            value={email}
                            onChange={onEmailChanged}
                        />
                    </div>
                    <div className={styles.formLine} key="line-mobile">
                        <label htmlFor="mobile">Téléphone</label>
                        <input
                            type="text"
                            id="mobile"
                            required
                            value={mobile}
                            onChange={onMobileChanged}
                        />
                    </div>
                    <div className={styles.formLine} key="line-already-volunteer">
                        <div>
                            J&apos;ai déjà été bénévole
                            <input
                                type="radio"
                                name="alreadyVolunteer"
                                id="alreadyVolunteer-yes"
                                className={styles.inputRadio}
                                checked={alreadyVolunteer}
                                onChange={onAlreadyVolunteer}
                            />
                            <label htmlFor="alreadyVolunteer-yes">Oui</label>
                            <input
                                type="radio"
                                name="alreadyVolunteer"
                                id="alreadyVolunteer-no"
                                className={styles.inputRadio}
                                checked={!alreadyVolunteer}
                                onChange={onNotYesVolunteer}
                            />
                            <label htmlFor="alreadyVolunteer-no">Non</label>
                        </div>
                    </div>
                    <div className={styles.formLine} key="line-message">
                        <textarea
                            name="message"
                            id="message"
                            placeholder="Des petits mots sympas, questions, envies, des infos sur toi, des compétences dont tu aimerais te servir... ou rien de tout ça et nous en discuterons au téléphone :)"
                            value={comment}
                            onChange={onCommentChanged}
                        />
                    </div>
                    <div className={styles.formButtons}>
                        <button type="button" onClick={onSubmit} disabled={sending}>
                            Envoyer
                        </button>
                    </div>
                    <div className={styles.formReactions}>
                        {sendingElement}
                        {sendSuccess}
                        {sendError}
                    </div>
                </dd>
            </dl>
        </form>
    )
}

export default memo(RegisterForm)
