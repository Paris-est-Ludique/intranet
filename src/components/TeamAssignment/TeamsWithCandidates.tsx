import { FC, memo, useState } from "react"
import { useSelector } from "react-redux"
import { selectTeamList } from "../../store/teamList"
import TeamWithCandidates from "./TeamWithCandidates"
import styles from "./styles.module.scss"
import withUserRole from "../../utils/withUserRole"

const TeamsWithCandidates: FC = (): JSX.Element => {
    const teams = useSelector(selectTeamList)
    const [currentTeam, setCurrentTeam] = useState<number>(0)

    return (
        <div>
            <div>Cliquez sur l'équipe à gérer :</div>
            <ul className={styles.teamList}>
                {teams.map((team: any) => (
                    <li key={team.id} className={styles.teamListItem}>
                        <button type="button" onClick={() => setCurrentTeam(team.id)}>
                            {team.name}
                        </button>
                    </li>
                ))}
            </ul>
            {!!currentTeam && <TeamWithCandidates teamId={currentTeam} />}
        </div>
    )
}

export default withUserRole("répartiteur", memo(TeamsWithCandidates))
