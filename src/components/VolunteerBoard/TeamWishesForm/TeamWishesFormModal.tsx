import { FC, memo, useCallback } from "react"
import { hideModal, MODAL_IDS } from "../../../store/ui"
import Modal from "../../Modal/Modal"
import useAction from "../../../utils/useAction"
import TeamWishesForm from "./TeamWishesForm"

const TeamWishesFormModal: FC = (): JSX.Element => {
    const execHideModal = useAction(hideModal)
    const afterFormSubmit = useCallback(() => execHideModal(), [execHideModal])

    return (
        <Modal modalId={MODAL_IDS.TEAMWISHES}>
            <TeamWishesForm afterSubmit={afterFormSubmit} />
        </Modal>
    )
}

export default memo(TeamWishesFormModal)
