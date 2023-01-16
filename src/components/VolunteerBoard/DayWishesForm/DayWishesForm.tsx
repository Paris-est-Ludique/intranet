import { FC, memo, ReactNode, useCallback, useEffect, useRef, useState } from "react"
import _ from "lodash"
import { useSelector } from "react-redux"
import classnames from "classnames"
import get from "lodash/get"
import set from "lodash/set"
import styles from "./styles.module.scss"
import {
    daysChoice,
    daysChoiceSelectionDefaultState,
    SelectionChoices,
    useUserDayWishes,
} from "../daysWishes.utils"
import FormButton from "../../Form/FormButton/FormButton"
import { fetchVolunteerDayWishesSetIfNeed } from "../../../store/volunteerDayWishesSet"
import IgnoreButton from "../../Form/IgnoreButton/IgnoreButton"
import {
    fetchMiscDiscordInvitationIfNeed,
    selectMiscDiscordInvitation,
} from "../../../store/miscDiscordInvitation"
import {
    fetchMiscFestivalDateListIfNeed,
    selectMiscFestivalDateList,
} from "../../../store/miscFestivalDateList"

type Props = {
    children?: ReactNode | undefined
    afterSubmit?: () => void | undefined
}

const DayWishesForm: FC<Props> = ({ children, afterSubmit }): JSX.Element => {
    const [charterState, setCharter] = useState(false)
    const [participationState, setParticipation] = useState("inconnu")
    const [selection, setSelection] = useState(daysChoiceSelectionDefaultState)
    const commentRef = useRef<HTMLTextAreaElement | null>(null)
    const [userWishes, saveWishes] = useUserDayWishes()
    const discordInvitation = useSelector(selectMiscDiscordInvitation)
    const festivalDateList = useSelector(selectMiscFestivalDateList)

    const onCharteChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setCharter(e.target.value === "oui")
    const onParticipationChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setParticipation(e.target.value)

    const festivalShortDate = _.find(festivalDateList, { id: 2 })?.date

    useEffect(() => {
        if (!userWishes) return
        const charter = get(userWishes, "charter", false)
        const participation = get(userWishes, "active", "inconnu")
        const dayWishes = get(userWishes, "dayWishes", []) as string[]
        const newSelection = dayWishes.reduce(
            (acc: SelectionChoices, day: string) => ({
                ...acc,
                [day]: true,
            }),
            {} as SelectionChoices
        )
        setCharter(charter)
        setParticipation(participation)
        setSelection(newSelection)
        set(commentRef, "current.value", get(userWishes, "dayWishesComment", ""))
    }, [setParticipation, setSelection, commentRef, userWishes])

    const onChoiceClick = useCallback(
        (id: string) => {
            setSelection({
                ...selection,
                [id]: !selection[id],
            })
        },
        [selection, setSelection]
    )
    const onChoiceSubmit = useCallback(() => {
        const comment = get(commentRef, "current.value", "")
        const days = daysChoice.map(({ id }) => id).filter((id) => selection[id])
        saveWishes(charterState, participationState, days, comment)
        if (afterSubmit) afterSubmit()
    }, [saveWishes, charterState, participationState, afterSubmit, selection])

    return (
        <div>
            <div className={styles.title}>Mon engagement</div>
            <div className={classnames(styles.inputWrapper, styles.noBottomMargin)}>
                <div className={styles.oneCol}>
                    En tant que bénévole, il n’existe <b>aucun lien de subordination</b> entre
                    l’association et toi.
                    <br />
                    Il n'y a <b>pas de rémunération</b>, mais il est attendu que tu sois :<br />
                    <b>Accueillant et sincère</b> avec les autres bénévoles comme avec les visiteurs
                    et les exposants;
                    <br />
                    <b>Humble et à l’écoute</b> pour permettre le travail en équipe et la
                    collaboration;
                    <br />
                    <b>Neutre et tolérant</b> politiquement et religieusement pour éviter la
                    discorde.
                    <br />
                </div>
            </div>
            <div className={classnames(styles.inputWrapper, styles.noBottomMargin)}>
                <div className={styles.leftCol}>
                    <div className={styles.charteTitle}>
                        Acceptes-tu de respecter cette charte ?
                    </div>
                </div>
                <div className={styles.rightCol}>
                    <label className={styles.charteLabel}>
                        <input
                            type="radio"
                            value="oui"
                            name="charte"
                            onChange={onCharteChange}
                            checked={charterState}
                        />{" "}
                        Oui
                    </label>
                    <label className={styles.charteLabel}>
                        <input
                            type="radio"
                            value="non"
                            name="charte"
                            onChange={onCharteChange}
                            checked={!charterState}
                        />{" "}
                        Non
                    </label>
                </div>
            </div>
            {charterState ? (
                <>
                    <div className={classnames(styles.inputWrapper, styles.noBottomMargin)}>
                        <div className={styles.leftCol}>
                            <div className={styles.participationTitle}>
                                Souhaites-tu être bénévole à PeL{" "}
                                {festivalShortDate && `les ${festivalShortDate}`} ?
                            </div>
                        </div>
                        <div className={styles.rightCol}>
                            <label className={styles.participationLabel}>
                                <input
                                    type="radio"
                                    value="oui"
                                    name="participation"
                                    onChange={onParticipationChange}
                                    checked={participationState === "oui"}
                                />{" "}
                                Oui
                            </label>
                            <label className={styles.participationLabel}>
                                <input
                                    type="radio"
                                    value="non"
                                    name="participation"
                                    onChange={onParticipationChange}
                                    checked={participationState === "non"}
                                />{" "}
                                Non
                            </label>
                            <label className={styles.participationLabel}>
                                <input
                                    type="radio"
                                    value="peut-etre"
                                    name="participation"
                                    onChange={onParticipationChange}
                                    checked={participationState === "peut-etre"}
                                />{" "}
                                Je ne sais pas encore
                            </label>
                        </div>
                    </div>
                    {participationState === "peut-etre" ? (
                        <div>
                            On te le reproposera dans quelques temps.
                            <br />
                            Si tu as besoin d&apos;infos, viens nous en parler sur le serveur
                            Discord ! Pour le rejoindre,{" "}
                            <a href={discordInvitation} target="_blank" rel="noreferrer">
                                clique ici{" "}
                            </a>
                            .
                        </div>
                    ) : null}
                    <div className={styles.inputWrapper}>
                        <div className={styles.leftCol}>
                            <div className={styles.dayWishesTitle}>
                                Quels jours viendras-tu ?<br />
                                (Minimum 2 jours dont l'un sera samedi ou dimanche, idéalement
                                samedi <b>et</b> dimanche ^^)
                            </div>
                        </div>
                        <div className={styles.rightCol}>
                            <ul className={styles.dayWishesList}>
                                {daysChoice.map(({ id, label }) => (
                                    <li key={id} className={styles.dayWishesItem}>
                                        <button
                                            type="button"
                                            onClick={() => onChoiceClick(id)}
                                            className={classnames(
                                                styles.dayWishesButton,
                                                selection[id] && styles.active
                                            )}
                                        >
                                            {label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </>
            ) : null}
            <div className={styles.dayWishCommentWrapper}>
                <label htmlFor="day-choice-comment">Un commentaire, une précision ?</label>
                <textarea id="day-choice-comment" ref={commentRef} />
            </div>
            <div className={styles.buttonWrapper}>
                <FormButton onClick={onChoiceSubmit}>Enregistrer</FormButton>
                {children === undefined && (
                    <>
                        {" "}
                        <FormButton onClick={afterSubmit} type="grey">
                            Annuler
                        </FormButton>{" "}
                    </>
                )}
                {children !== undefined && (
                    <>
                        {" "}
                        <IgnoreButton onClick={afterSubmit} text="Ignorer pour l'instant">
                            {children}
                        </IgnoreButton>{" "}
                    </>
                )}
            </div>
        </div>
    )
}

DayWishesForm.defaultProps = {
    children: undefined,
    afterSubmit: undefined,
}

export default memo(DayWishesForm)

// Fetch server-side data here
export const fetchFor = [
    fetchVolunteerDayWishesSetIfNeed,
    fetchMiscDiscordInvitationIfNeed,
    fetchMiscFestivalDateListIfNeed,
]
