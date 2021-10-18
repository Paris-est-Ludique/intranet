import { memo } from "react"
// import { Link } from "react-router-dom"

import { JeuxJav } from "../../services/jeuxJav"
import styles from "./styles.module.scss"

interface Props {
    items: JeuxJav[]
}

const List = ({ items }: Props) => (
    <div className={styles.JeuxJavList}>
        <h4>Jeux JAV</h4>
        <ul>
            {items.map(({ id, titre, bggId }) => (
                <li key={id}>
                    {titre} - [{bggId}]
                </li>
            ))}
        </ul>
    </div>
)

export default memo(List)
