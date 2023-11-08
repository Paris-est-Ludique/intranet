import type { FC } from 'react'
import { memo, useCallback } from 'react'
import Modal from '../../Modal/Modal'
import PersonalInfoForm from './PersonalInfoForm'
import { MODAL_IDS, hideModal } from '@/store/ui'
import useAction from '@/utils/useAction'

const PersonalInfoFormModal: FC = (): JSX.Element => {
  const execHideModal = useAction(hideModal)
  const afterFormSubmit = useCallback(() => execHideModal(), [execHideModal])

  return (
    <Modal modalId={MODAL_IDS.PERSONALINFO}>
      <PersonalInfoForm afterSubmit={afterFormSubmit} />
    </Modal>
  )
}

export default memo(PersonalInfoFormModal)
