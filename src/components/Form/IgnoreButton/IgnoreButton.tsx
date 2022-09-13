import { FC, ReactNode, useState } from "react"
import styles from "./styles.module.scss"

type Props = {
    children?: ReactNode | undefined
    text: string
    onClick?: () => void
}

const FormButton: FC<Props> = ({ children, text, onClick }): JSX.Element => {
    const [doShowMessage, setDoShowMessage] = useState<boolean>(false)

    const showMessage = () => {
        setDoShowMessage(true)
    }
    const onIgnore = () => {
        setDoShowMessage(true)
        onClick?.()
    }
    const onCloseIgnore = () => {
        setDoShowMessage(false)
    }

    return (
        <>
            <button
                type="button"
                className={styles.greyButton}
                onClick={!children ? onClick : showMessage}
            >
                {text}
            </button>
            {doShowMessage && (
                <div className={styles.infoBeforeIgnore}>
                    <button type="button" className={styles.closeButton} onClick={onCloseIgnore}>
                        &#10005;
                    </button>
                    <div>{children}</div>
                    <button type="button" className={styles.greyButton} onClick={onIgnore}>
                        Vraiment passer au questionnaire suivant
                    </button>
                </div>
            )}
        </>
    )
}

FormButton.defaultProps = {
    children: undefined,
    onClick: undefined,
}

export default FormButton
