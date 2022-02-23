import { FC, ReactNode } from "react"
import styles from "./styles.module.scss"

type Props = {
    children: ReactNode
    onClick?: () => void | undefined
}

const FormButton: FC<Props> = ({ children, onClick }): JSX.Element => (
    <button type="button" className={styles.button} onClick={onClick}>
        {children}
    </button>
)

FormButton.defaultProps = {
    onClick: undefined,
}

export default FormButton
