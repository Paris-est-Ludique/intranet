import { FC, ReactNode } from "react"
import styles from "./styles.module.scss"

type Props = {
    type?: "grey"
    children: ReactNode
    onClick?: () => void
}

const FormButton: FC<Props> = ({ type, children, onClick }): JSX.Element => (
    <button
        type="button"
        className={type === "grey" ? styles.greyButton : styles.button}
        onClick={onClick}
    >
        {children}
    </button>
)

FormButton.defaultProps = {
    type: undefined,
    onClick: undefined,
}

export default FormButton
