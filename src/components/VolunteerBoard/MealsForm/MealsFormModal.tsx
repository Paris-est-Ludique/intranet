import type { FC } from 'react'
import { memo, useCallback } from 'react'
import Modal from '../../Modal/Modal'
import MealsForm from './MealsForm'
import { MODAL_IDS, hideModal } from '@/store/ui'
import useAction from '@/utils/useAction'

const MealsFormModal: FC = (): JSX.Element => {
  const execHideModal = useAction(hideModal)
  const afterFormSubmit = useCallback(() => execHideModal(), [execHideModal])

  return (
    <Modal modalId={MODAL_IDS.MEALS}>
      <MealsForm afterSubmit={afterFormSubmit} />
    </Modal>
  )
}

export default memo(MealsFormModal)
