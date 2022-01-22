import { FC, memo, useCallback, useState } from "react"
import classnames from "classnames"
import { daysChoice, daysChoiceSelectionDefaultState } from "./days.utils"
import styles from "./styles.module.scss"

const DayWishes: FC = (): JSX.Element | null => {
    const [selection, setSelection] = useState(daysChoiceSelectionDefaultState)
    const onChoiceClick = useCallback(
        (id) => {
            setSelection({
                ...selection,
                [id]: !selection[id],
            })
        },
        [selection, setSelection]
    )

    return (
        <ul className={styles.dayWishes}>
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
    )
}

export default memo(DayWishes)
