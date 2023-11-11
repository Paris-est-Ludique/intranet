import type { FC, ReactNode } from 'react'
import styles from './styles.module.scss'
import { toastError } from '@/utils/toast'

interface Props {
  type?: 'grey'
  disabled?: boolean
  children: ReactNode
  onClick?: () => void
}

const FormButton: FC<Props> = ({ type, disabled, children, onClick }): JSX.Element => {
  const onDisabledClick = () => toastError('Bouton désactivé')

  return (
    <button
      type="button"
      className={type === 'grey' || disabled ? styles.greyButton : styles.button}
      onClick={disabled ? onDisabledClick : onClick}
    >
      {children}
    </button>
  )
}

FormButton.defaultProps = {
  type: undefined,
  disabled: false,
  onClick: undefined,
}

export default FormButton
