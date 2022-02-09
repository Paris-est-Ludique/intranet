import { FC, memo, useCallback } from "react"
import get from "lodash/get"
import styles from "./styles.module.scss"
import { foodDefaultValue, useUserParticipationDetails } from "../participationDetails.utils"
import { displayModal, MODAL_IDS } from "../../../store/ui"
import useAction from "../../../utils/useAction"

type Props = {
    afterSubmit?: () => void | undefined
}

const ParticipationDetails: FC<Props> = (): JSX.Element | null => {
    const [participationDetails] = useUserParticipationDetails()
    const age = get(participationDetails, "age", "")
    const tShirtSize = get(participationDetails, "teeshirtSize", "")
    const food = get(participationDetails, "food", "")
    const execDisplayModal = useAction(displayModal)
    const onEdit = useCallback(
        () => execDisplayModal(MODAL_IDS.PARTICIPATIONDETAILS),
        [execDisplayModal]
    )

    return (
        <div className={styles.root}>
            <div className={styles.title}>Mes informations pour le festival</div>
            {!tShirtSize && <div className={styles.line}>J&apos;ai déjà 2 t-shirts.</div>}
            {tShirtSize && (
                <div className={styles.line}>
                    J&apos;ai besoin d&apos;un t-shirt ! (Taille <b>{tShirtSize}</b>)
                </div>
            )}
            <div className={styles.line}>
                Age : <b>{age || "?"} ans</b>.
            </div>
            <div className={styles.line}>
                Préférence alimentaire : <b>{food || foodDefaultValue}</b>
            </div>
            <div className={styles.editButton}>
                <button type="button" onClick={onEdit}>
                    Modifier
                </button>
            </div>
        </div>
    )
}

export default memo(ParticipationDetails)
