import { FC, memo } from "react"
import { useSelector } from "react-redux"
import { createSelector } from "@reduxjs/toolkit"
import { selectVolunteerList } from "../../store/volunteerList"
import { selectTeamList } from "../../store/teamList"

const selectTeamsWithVolunteersCandidates = createSelector(
    selectVolunteerList,
    selectTeamList,
    (volunteers, teams) =>
        teams.map(({ id, name }: any) => {
            const volunteersSelection = volunteers
                .filter((volunteer) => volunteer.teamWishes.includes(id))
                .map((volunteer) => ({
                    ...volunteer,
                    teamWishes: volunteer.teamWishes.map((wishId) => {
                        const matchingTeam = teams.find((team: any) => wishId === team?.id)
                        return matchingTeam?.name
                    }),
                }))
            return {
                id,
                name,
                volunteers: volunteersSelection,
            }
        })
)

type Props = {
    teamId: number
}

const TeamWithCandidates: FC<Props> = ({ teamId }): JSX.Element | null => {
    const teams = useSelector(selectTeamsWithVolunteersCandidates)
    const team = teams.find((t) => t.id === teamId)
    if (!team) return null

    return (
        <div>
            <div>
                Equipe {team.name} ({team.volunteers.length}) :
            </div>
            <ul>
                {team.volunteers.map(({ id, lastname, firstname, teamWishes }) => (
                    <li key={id}>
                        <b>
                            {firstname} {lastname}
                        </b>{" "}
                        : {teamWishes.join(", ")}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default memo(TeamWithCandidates)
