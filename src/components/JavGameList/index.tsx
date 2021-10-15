import { memo } from "react"
import { Link } from "react-router-dom"

import { JavGame } from "../../services/javGames"
import styles from "./styles.module.scss"

interface Props {
    items: JavGame[]
}

const List = ({ items }: Props) => (
    <div className={styles.JavGameList}>
        <h4>JAV Games</h4>
        <ul>
            {items.map(({ id, titre }) => (
                <li key={id}>
                    <Link to={`/UserInfo/${id}`}>{titre}</Link>
                </li>
            ))}
        </ul>
    </div>
)

export default memo(List)
