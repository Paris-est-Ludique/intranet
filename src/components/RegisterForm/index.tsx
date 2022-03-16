import React, { memo, useState } from "react"
import { useSelector, shallowEqual } from "react-redux"
import { toast } from "react-toastify"
import _ from "lodash"
import styles from "./styles.module.scss"

import { fetchPostulantAdd } from "../../store/postulantAdd"
import { AppDispatch, AppState } from "../../store"
import { fetchVolunteerPartialAdd } from "../../store/volunteerPartialAdd"

interface Props {
    dispatch: AppDispatch
}

const RegisterForm = ({ dispatch }: Props): JSX.Element => {
    const [potentialVolunteer, setPotentialVolunteer] = useState(true)
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [email, setEmail] = useState("")
    const [mobile, setMobile] = useState("")
    const [alreadyVolunteer, setAlreadyVolunteer] = useState(false)
    const [comment, setComment] = useState("")
    const [sending, setSending] = useState(false)

    const onNewVolunteer = (e: React.ChangeEvent<HTMLInputElement>) =>
        setPotentialVolunteer(!e.target.value)
    const onPotentialVolunteer = (e: React.ChangeEvent<HTMLInputElement>) =>
        setPotentialVolunteer(!!e.target.value)

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
            if (potentialVolunteer) {
                dispatch(
                    fetchPostulantAdd({
                        firstname,
                        lastname,
                        email,
                        mobile,
                        potential: true,
                        comment,
                    })
                )
            } else {
                dispatch(
                    fetchPostulantAdd({
                        firstname,
                        lastname,
                        email,
                        mobile,
                        potential: false,
                        comment,
                    })
                )
                dispatch(
                    fetchVolunteerPartialAdd({
                        firstname,
                        lastname,
                        email,
                        mobile,
                    })
                )
            }

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

    const { error, entities: postulant } = useSelector(
        (state: AppState) => state.postulantAdd,
        shallowEqual
    )

    let sendSuccess
    if (!_.isEmpty(postulant)) {
        if (sending) {
            setSending(false)
        }
        sendSuccess = <span className={styles.success}>Formulaire envoyé !</span>
    }

    let sendError
    if (error && _.isEmpty(postulant)) {
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
            <dl className={styles.preRegisterIntro} key="preRegister-intro">
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
                        La majorité d&apos;entre nous sommes bénévoles les <b>samedi et dimanche</b>
                        , mais certains bénévoles ne sont pas disponibles les deux jours. On leur
                        demande alors d&apos;aider à la mise en place jeudi ou vendredi, ou au
                        rangement le lundi. Bref, chacun participe comme il peut mais deux jours
                        minimum !
                    </p>
                    <p>
                        Le samedi soir quand les visiteurs sont partis, nous prolongeons la fête en
                        dînant avec les exposants présents sur le festival.
                    </p>
                </dd>
                <dt>
                    Si l&apos;expérience vous tente, remplissez le formulaire suivant pour devenir
                    bénévoles !<br />
                    Vous pouvez aussi juste nous rencontrer avant de vous décider à devenir
                    bénévole, on comprend qu&apos;un saut dans l&apos;inconnu soit difficile.
                    <br />
                    Dans les deux cas, venez nous rencontrer mardi 22 mars près de Châtelet, détails
                    après l&apos;inscription :)
                    <br />
                </dt>
                <dd>
                    <div className={styles.formLine} key="line-potential-volunteer">
                        <div>
                            Je veux devenir bénévole
                            <input
                                type="radio"
                                name="potentialVolunteer"
                                id="potentialVolunteer-yes"
                                className={styles.inputRadio}
                                checked={!potentialVolunteer}
                                onChange={onNewVolunteer}
                            />
                            <label htmlFor="potentialVolunteer-yes">Tout de suite !</label>
                            <input
                                type="radio"
                                name="potentialVolunteer"
                                id="potentialVolunteer-no"
                                className={styles.inputRadio}
                                checked={potentialVolunteer}
                                onChange={onPotentialVolunteer}
                            />
                            <label htmlFor="potentialVolunteer-no">
                                Peut-être après une rencontre avec des bénévoles
                            </label>
                        </div>
                    </div>
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
                            J&apos;ai déjà été bénévole à PeL
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
                            placeholder="Dis-nous ici comment tu as connu le festival, ce qui te motive à nous rejoindre, quelles compétences tu aimerais développer ou utiliser... ou tu n'y as pas trop réfléchi et tu trouveras en discutant avec nous :)"
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
