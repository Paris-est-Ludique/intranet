import { FC, memo, useCallback } from "react"
import get from "lodash/get"
import styles from "./styles.module.scss"
import { useUserHosting } from "../hosting.utils"
import useAction from "../../../utils/useAction"
import { displayModal, MODAL_IDS } from "../../../store/ui"

const Hosting: FC = (): JSX.Element | null => {
    const [userWishes] = useUserHosting()
    const needsHosting = get(userWishes, "needsHosting", false)
    const canHostCount = get(userWishes, "canHostCount", 0)
    const distanceToFestival = get(userWishes, "distanceToFestival", 0)
    const comment = get(userWishes, "hostingComment", "")
    const execDisplayModal = useAction(displayModal)
    const onEdit = useCallback(() => execDisplayModal(MODAL_IDS.HOSTING), [execDisplayModal])

    return (
        <div className={styles.hosting}>
            <div className={styles.title}>Mon hébergement</div>
            {!needsHosting && (
                <div className={styles.hostingLabel}>
                    Je n'ai pas besoin d'un hébergement proche du festival
                </div>
            )}
            {needsHosting && (
                <div className={styles.hostingLabel}>
                    J'ai <b>besoin</b> d'un hébergement proche du festival
                </div>
            )}
            {canHostCount === 0 && distanceToFestival === 0 && (
                <div className={styles.hostingLabel}>
                    Je ne peux héberger personnes de manière utile.
                </div>
            )}
            {canHostCount > 0 && (
                <div className={styles.hostingLabel}>
                    Je peux héberger <b>{canHostCount} personnes</b> !
                </div>
            )}
            {distanceToFestival > 0 && (
                <div className={styles.hostingLabel}>
                    Je suis à <b>{distanceToFestival} minutes</b> du festival
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

export default memo(Hosting)
