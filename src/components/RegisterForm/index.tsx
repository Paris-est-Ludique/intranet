import { memo, useEffect, useState } from "react"
import { useSelector, shallowEqual } from "react-redux"
import { toast } from "react-toastify"
import _ from "lodash"
import classnames from "classnames"
import styles from "./styles.module.scss"

import { fetchPostulantAdd } from "../../store/postulantAdd"
import { AppDispatch, AppState } from "../../store"
import { fetchVolunteerPartialAdd } from "../../store/volunteerPartialAdd"
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
    fetchMiscMeetingDateListIfNeed,
    selectMiscMeetingDateList,
} from "../../store/miscMeetingDateList"

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
    const [potentialVolunteer, setPotentialVolunteer] = useState(true)
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [email, setEmail] = useState("")
    const [mobile, setMobile] = useState("")
    const [alreadyVolunteer, setAlreadyVolunteer] = useState(false)
    const [comment, setComment] = useState("")
    const [alreadyCame, setAlreadyCame] = useState(true)
    const [firstMeeting, setFirstMeeting] = useState("")
    const [commentFirstMeeting, setCommentFirstMeeting] = useState("")
    const [canHelpBefore, setCanHelpBefore] = useState("")
    const [pelMember, setPelMember] = useState(false)
    const [howToContact, setHowToContact] = useState("Email")
    const [sending, setSending] = useState(false)
    const [changingBackground, setChangingBackground] = useState(0)

    const meetingDateList = useSelector(selectMiscMeetingDateList)

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

        if (potentialVolunteer) {
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
        } else {
            dispatch(
                fetchVolunteerPartialAdd({
                    firstname,
                    lastname,
                    email,
                    mobile,
                    howToContact,
                    canHelpBefore,
                    pelMember,
                })
            )
            dispatch(
                fetchPostulantAdd({
                    potential: false,
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
        }

        setSending(true)
    }

    const { error: postulantError, entities: postulant } = useSelector(
        (state: AppState) => state.postulantAdd,
        shallowEqual
    )

    const { error: volunteerError, entities: volunteer } = useSelector(
        (state: AppState) => state.volunteerAdd,
        shallowEqual
    )

    let sendSuccess
    let sendError
    let sendingElement
    if (
        !postulantError &&
        !_.isEmpty(postulant) &&
        (potentialVolunteer || (!volunteerError && !_.isEmpty(volunteer)))
    ) {
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

    const intro = (
        <dl className={styles.registerIntro}>
            <dt>Qu&apos;est-ce que Paris est Ludique ?</dt>
            <dd>
                <p>
                    Un festival en plein air dédié aux <b>jeux de société modernes</b> sous toutes
                    leurs formes. Les samedi 2 et dimanche 3 juillet 2022 !
                </p>
                <p>
                    En 2019 lors de la dernière édition, ce sont <b>16 000</b> joueurs qui se sont
                    réunis sous 300 chapiteaux et 2 000 tables.
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
                    Pendant le festival de 2019, nous étions <b>187 bénévoles</b> organisés en
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
                    d'aider à la mise en place jeudi ou vendredi, ou au rangement le lundi, à la
                    place d'un des jours du weekend. Bref, chacun participe comme il peut mais deux
                    jours minimum !
                </p>
                <p>
                    Le samedi soir quand les visiteurs sont partis, nous prolongeons la fête en
                    dînant avec les exposants présents sur le festival. Le dimanche rebelote juste
                    entre bénévoles.
                </p>
                <div className={styles.beneImg}> </div>
            </dd>
            <dt>
                Si l&apos;expérience vous tente, remplissez le formulaire suivant pour devenir
                bénévole !<br />
                Vous pouvez aussi juste nous rencontrer avant de vous décider à devenir bénévole, on
                comprend qu&apos;un saut pareil dans l&apos;inconnu soit difficile.
                <br />
                Dans les deux cas, venez rencontrer une poignée d'entre nous dans un bar/resto près
                de Châtelet ! :) Sur inscription uniquement...
                <br />
            </dt>
        </dl>
    )

    const potentialVolunteerQuestion = (
        <div className={styles.inputWrapper}>
            <div className={styles.leftCol}>
                <div className={styles.multipleChoiceTitle}>Je veux devenir bénévole :</div>
            </div>
            <div className={styles.rightCol}>
                {["Tout de suite !", "Peut-être après une rencontre avec des bénévoles"].map(
                    (option) => (
                        <label className={styles.longAnswerLabel} key={option}>
                            <input
                                type="radio"
                                name="potentialVolunteer"
                                onChange={sendBooleanRadioboxDispatch(
                                    setPotentialVolunteer,
                                    option !== "Tout de suite !"
                                )}
                                checked={potentialVolunteer === (option !== "Tout de suite !")}
                            />{" "}
                            {option}
                        </label>
                    )
                )}
            </div>
        </div>
    )

    const alreadyVolunteerQuestion = !potentialVolunteer && (
        <>
            <div className={styles.inputWrapper}>
                <div className={styles.leftCol}>
                    <div className={styles.multipleChoiceTitle}>J'ai déjà été bénévole à PeL</div>
                </div>
                <div className={styles.rightCol}>
                    <div className={styles.rightColContainer}>
                        {["Oui", "Non"].map((option) => (
                            <label className={styles.shortAnswerLabel} key={option}>
                                <input
                                    type="radio"
                                    name="alreadyVolunteer"
                                    onChange={sendBooleanRadioboxDispatch(
                                        setAlreadyVolunteer,
                                        option === "Oui"
                                    )}
                                    checked={alreadyVolunteer === (option === "Oui")}
                                />{" "}
                                {option}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {alreadyVolunteer && (
                <dl className={styles.registerIntro}>
                    <dd>
                        <p>Dans ce cas pourquoi t'inscris-tu ici ? ^^</p>
                        <p>
                            Si tu te rappelles de l'email que tu avais utilisé à ta dernière
                            inscription sur le site Force Orange des bénévoles (même sur l'ancienne
                            version) tu peux{" "}
                            <a href="/sidentifier" target="_blank" rel="noreferrer">
                                t'identifier ici
                            </a>{" "}
                            avec ton ancien mot de passe, ou en{" "}
                            <a href="/sinscrire" target="_blank" rel="noreferrer">
                                demander un nouveau ici
                            </a>
                            .
                        </p>
                        <p>
                            Autrement, si tu as changé d'email, mieux vaut nous le communiquer à
                            benevoles@parisestludique.fr en précisant bien tes nom et prénom :)
                        </p>
                    </dd>
                </dl>
            )}
        </>
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

    const meeting = (
        <>
            <dl className={styles.registerIntro}>
                {!potentialVolunteer && <dt>Faisons connaissance !</dt>}
                {potentialVolunteer && (
                    <dt>Se rencontrer avant de se décider à devenir bénévole ?</dt>
                )}
                <dd>
                    <p>
                        On organise des rencontres entre de nouvelles personnes comme toi, et des
                        bénévoles suffisamment expérimentés pour te parler en détail du festival et
                        répondre à toutes tes questions liées au bénévolat ou au festival.
                    </p>
                    <p>
                        Ces rencontres ont lieu à 19h dans un bar/resto calme à Châtelet, le{" "}
                        <a
                            href="https://goo.gl/maps/N5NYWDF66vNQDFMh8"
                            id="sfmMap"
                            key="sfmMap"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Street Food Market
                        </a>
                        , ou à une soirée festive à 2 pas du lieu du festival, aux{" "}
                        <a
                            href="https://www.captainturtle.fr/aperos-petanque-paris/"
                            id="petanque"
                            key="petanque"
                            target="_blank"
                            rel="noreferrer"
                        >
                            apéros de la pétanque
                        </a>
                        .
                    </p>
                </dd>
            </dl>

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

            {firstMeeting !== "" && (
                <dl className={styles.registerIntro}>
                    <dd>
                        <p>
                            Top ! On fait en sorte qu'il y ait assez de bénévoles expérimentés pour
                            les nombreux curieux comme toi, donc pour ne pas gâcher leur temps on
                            compte sur ta présence :)
                        </p>
                        <p>Si tu as un contre-temps, écris-nous à benevoles@parisestludique.fr</p>
                        <p>À très bientôt !</p>
                    </dd>
                </dl>
            )}

            {firstMeeting === "" && (
                <div className={styles.inputWrapper}>
                    <div className={styles.commentWrapper}>
                        <textarea
                            name="commentFirstMeeting"
                            id="commentFirstMeeting"
                            className={styles.inputWrapper}
                            placeholder={
                                potentialVolunteer
                                    ? "Mince. Quelles dates t'arrangeraient ? Ou si c'est plus simple, quels jours sont à éviter ? Est-ce trop loin de chez toi ? Préfères-tu nous rencontrer en visio ?"
                                    : "Ce n'est pas obligé mais ça aurait été top ! Manques-tu de temps ? Préfères-tu une autre date ? Est-ce trop loin de chez toi ? Préfères-tu nous rencontrer en visio ?"
                            }
                            value={commentFirstMeeting}
                            onChange={sendTextareaDispatch(setCommentFirstMeeting)}
                        />
                    </div>
                </div>
            )}
        </>
    )

    const helpBefore = !potentialVolunteer && (
        <>
            <dl className={styles.registerIntro}>
                <dt>Bénévolat en amont du festival</dt>
                <dd>
                    <p>
                        En tant que bénévole, tu fais selon tes envies, tes disponibilités, ton
                        énergie. Si personne ne veut faire quelque chose de primordial pour le
                        festival, on paye quelqu'un de l'extérieur. Par exemple le transport+montage
                        des tentes+tables, ou la sécurité de nuit sont délégués à des prestataires.
                        Et si ce quelque chose n'est pas primordiale et que personne ne veut s'en
                        occuper, bah tant pis on le fait pas ^^
                    </p>
                    <p>
                        Après on essaye de faire plein de choses sans aide extérieure. Pour le
                        plaisir de collaborer à un projet entre bénévoles parfois devenus amis, pour
                        acquérir de nouvelles compétences, parce que chaque économie d'argent fait
                        baisser le prix d'entrée au festival et contribue à le rendre plus
                        accessible.
                    </p>
                </dd>
            </dl>
            <div className={styles.inputWrapper}>
                <div className={styles.leftCol}>
                    <div className={styles.multipleChoiceTitle}>
                        Bref, as-tu le temps et l'envie de voir si tu peux aider en amont du
                        festival ?
                    </div>
                </div>
                <div className={styles.rightCol}>
                    <div className={styles.rightColContainer}>
                        {[
                            { value: "oui", desc: "Oui" },
                            { value: "non", desc: "Non" },
                            { value: "", desc: "Ne sais pas" },
                        ].map((option) => (
                            <label className={styles.shortAnswerLabel} key={option.value}>
                                <input
                                    type="radio"
                                    name="canHelpBefore"
                                    value={option.value}
                                    onChange={sendRadioboxDispatch(setCanHelpBefore)}
                                    checked={canHelpBefore === option.value}
                                />{" "}
                                {option.desc}
                            </label>
                        ))}
                    </div>
                </div>
            </div>
            <dl className={styles.registerIntro}>
                <dd>
                    {canHelpBefore === "oui" && (
                        <p>
                            Génial ! Quand tu auras fini de t'inscrire et que tu seras identifié sur
                            le site, nous t'en parlerons plus en détail.
                        </p>
                    )}
                    {canHelpBefore === "non" && (
                        <p>
                            Aucun souci tu nous seras d'une aide précieuse le jour J c'est déjà
                            énorme !
                        </p>
                    )}
                    <p>
                        Si tu changes d'avis, il sera possible de revenir sur cette décision dans
                        ton profil sur le site.
                    </p>
                </dd>
            </dl>
        </>
    )

    const pelMemberQuestion = !potentialVolunteer && (
        <>
            <dl className={styles.registerIntro}>
                <dt>Association Paris est Ludique</dt>
                <dd>
                    <p>
                        Légalement il faut que le festival soit organisé par une structure, et c'est
                        l'association <i>Paris est Ludique !</i> qui s'en charge. Pour aider à
                        organiser bénévolement le festival il faut donc en faire partie. Ça n'engage
                        à rien et c'est gratuit, mais absolument nécessaire.
                    </p>
                </dd>
            </dl>
            <div className={styles.inputWrapper}>
                <div className={styles.leftCol}>
                    <div className={styles.multipleChoiceTitle}>
                        Acceptes-tu de devenir membre de l'association <i>Paris est Ludique !</i> ?
                    </div>
                </div>
                <div className={styles.rightCol}>
                    <div className={styles.rightColContainer}>
                        {["Oui", "Non"].map((option) => (
                            <label className={styles.shortAnswerLabel} key={option}>
                                <input
                                    type="radio"
                                    name="pelMember"
                                    onChange={sendBooleanRadioboxDispatch(
                                        setPelMember,
                                        option === "Oui"
                                    )}
                                    checked={pelMember === (option === "Oui")}
                                />{" "}
                                {option}
                            </label>
                        ))}
                    </div>
                </div>
            </div>
            {!pelMember && (
                <dl className={styles.registerIntro}>
                    <dd>
                        <p>
                            Tant que tu n'as pas accepté cette condition je suis désolé on ne peut
                            pas continuer.
                        </p>
                    </dd>
                </dl>
            )}
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
                        {["WhatsApp", "Signal", "SMS", "Email", "Appel", "Aucun"].map((option) => (
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
                <FormButton onClick={onSubmit} disabled={!potentialVolunteer && alreadyVolunteer}>
                    Envoyer
                </FormButton>
            </div>
            <div className={styles.formReactions}>
                {sendingElement}
                {sendSuccess}
                {sendError}
            </div>
        </>
    )

    return (
        <form>
            {intro}
            {potentialVolunteerQuestion}
            {alreadyVolunteerQuestion}

            {(potentialVolunteer || !alreadyVolunteer) && (
                <>
                    {commentQuestion}
                    {cameAsVisitor}
                    {meeting}
                    {helpBefore}
                    {pelMemberQuestion}
                    {(potentialVolunteer || pelMember) && (
                        <>
                            {nameMobileEmail}
                            {howToContact !== "Aucun" && submitButton}
                        </>
                    )}
                </>
            )}
        </form>
    )
}

export default memo(RegisterForm)

// Fetch server-side data here
export const fetchFor = [fetchMiscMeetingDateListIfNeed]
