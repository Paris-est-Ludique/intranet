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

type Props = {
    afterSubmit?: () => void | undefined
}

const DayWishesForm: FC<Props> = ({ afterSubmit }): JSX.Element => {
    const [selection, setSelection] = useState(daysChoiceSelectionDefaultState)
    const commentRef = useRef<HTMLTextAreaElement | null>(null)
    const [userWishes, saveWishes] = useUserDayWishes()

    useEffect(() => {
        if (!userWishes) return
        const newSelection = get(userWishes, "dayWishes", []).reduce(
            (acc: selectionChoices, day: string) => ({
                ...acc,
                [day]: true,
            }),
            daysChoice
        )
        setSelection(newSelection)
        set(commentRef, "current.value", get(userWishes, "dayWishesComment", ""))
    }, [setSelection, commentRef, userWishes])

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
        saveWishes(days, comment)
        if (afterSubmit) afterSubmit()
    }, [selection, commentRef, saveWishes, afterSubmit])

    return (
        <div className={styles.dayWishesForm}>
            <div className={styles.dayWishesTitle}>Mes jours de présence</div>
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
            <div className={styles.dayWishCommentWrapper}>
                <label htmlFor="day-choice-comment">Un commentaire, une précision ?</label>
                <textarea id="day-choice-comment" ref={commentRef} />
            </div>
            <div className={styles.dayWishesButtonWrapper}>
                <button type="submit" onClick={onChoiceSubmit}>
                    Enregistrer
                </button>
            </div>
        </div>
    )
}

DayWishesForm.defaultProps = {
    afterSubmit: undefined,
}

export default memo(DayWishesForm)
