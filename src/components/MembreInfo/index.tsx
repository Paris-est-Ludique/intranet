import { memo } from "react"

import { Membre } from "../../services/membres"
import styles from "./styles.module.scss"

interface Props {
    item: Membre
}

const MembreInfo = ({ item }: Props) => (
    <div className={styles.MembreCard}>
        <h4>Membre Info</h4>
        <ul>
            <li>Prénom: {item.firstname}</li>
            <li>Nom: {item.lastname}</li>
        </ul>
    </div>
)

export default memo(MembreInfo)
