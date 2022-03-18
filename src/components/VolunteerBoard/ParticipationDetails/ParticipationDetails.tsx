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
    const adult = get(participationDetails, "adult", "")
    const tshirtSize = get(participationDetails, "tshirtSize", "")
    const tshirtCount = get(participationDetails, "tshirtCount", "")
    const food = get(participationDetails, "food", "")
    const execDisplayModal = useAction(displayModal)
    const onEdit = useCallback(
        () => execDisplayModal(MODAL_IDS.PARTICIPATIONDETAILS),
        [execDisplayModal]
    )

    return (
        <div className={styles.root}>
            <div className={styles.title}>Mes infos logistiques</div>
            {tshirtCount === 0 && (
                <div className={styles.line}>
                    Je n'ai <b>aucun t-shirt</b> et je suis taillé·e <b>{tshirtSize}</b>
                </div>
            )}
            {tshirtCount === 1 && (
                <div className={styles.line}>
                    J'ai <b>un seul t-shirt</b> et je suis taillé·e <b>{tshirtSize}</b>
                </div>
            )}
            {tshirtCount === 2 && (
                <div className={styles.line}>
                    J'ai au moins <b>deux t-shirts</b>
                </div>
            )}
            {adult === 0 && (
                <div className={styles.line}>
                    Le 2 juillet 2022, je serai <b>mineur·e</b>
                </div>
            )}
            {adult === 1 && (
                <div className={styles.line}>
                    Le 2 juillet 2022, je serai <b>majeur·e</b>
                </div>
            )}
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
