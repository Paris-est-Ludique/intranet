import { FC, memo } from "react"
import get from "lodash/get"
import styles from "./styles.module.scss"
import { getDayLabel, useUserDayWishes } from "../days.utils"

const DayWishes: FC = (): JSX.Element | null => {
    const [userWishes] = useUserDayWishes()
    const dayWishesString = get(userWishes, "dayWishes", []).map(getDayLabel).join(", ")
    const comment = get(userWishes, "dayWishesComment", "")

    return (
        <div className={styles.dayWishes}>
            <div className={styles.daysLine}>
                <span className={styles.dayLineTitle}>Mes jours de présence :</span>
                {dayWishesString && <span>{dayWishesString}</span>}
                {!dayWishesString && <span>Non renseignés</span>}
            </div>
            {comment && (
                <div className={styles.commentLine}>
                    <span className={styles.commentLineTitle}>Mon commentaire :</span>
                    <span className={styles.commentLineText}>
                        {get(userWishes, "dayWishesComment", "")}
                    </span>
                </div>
            )}
            <div className={styles.editButton}>
                <button type="button">Modifier</button>
            </div>
        </div>
    )
}

export default memo(DayWishes)
