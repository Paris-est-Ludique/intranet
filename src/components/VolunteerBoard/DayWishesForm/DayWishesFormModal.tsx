import type { FC } from 'react'
import { memo, useCallback } from 'react'
import Modal from '../../Modal/Modal'
import DayWishesForm from './DayWishesForm'
import { MODAL_IDS, hideModal } from '@/store/ui'
import useAction from '@/utils/useAction'

const DayWishesFormModal: FC = (): JSX.Element => {
  const execHideModal = useAction(hideModal)
  const afterFormSubmit = useCallback(() => execHideModal(), [execHideModal])

  return (
    <Modal modalId={MODAL_IDS.DAYWISHES}>
      <DayWishesForm afterSubmit={afterFormSubmit} />
    </Modal>
  )
}

export default memo(DayWishesFormModal)
