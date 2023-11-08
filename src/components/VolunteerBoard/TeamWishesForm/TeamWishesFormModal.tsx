import type { FC } from 'react'
import { memo, useCallback } from 'react'
import Modal from '../../Modal/Modal'
import TeamWishesForm from './TeamWishesForm'
import { MODAL_IDS, hideModal } from '@/store/ui'
import useAction from '@/utils/useAction'

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
