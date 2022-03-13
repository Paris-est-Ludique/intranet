import { FC, memo } from "react"
import styles from "./styles.module.scss"

const VolunteerConfirmation: FC = (): JSX.Element => (
    <div className={styles.root}>&#10003; Tu es bénévole pour le festival de 2022. Merci !</div>
)

export default memo(VolunteerConfirmation)
