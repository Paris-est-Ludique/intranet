import { FC, memo, useCallback } from "react"
import get from "lodash/get"
import styles from "./styles.module.scss"
import { useUserParticipationDetails } from "../participationDetails.utils"
import { displayModal, MODAL_IDS } from "../../../store/ui"
import useAction from "../../../utils/useAction"

type Props = {
    afterSubmit?: () => void | undefined
}

const ParticipationDetails: FC<Props> = (): JSX.Element | null => {
    const [participationDetails] = useUserParticipationDetails()
    const adult = get(participationDetails, "adult", "")
    const tshirtSize = get(participationDetails, "tshirtSize", "")
    const execDisplayModal = useAction(displayModal)
    const onEdit = useCallback(
        () => execDisplayModal(MODAL_IDS.PARTICIPATIONDETAILS),
        [execDisplayModal]
    )

    return (
        <div className={styles.root}>
            <div className={styles.title}>Mes infos logistiques</div>
            {adult === 0 && (
                <div className={styles.line}>
                    Le 1er juillet 2023, je serai <b>mineur·e</b>
                    <br />
                    Attention les bénévoles mineurs doivent être dans la même équipe que leur
                    responsable légal !
                </div>
            )}
            {adult === 1 && (
                <div className={styles.line}>
                    Le 1er juillet 2023, je serai <b>majeur·e</b>
                </div>
            )}

            <div className={styles.line}>
                {tshirtSize === "" && <>Je n'ai pas encore choisi de tee-shirt.</>}
                {tshirtSize === "Aucun" && <>Je n'ai pas besoin de tee-shirt cette année.</>}
                {tshirtSize !== "" && tshirtSize !== "Aucun" && (
                    <>
                        J'aimerai un teeshirt <b>{tshirtSize}</b>.
                    </>
                )}
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
