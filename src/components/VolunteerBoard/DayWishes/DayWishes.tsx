import { FC, memo, useCallback } from "react"
import get from "lodash/get"
import styles from "./styles.module.scss"
import { getDayLabel, useUserDayWishes } from "../daysWishes.utils"
import useAction from "../../../utils/useAction"
import { displayModal, MODAL_IDS } from "../../../store/ui"

const DayWishes: FC = (): JSX.Element | null => {
    const [userWishes] = useUserDayWishes()
    const participation = get(userWishes, "active", "inconnu")
    const dayWishesString = get(userWishes, "dayWishes", []).map(getDayLabel).join(", ")
    const comment = get(userWishes, "dayWishesComment", "")
    const execDisplayModal = useAction(displayModal)
    const onEdit = useCallback(() => execDisplayModal(MODAL_IDS.DAYWISHES), [execDisplayModal])

    return (
        <div className={styles.dayWishes}>
            <div className={styles.title}>Mes présences</div>
            {participation === "non" && (
                <div className={styles.participationLabel}>
                    Je <b>ne participerai pas</b> à PeL 2023 :(
                </div>
            )}
            {participation === "oui" && (
                <div className={styles.participationLabel}>
                    Je <b className={styles.yesParticipation}>participerai</b> à PeL 2023 !
                </div>
            )}
            {participation === "peut-etre" && (
                <div className={styles.participationLabel}>
                    Je <b>ne sais pas encore</b> si je participerai à PeL 2023
                </div>
            )}
            {participation === "inconnu" && (
                <div className={styles.lineEmpty}>
                    Participation à PeL 2023{" "}
                    <span className={styles.lineEmpty}>non renseignées</span>
                </div>
            )}

            {participation !== "non" && (
                <div className={styles.daysLine}>
                    <span className={styles.dayLineTitle}>Mes jours :</span>
                    {dayWishesString && <b>{dayWishesString}</b>}
                    {!dayWishesString && <span className={styles.lineEmpty}>Non renseignés</span>}
                </div>
            )}
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
