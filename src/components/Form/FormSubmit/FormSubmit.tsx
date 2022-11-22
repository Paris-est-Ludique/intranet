/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, ReactNode } from "react"
import styles from "./styles.module.scss"

type Props = {
    children: ReactNode
    onClick?: (event: React.SyntheticEvent) => void
}

const FormSubmit: FC<Props> = ({ children, onClick }): JSX.Element => (
    <button type="button" className={styles.button} onClick={onClick} onTouchStart={onClick}>
        {children}
    </button>
)

FormSubmit.defaultProps = {
    onClick: undefined,
}

export default FormSubmit
