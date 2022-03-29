import { memo } from "react"

import { Volunteer } from "../../services/volunteers"
import styles from "./styles.module.scss"

interface Props {
    items: Volunteer[]
}

const VolunteerList = ({ items }: Props) => (
    <div className={styles.VolunteerList}>
        <h4>Volunteer List</h4>
        <ul>
            {items.map(({ id, lastname, firstname }) => (
                <li key={id}>
                    <a href={`/Volunteer/${id}`}>
                        <b>{firstname}</b> {lastname}
                    </a>
                </li>
            ))}
        </ul>
    </div>
)

export default memo(VolunteerList)
