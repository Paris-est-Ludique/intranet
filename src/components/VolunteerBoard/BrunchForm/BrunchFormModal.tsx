import type { FC } from 'react'
import { memo, useCallback } from 'react'
import Modal from '../../Modal/Modal'
import BrunchForm from './BrunchForm'
import { MODAL_IDS, hideModal } from '@/store/ui'
import useAction from '@/utils/useAction'

const BrunchFormModal: FC = (): JSX.Element => {
  const execHideModal = useAction(hideModal)
  const afterFormSubmit = useCallback(() => execHideModal(), [execHideModal])

  return (
    <Modal modalId={MODAL_IDS.BRUNCH}>
      <BrunchForm afterSubmit={afterFormSubmit} />
    </Modal>
  )
}

export default memo(BrunchFormModal)
