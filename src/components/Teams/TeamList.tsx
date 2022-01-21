import React, { memo } from "react"
import { useSelector } from "react-redux"
import styles from "./styles.module.scss"
import TeamItem from "./TeamItem"
import { selectTeamList } from "../../store/teamList"

const TeamList: React.FC = (): JSX.Element | null => {
    const teams = useSelector(selectTeamList)
    if (!teams || teams.length === 0) return null

    return (
        <ul className={styles.teamList}>
            {teams.map((team: any) => (
                <TeamItem team={team} key={team.id} />
            ))}
        </ul>
    )
}

export default memo(TeamList)
