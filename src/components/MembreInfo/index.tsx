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
            <li>Prénom: {item.prenom}</li>
            <li>Nom: {item.nom}</li>
        </ul>
    </div>
)

export default memo(MembreInfo)
