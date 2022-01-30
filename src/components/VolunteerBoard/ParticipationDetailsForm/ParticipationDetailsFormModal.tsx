import { FC, memo, useCallback } from "react"
import { hideModal, MODAL_IDS } from "../../../store/ui"
import Modal from "../../Modal/Modal"
import useAction from "../../../utils/useAction"
import ParticipationDetailsForm from "./ParticipationDetailsForm"

const ParticipationDetailsFormModal: FC = (): JSX.Element => {
    const execHideModal = useAction(hideModal)
    const afterFormSubmit = useCallback(() => execHideModal(), [execHideModal])

    return (
        <Modal modalId={MODAL_IDS.PARTICIPATIONDETAILS}>
            <ParticipationDetailsForm afterSubmit={afterFormSubmit} />
        </Modal>
    )
}

export default memo(ParticipationDetailsFormModal)
