import { FC, memo, useCallback, useEffect, useRef, useState } from "react"
import classnames from "classnames"
import get from "lodash/get"
import set from "lodash/set"
import styles from "./styles.module.scss"
import {
    daysChoice,
    daysChoiceSelectionDefaultState,
    selectionChoices,
    useUserDayWishes,
} from "../daysWishes.utils"
import FormButton from "../../Form/FormButton/FormButton"

type Props = {
    afterSubmit?: () => void | undefined
}

const DayWishesForm: FC<Props> = ({ afterSubmit }): JSX.Element => {
    const [participationState, setParticipation] = useState("inconnu")
    const [selection, setSelection] = useState(daysChoiceSelectionDefaultState)
    const commentRef = useRef<HTMLTextAreaElement | null>(null)
    const [userWishes, saveWishes] = useUserDayWishes()

    const onParticipationChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setParticipation(e.target.value)

    useEffect(() => {
        if (!userWishes) return
        const participation = get(userWishes, "active", "inconnu")
        const newSelection = get(userWishes, "dayWishes", []).reduce(
            (acc: selectionChoices, day: string) => ({
                ...acc,
                [day]: true,
            }),
            daysChoice
        )
        setParticipation(participation)
        setSelection(newSelection)
        set(commentRef, "current.value", get(userWishes, "dayWishesComment", ""))
    }, [setParticipation, setSelection, commentRef, userWishes])

    const onChoiceClick = useCallback(
        (id) => {
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
        saveWishes(participationState, days, comment)
        if (afterSubmit) afterSubmit()
    }, [participationState, selection, commentRef, saveWishes, afterSubmit])

    return (
        <div>
            <div className={styles.title}>Mes jours de présence</div>
            <div className={classnames(styles.inputWrapper, styles.noBottomMargin)}>
                <div className={styles.leftCol}>
                    <div className={styles.participationTitle}>
                        Si les conditions sanitaires te le permettent, souhaites-tu être bénévole à
                        PeL 2022 ?
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
                    Si tu as besoin d&apos;infos, viens nous en parler sur le serveur Discord ! Pour
                    le rejoindre,{" "}
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
            <div className={styles.inputWrapper}>
                <div className={styles.leftCol}>
                    <div className={styles.dayWishesTitle}>
                        Quels jours viendras-tu ?<br />
                        (Minimum 2 jours dont l'un sera samedi ou dimanche, idéalement samedi{" "}
                        <b>et</b> dimanche ^^)
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
            <div className={styles.dayWishCommentWrapper}>
                <label htmlFor="day-choice-comment">Un commentaire, une précision ?</label>
                <textarea id="day-choice-comment" ref={commentRef} />
            </div>
            <div className={styles.dayWishesButtonWrapper}>
                <FormButton onClick={onChoiceSubmit}>Enregistrer</FormButton>{" "}
                <FormButton onClick={afterSubmit} type="grey">
                    Annuler
                </FormButton>
            </div>
        </div>
    )
}

DayWishesForm.defaultProps = {
    afterSubmit: undefined,
}

export default memo(DayWishesForm)
