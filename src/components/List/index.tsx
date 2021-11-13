import { memo } from "react"
import { Link } from "react-router-dom"

import { User } from "../../services/jsonPlaceholder"
import styles from "./styles.module.scss"

interface Props {
    items: User[]
}

const List = ({ items }: Props) => (
    <div className={styles.UserList}>
        <h4>User List</h4>
        <ul>
            {items.map(({ membreId, name }) => (
                <li key={membreId}>
                    <Link to={`/UserInfo/${membreId}`}>{name}</Link>
                </li>
            ))}
        </ul>
    </div>
)

export default memo(List)
