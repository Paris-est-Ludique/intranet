import { memo } from "react"
import { Link } from "react-router-dom"

import { Membre } from "../../services/membres"
import styles from "./styles.module.scss"

interface Props {
    items: Membre[]
}

const MembreList = ({ items }: Props) => (
    <div className={styles.MembreList}>
        <h4>Membre List</h4>
        <ul>
            {items.map(({ id, nom, prenom }) => (
                <li key={id}>
                    <Link to={`/Membre/${id}`}>
                        <b>{prenom}</b> {nom}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
)

export default memo(MembreList)
