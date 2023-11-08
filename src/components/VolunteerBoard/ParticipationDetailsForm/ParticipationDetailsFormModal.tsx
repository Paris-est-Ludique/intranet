import type { FC } from 'react'
import { memo, useCallback } from 'react'
import Modal from '../../Modal/Modal'
import ParticipationDetailsForm from './ParticipationDetailsForm'
import { MODAL_IDS, hideModal } from '@/store/ui'
import useAction from '@/utils/useAction'

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
