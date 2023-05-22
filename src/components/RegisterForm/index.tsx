import { memo, useEffect, useState } from "react"
import { useSelector, shallowEqual } from "react-redux"
import type {} from "redux-thunk/extend-redux"
import { toast } from "react-toastify"
import _ from "lodash"
import classnames from "classnames"
import styles from "./styles.module.scss"

import { fetchPostulantAdd } from "../../store/postulantAdd"
import { AppDispatch, AppState } from "../../store"
import FormButton from "../Form/FormButton/FormButton"
import { validEmail } from "../../utils/standardization"
import { toastError } from "../../store/utils"
import {
    sendBooleanRadioboxDispatch,
    sendTextareaDispatch,
    sendRadioboxDispatch,
    sendTextDispatch,
} from "../input.utils"
import {
    fetchMiscFestivalDateListIfNeed,
    selectMiscFestivalDateList,
} from "../../store/miscFestivalDateList"
import {
    fetchMiscMeetingDateListIfNeed,
    selectMiscMeetingDateList,
} from "../../store/miscMeetingDateList"
import LoginForm from "../LoginForm"

interface Props {
    dispatch: AppDispatch
}

const animations = [
    [styles.imgTransitionDoHide, styles.imgTransitionShow],
    [styles.imgTransitionHidden, styles.imgTransitionShow],
    [styles.imgTransitionReset, styles.imgTransitionShow],
    [styles.imgTransitionAbouToShow, styles.imgTransitionShow],
    [styles.imgTransitionShow, styles.imgTransitionDoHide],
    [styles.imgTransitionShow, styles.imgTransitionHidden],
    [styles.imgTransitionShow, styles.imgTransitionReset],
    [styles.imgTransitionShow, styles.imgTransitionAbouToShow],
]
const RegisterForm = ({ dispatch }: Props): JSX.Element => {
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [email, setEmail] = useState("")
    const [mobile, setMobile] = useState("")
    const [comment, setComment] = useState("")
    const [alreadyCame, setAlreadyCame] = useState(true)
    const [alreadySignup, setAlreadySignup] = useState(false)
    const [firstMeeting, setFirstMeeting] = useState("")
    const [commentFirstMeeting, setCommentFirstMeeting] = useState("")
    const [howToContact, setHowToContact] = useState("Email")
    const [sending, setSending] = useState(false)
    const [changingBackground, setChangingBackground] = useState(0)

    const festivalDateList = useSelector(selectMiscFestivalDateList)
    const meetingDateList = useSelector(selectMiscMeetingDateList)

    const enableRegistering = true
    const hasMeetingDates = meetingDateList.length > 0

    useEffect(() => {
        const timer = setInterval(() => {
            setChangingBackground((changingBackground + 1) % animations.length)
        }, 60000 / animations.length)
        return () => clearInterval(timer)
    }, [changingBackground, setChangingBackground])
    const transitionClass = (i: number) => animations[changingBackground][i - 1]

    const onSubmit = () => {
        if (!validEmail(email)) {
            toastError("Cet email est invalid ><")
            return
        }
        if (!firstname || !lastname || !email || !mobile || sending) {
            toast.warning("Il faut remplir les quelques infos sur toi ><", {
                position: "top-center",
                autoClose: 6000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            return
        }

        dispatch(
            fetchPostulantAdd({
                potential: true,
                firstname,
                lastname,
                email,
                mobile,
                howToContact,
                alreadyCame,
                firstMeeting,
                commentFirstMeeting: firstMeeting ? "" : commentFirstMeeting,
                comment,
            })
        )
        // dispatch(
        //     fetchVolunteerPartialAdd({
        //         firstname,
        //         lastname,
        //         email,
        //         mobile,
        //         howToContact,
        //     })
        // )

        setSending(true)
    }

    const { error: postulantError, entities: postulant } = useSelector(
        (state: AppState) => state.postulantAdd,
        shallowEqual
    )

    const { error: volunteerError, entities: volunteer } = useSelector(
        (state: AppState) => state.volunteerPartialAdd,
        shallowEqual
    )

    let sendSuccess
    let sendError
    let sendingElement
    if (!postulantError && !_.isEmpty(postulant)) {
        if (sending) {
            setSending(false)
        }
        sendSuccess = (
            <span className={styles.success}>
                Formulaire envoyé !<br />
                Tu as reçu un email de confirmation, peut-être dans tes spams.
            </span>
        )
    } else if (postulantError && _.isEmpty(postulant)) {
        if (sending) {
            setSending(false)
        }
        sendError = <span className={styles.error}>{postulantError}</span>
    } else if (volunteerError && _.isEmpty(volunteer)) {
        if (sending) {
            setSending(false)
        }
        sendError = <span className={styles.error}>{volunteerError}</span>
    } else if (sending) {
        sendingElement = (
            <span className={styles.sending}>
                Envoi en cours...
                <br />
                En cas de problème, écrire à benevoles@parisestludique.fr
            </span>
        )
    }

    const festivalFullDate = _.find(festivalDateList, { id: 1 })?.date

    const intro = (
        <dl className={styles.registerIntro}>
            <dt>Qu&apos;est-ce que Paris est Ludique ?</dt>
            <dd>
                <p>
                    Un festival en plein air dédié aux <b>jeux de société modernes</b> sous toutes
                    leurs formes.{festivalFullDate && ` Les ${festivalFullDate} !`}
                </p>
                <p>
                    En 2022, ce sont <b>18 000</b> visiteurs qui sont venus sous 300 chapiteaux et 2
                    000 tables.
                </p>
                <p>
                    Les 2 jours que durent le festival sont entièrement dédiés à ce que le public{" "}
                    <b>JOUE</b>, que ce soit sur les stands d&apos;éditeurs, d&apos;associations,
                    d&apos;animateurs bénévoles, du coin des petits joueurs, de l&apos;espace
                    tournois, ou de l&apos;espace prototypes.
                </p>
                <div id="pelImg" className={styles.pelImg}>
                    <div className={classnames(styles.pelImg1, transitionClass(1))}> </div>
                    <div className={classnames(styles.pelImg2, transitionClass(2))}> </div>
                </div>
            </dd>
            <dt>Et les bénévoles de PeL ?</dt>
            <dd>
                <p>
                    L&apos;organisation du festival est <b>entièrement gérée par nous</b>, les
                    bénévoles. À aucun moment ça ne ressemble à du travail : nous faisons tout pour
                    passer <b>un aussi bon moment que les visiteurs</b> :)
                </p>
                <p>
                    D&apos;ailleurs, un soir par mois nous nous réunissons pour un apéro ludique où
                    discuter de l&apos;organisation ! On joue autant que les visiteurs, mais sur
                    toute l&apos;année ^^
                </p>
                <p>
                    Pendant le festival de 2022, nous étions <b>196 bénévoles</b> organisés en
                    équipes qui chouchoutent les visiteurs en les accueillant, en s&apos;assurant
                    que tout se passe bien, ou encore en expliquant des règles de jeux.
                </p>
                <p>
                    Une équipe est même dédiée au bien être des bénévoles en leur servant à boire et
                    à manger dans un espace à part où faire des pauses régulières. Et puis nous
                    hébergeons ceux d&apos;entre nous qui habitent loin de Paris. Le confort avant
                    tout !
                </p>
                <p>
                    La majorité d'entre nous sommes bénévoles les <b>samedi et dimanche</b>, mais
                    certains bénévoles ne sont pas disponibles les deux jours. On leur demande alors
                    d'aider à la mise en place mercredi, jeudi ou vendredi, ou au rangement le
                    lundi, à la place d'un des jours du weekend. Bref, chacun participe comme il
                    peut mais <b>deux jours minimum</b> !
                </p>
                <p>
                    Le samedi soir quand les visiteurs sont partis, nous prolongeons la fête en
                    dînant avec les exposants présents sur le festival. Le dimanche rebelote juste
                    entre bénévoles.
                </p>
                <div className={styles.beneImg}> </div>
            </dd>

            {!enableRegistering && (
                <dt>
                    L'inscription est clôturée pour l'édition 2023, mais si l'expérience te tente,
                    remplis le formulaire suivant pour devenir bénévole à PeL 2024 !<br />
                    Dès septembre on se rencontrera sur Paris en petits groupes pour discuter du
                    festival, du bénévolat et surtout faire connaissance :)
                    <br />
                </dt>
            )}

            {enableRegistering && (
                <dt>
                    Si tu as envie de donner le sourire à des milliers de gens, remplis le
                    formulaire suivant pour rencontrer une poignée d'entre nous dans un bar/resto
                    près de Châtelet, avant de te décider ou non à devenir bénévole :)
                    <br />
                </dt>
            )}
        </dl>
    )

    const commentQuestion = (
        <dl className={styles.inputWrapper}>
            <dd className={styles.commentWrapper}>
                <textarea
                    name="message"
                    id="message"
                    className={styles.inputWrapper}
                    placeholder="Peux-tu nous dire ici comment tu as connu le festival, ce qui te motive à nous rejoindre, quelles compétences tu aimerais éventuellement développer ou utiliser... ou tu n'y as pas trop réfléchi et tu trouveras en discutant avec nous :)"
                    value={comment}
                    onChange={sendTextareaDispatch(setComment)}
                />
            </dd>
        </dl>
    )

    const alreadySignupForm = (
        <>
            <div className={styles.inputWrapper}>
                <div className={styles.leftCol}>
                    <div className={styles.multipleChoiceTitle}>
                        As-tu déjà été bénévole à Paris est Ludique (PeL) ?
                    </div>
                </div>
                <div className={styles.rightCol}>
                    <div className={styles.rightColContainer}>
                        {["Oui", "Non"].map((option) => (
                            <label className={styles.shortAnswerLabel} key={option}>
                                <input
                                    type="radio"
                                    name="alreadySignup"
                                    onChange={sendBooleanRadioboxDispatch(
                                        setAlreadySignup,
                                        option === "Oui"
                                    )}
                                    checked={alreadySignup === (option === "Oui")}
                                />{" "}
                                {option}
                            </label>
                        ))}
                    </div>
                </div>
            </div>
            {alreadySignup && (
                <dl className={styles.registerIntro}>
                    <dt>
                        Dans ce cas tu n'as pas besoin de t'inscrire ici, tu as déjà un compte sur
                        Force Orange !
                    </dt>
                    <dd>
                        <p>
                            Viens simplement t'identifier sur <a href="/">fo.parisestludique.fr</a>{" "}
                            ou en dessous ^^
                        </p>
                        <LoginForm redirectToRoot />
                    </dd>
                </dl>
            )}
        </>
    )

    const cameAsVisitor = (
        <>
            <div className={styles.inputWrapper}>
                <div className={styles.leftCol}>
                    <div className={styles.multipleChoiceTitle}>
                        Es-tu déjà venu à PeL en tant que visiteur ?
                    </div>
                </div>
                <div className={styles.rightCol}>
                    <div className={styles.rightColContainer}>
                        {["Oui", "Non"].map((option) => (
                            <label className={styles.shortAnswerLabel} key={option}>
                                <input
                                    type="radio"
                                    name="alreadyCame"
                                    onChange={sendBooleanRadioboxDispatch(
                                        setAlreadyCame,
                                        option === "Oui"
                                    )}
                                    checked={alreadyCame === (option === "Oui")}
                                />{" "}
                                {option}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {!alreadyCame && (
                <dl className={styles.registerIntro}>
                    <dt>Dans ce cas laisse-moi t'en dire un peu plus sur le festival !</dt>
                    <dd>
                        <p>
                            Il a lieu peu après la Foire du Trône et au même emplacement, sur la{" "}
                            <a
                                href="https://www.google.com/maps/place/Pelouse+de+Reuilly,+75012+Paris/@48.8301639,2.4043365,17z/data=!3m1!4b1!4m5!3m4!1s0x47e67258d44aa311:0x2c6a08bb6aa88f4d!8m2!3d48.8301604!4d2.4065252?hl=en"
                                target="_blank"
                                rel="noreferrer"
                            >
                                "pelouse" de Reuilly
                            </a>
                            . En voici le plan de 2019, quand il s'étendait sur 2 hectares pour
                            accueillir 16 000 visiteurs. La plupart des rectangles colorés que tu
                            vois dessus sont d'énormes barnums, ou agglomérats de tonnelles.
                        </p>
                        <div className={styles.barnumsImg}> </div>
                        <div className={styles.planImg}> </div>
                        <p>
                            Les espaces jeux bleu, violet, gris, ou marron sont installés et animés
                            par des éditeurs professionnels. Des pros gèrent les zones de
                            restauration rouges. Tout le reste est tenu par des associations ou des
                            bénévoles du festival.
                        </p>
                        <p>
                            Après l'édition de 2019, on a fait cette petite vidéo qui donne une
                            bonne impression de l'ambiance :{" "}
                            <a
                                href="https://www.youtube.com/watch?v=eVuQaERb7EU"
                                target="_blank"
                                rel="noreferrer"
                            >
                                https://www.youtube.com/watch?v=eVuQaERb7EU
                            </a>
                        </p>
                        <p>
                            Et des visiteurs passionnés (
                            <a
                                href="https://www.youtube.com/c/RoadNTroll"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Road N Troll
                            </a>
                            ) ont fait cette présentation plus en détail des différentes zones en
                            2018. J'ai coupé les présentations de jeux mais tout le reste est encore
                            d'actualité :{" "}
                            <a
                                href="https://www.youtube.com/watch?v=jSCHWqjHJIQ"
                                target="_blank"
                                rel="noreferrer"
                            >
                                https://www.youtube.com/watch?v=jSCHWqjHJIQ
                            </a>
                        </p>
                    </dd>
                </dl>
            )}
        </>
    )

    const meeting = enableRegistering && (
        <>
            <dl className={styles.registerIntro}>
                <dt>Faisons connaissance !</dt>
                <dd>
                    <p>
                        On organise des rencontres entre de nouvelles personnes comme toi, et des
                        bénévoles suffisamment expérimentés pour te parler en détail du festival et
                        répondre à toutes tes questions liées au bénévolat ou au festival.
                    </p>
                    <p>
                        Ces rencontres ont lieu à 19h dans un bar/resto calme à Châtelet, le{" "}
                        <a
                            href="https://g.page/lerhinocerosparis?share"
                            id="sfmMap"
                            key="sfmMap"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Rhinocéros
                        </a>
                        .
                    </p>
                </dd>
            </dl>

            {hasMeetingDates ? (
                <div className={styles.inputWrapper}>
                    <div className={styles.leftCol}>
                        <div className={styles.multipleChoiceTitle}>
                            À quelle date pourrais-tu venir ?
                        </div>
                    </div>
                    <div className={styles.rightCol}>
                        <div className={styles.rightColContainer}>
                            {_.concat(
                                meetingDateList.map((meetingDetails) => ({
                                    value: meetingDetails.meetingId,
                                    desc: meetingDetails.meetingTitle,
                                })),
                                { value: "", desc: "Aucune date possible" }
                            ).map((option) => (
                                <label className={styles.longAnswerLabel} key={option.value}>
                                    <input
                                        type="radio"
                                        name="firstMeeting"
                                        value={option.value}
                                        onChange={sendRadioboxDispatch(setFirstMeeting)}
                                        checked={firstMeeting === option.value}
                                    />{" "}
                                    {option.desc}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            ) : null}

            {!hasMeetingDates && (
                <div className={styles.inputWrapper}>
                    <div className={styles.leftCol}>
                        <div className={styles.multipleChoiceTitle}>
                            Es-tu dispo un lundi ou mardi soir sur Paris pour nous rencontrer ?
                        </div>
                    </div>
                    <div className={styles.rightCol}>
                        <div className={styles.rightColContainer}>
                            {[
                                { value: "", desc: "Rencontre sur Paris" },
                                { value: "visio", desc: "Plutôt en visio" },
                            ].map((option) => (
                                <label className={styles.longAnswerLabel} key={option.value}>
                                    <input
                                        type="radio"
                                        name="firstMeeting"
                                        value={option.value}
                                        onChange={sendRadioboxDispatch(setFirstMeeting)}
                                        checked={firstMeeting === option.value}
                                    />{" "}
                                    {option.desc}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {(!hasMeetingDates || firstMeeting !== "") && (
                <dl className={styles.registerIntro}>
                    <dd>
                        <p>
                            {!hasMeetingDates && firstMeeting === "" && (
                                <>
                                    Top ! On te propose très vite des dates, ou à défaut, une visio
                                    :)
                                </>
                            )}
                            {firstMeeting === "visio" && (
                                <>
                                    Top ! On te recontacte très vite avec des dates pour une visio
                                    avec 2 bénévoles et 2-3 autres personnes intéréssées comme toi
                                    :)
                                </>
                            )}
                            {hasMeetingDates && firstMeeting !== "" && (
                                <>
                                    Top ! On fait en sorte qu'il y ait assez de bénévoles
                                    expérimentés pour les nombreux curieux comme toi, donc pour ne
                                    pas gâcher leur temps on compte sur ta présence :)
                                </>
                            )}
                        </p>
                        <p>Si tu as un contre-temps, écris-nous à benevoles@parisestludique.fr</p>
                        <p>À très bientôt !</p>
                    </dd>
                </dl>
            )}

            <div
                className={classnames(
                    styles.inputWrapper,
                    !(firstMeeting === "" || firstMeeting === "visio") && styles.hidden
                )}
            >
                <div className={styles.commentWrapper}>
                    <textarea
                        name="commentFirstMeeting"
                        id="commentFirstMeeting"
                        className={styles.inputWrapper}
                        placeholder={
                            (hasMeetingDates && firstMeeting === ""
                                ? "Mince. Quelles dates t'arrangeraient ? Ou si c'est plus simple, quels jours sont à éviter ? Est-ce trop loin de chez toi ? Préfères-tu nous rencontrer en visio ?"
                                : "") +
                            (!hasMeetingDates && firstMeeting === ""
                                ? "As-tu des contraintes horaires les lundis ? Les mardis ?"
                                : "") +
                            (firstMeeting === "visio"
                                ? "As-tu des contraites en terme de jours de la semaine ? D'horaire ?"
                                : "")
                        }
                        value={commentFirstMeeting}
                        onChange={sendTextareaDispatch(setCommentFirstMeeting)}
                    />
                </div>
            </div>
        </>
    )

    const pelMember = enableRegistering && (
        <>
            <dl className={styles.registerIntro}>
                <dt>Association Paris est Ludique</dt>
                <dd>
                    <p>
                        Légalement il faut que le festival soit organisé par une structure, et c'est
                        l'association <i>Paris est Ludique !</i> qui s'en charge. Pour avoir un
                        droit de regard dessus, devenir bénévole à cette édition implique
                        automatiquement d'en devenir membre jusqu'à septembre prochain. Ça n'engage
                        à rien et c'est gratuit !
                    </p>
                </dd>
            </dl>
        </>
    )

    const nameMobileEmail = (
        <>
            <dl className={styles.registerIntro}>
                <dt>Quelques infos sur toi pour finir</dt>
            </dl>
            <div className={styles.inputWrapper}>
                <div className={styles.leftColTiny}>
                    <label htmlFor="firstname">Prénom</label>
                </div>
                <div className={styles.rightColLefter}>
                    <input
                        type="text"
                        id="firstname"
                        required
                        value={firstname}
                        onChange={sendTextDispatch(setFirstname)}
                    />
                </div>
            </div>
            <div className={styles.inputWrapper}>
                <div className={styles.leftColTiny}>
                    <label htmlFor="lastname">Nom</label>
                </div>
                <div className={styles.rightColLefter}>
                    <input
                        type="text"
                        id="lastname"
                        required
                        value={lastname}
                        onChange={sendTextDispatch(setLastname)}
                    />
                </div>
            </div>
            <div className={styles.inputWrapper}>
                <div className={styles.leftColTiny}>
                    <label htmlFor="email">Email</label>
                </div>
                <div className={styles.rightColLefter}>
                    <input
                        type="email"
                        id="email"
                        required
                        value={email}
                        onChange={sendTextDispatch(setEmail)}
                    />
                </div>
            </div>
            <div className={styles.inputWrapper}>
                <div className={styles.leftColTiny}>
                    <label htmlFor="mobile">Téléphone</label>
                </div>
                <div className={styles.rightColLefter}>
                    <input
                        type="text"
                        id="mobile"
                        required
                        value={mobile}
                        onChange={sendTextDispatch(setMobile)}
                    />
                </div>
            </div>
            <div className={styles.inputWrapper}>
                <div className={styles.leftCol}>
                    <div className={styles.multipleChoiceTitle}>
                        Par quel moyen fiable et rapide préfères-tu être contacté si on en a besoin
                        ?
                    </div>
                </div>
                <div className={styles.rightCol}>
                    <div className={styles.rightColContainer}>
                        {["WhatsApp", "Signal", "SMS", "Email", "Aucun"].map((option) => (
                            <label className={styles.shortAnswerLabel} key={option}>
                                <input
                                    type="radio"
                                    name="howToContact"
                                    value={option}
                                    onChange={sendRadioboxDispatch(setHowToContact)}
                                    checked={howToContact === option}
                                />{" "}
                                {option}
                            </label>
                        ))}
                    </div>
                </div>
            </div>
            {howToContact === "Aucun" && (
                <dl className={styles.registerIntro}>
                    <dd>
                        <p>
                            Aïe ça va poser problème, je suis désolé. Il faut qu'on puisse te
                            contacter par l'un des moyens de communication proposés.
                        </p>
                        <p>
                            Tu en connais un suffisamment répandu et meilleur que ceux proposés ?
                            Parle-nous en à benevoles@parisestludique.fr !!
                        </p>
                    </dd>
                </dl>
            )}
        </>
    )

    const submitButton = (
        <>
            <div className={styles.buttonWrapper}>
                <FormButton onClick={onSubmit}>Envoyer</FormButton>
            </div>
            <div className={styles.formReactions}>
                {sendingElement}
                {sendSuccess}
                {sendError}
            </div>
        </>
    )

    return (
        <>
            {intro}
            {enableRegistering && commentQuestion}
            {alreadySignupForm}
            {!alreadySignup && (
                <form>
                    {cameAsVisitor}
                    {meeting}
                    {pelMember}
                    {nameMobileEmail}
                    {!enableRegistering && commentQuestion}
                    {howToContact !== "Aucun" && submitButton}
                </form>
            )}
        </>
    )
}

export default memo(RegisterForm)

// Fetch server-side data here
export const fetchFor = [fetchMiscFestivalDateListIfNeed, fetchMiscMeetingDateListIfNeed]
