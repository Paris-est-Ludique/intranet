import React, { memo } from "react"
import styles from "./styles.module.scss"
import { Team } from "../../services/teams"

interface Props {
    team: Team
}

const TeamItem: React.FC<Props> = ({ team }): JSX.Element => {
    const { name, description } = team
    return (
        <li className={styles.teamItem}>
            <div className={styles.teamName}>{name}</div>
            <div className={styles.teamDescription}>{description}</div>
        </li>
    )
}

export default memo(TeamItem)
