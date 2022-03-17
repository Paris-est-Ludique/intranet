import { FC, memo, useCallback } from "react"
import get from "lodash/get"
import styles from "./styles.module.scss"
import { getDayLabel, useUserDayWishes } from "../daysWishes.utils"
import useAction from "../../../utils/useAction"
import { displayModal, MODAL_IDS } from "../../../store/ui"

const DayWishes: FC = (): JSX.Element | null => {
    const [userWishes] = useUserDayWishes()
    const dayWishesString = get(userWishes, "dayWishes", []).map(getDayLabel).join(", ")
    const comment = get(userWishes, "dayWishesComment", "")
    const execDisplayModal = useAction(displayModal)
    const onEdit = useCallback(() => execDisplayModal(MODAL_IDS.DAYWISHES), [execDisplayModal])

    return (
        <div className={styles.dayWishes}>
            <div className={styles.title}>Mes présences</div>
            <div className={styles.daysLine}>
                <span className={styles.dayLineTitle}>Mes jours :</span>
                {dayWishesString && <b>{dayWishesString}</b>}
                {!dayWishesString && <span className={styles.dayLineEmpty}>Non renseignés</span>}
            </div>
            {comment && (
                <div className={styles.commentLine}>
                    <span className={styles.commentLineTitle}>Mon commentaire :</span>
                    <span className={styles.commentLineText}>{comment}</span>
                </div>
            )}
            <div className={styles.editButton}>
                <button type="button" onClick={onEdit}>
                    Modifier
                </button>
            </div>
        </div>
    )
}

export default memo(DayWishes)
