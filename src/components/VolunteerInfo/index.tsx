import { memo } from "react"

import { Volunteer } from "../../services/volunteers"
import styles from "./styles.module.scss"

interface Props {
    item: Volunteer
}

const VolunteerInfo = ({ item }: Props) => (
    <div className={styles.VolunteerCard}>
        <h4>Volunteer Info</h4>
        <ul>
            <li>Prénom: {item.firstname}</li>
            <li>Nom: {item.lastname}</li>
        </ul>
    </div>
)

export default memo(VolunteerInfo)
