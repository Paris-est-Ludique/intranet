import { FC, ReactNode } from "react"
import styles from "./styles.module.scss"

type Props = {
    children: ReactNode
}

const FormSubmit: FC<Props> = ({ children }): JSX.Element => (
    <button type="submit" className={styles.button}>
        {children}
    </button>
)

export default FormSubmit
