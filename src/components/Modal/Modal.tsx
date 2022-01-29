import { FC, ReactNode, useCallback } from "react"
import RModal from "react-modal"
import { useSelector } from "react-redux"
import { reactAppId } from "../../app"
import styles from "./styles.module.scss"
import { hideModal, selectActiveModalId } from "../../store/ui"
import useAction from "../../utils/useAction"

type Props = {
    children: ReactNode
    modalId: string
}

RModal.setAppElement(`#${reactAppId}`)

const Modal: FC<Props> = ({ modalId, children }): JSX.Element => {
    const activeModalId = useSelector(selectActiveModalId)
    const execHideModal = useAction(hideModal)
    const onClose = useCallback(() => execHideModal(), [execHideModal])

    const modalIsActive = activeModalId === modalId

    return (
        <RModal
            isOpen={modalIsActive}
            className={styles.modalContent}
            overlayClassName={styles.modalOverlay}
            onRequestClose={onClose}
        >
            <button type="submit" className={styles.closeButton} onClick={onClose}>
                &#10005;
            </button>
            {children}
        </RModal>
    )
}

export default Modal
