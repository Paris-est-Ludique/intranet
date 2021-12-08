import { memo } from "react"
import { Link } from "react-router-dom"

import { Volunteer } from "../../services/volunteers"
import styles from "./styles.module.scss"

interface Props {
    items: Volunteer[]
}

const VolunteerList = ({ items }: Props) => (
    <div className={styles["user-list"]}>
        <h4>Volunteer List</h4>
        <ul>
            {items.map(({ id, lastname, firstname }) => (
                <li key={id}>
                    <Link to={`/Volunteer/${id}`}>
                        <b>{firstname}</b> {lastname}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
)

export default memo(VolunteerList)
