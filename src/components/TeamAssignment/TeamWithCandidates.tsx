import { FC, memo, useCallback } from "react"
import { useSelector } from "react-redux"
import { createSelector } from "@reduxjs/toolkit"
import classnames from "classnames"
import { selectVolunteerList } from "../../store/volunteerList"
import { selectTeamList } from "../../store/teamList"
import styles from "./styles.module.scss"
import { useTeamAssign } from "./teamAssign.utils"

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
                        return {
                            id: matchingTeam?.id,
                            name: matchingTeam?.name,
                        }
                    }),
                }))
            return {
                id,
                name,
                volunteers: volunteersSelection,
            }
        })
)

type PropsDaysDisplay = {
    dayWishes: string[]
}

const DaysDisplay: FC<PropsDaysDisplay> = ({ dayWishes }): JSX.Element => (
    <span className={styles.daysDisplay}>
        {dayWishes.map((day) =>
            day === "S" || day === "D" ? (
                <strong key={day}>{day}</strong>
            ) : (
                <span key={day}>{day}</span>
            )
        )}
    </span>
)

type Props = {
    teamId: number
}

const TeamWithCandidates: FC<Props> = ({ teamId }): JSX.Element | null => {
    const teams = useSelector(selectTeamsWithVolunteersCandidates)
    const team = teams.find((t) => t.id === teamId)
    const [, saveTeam] = useTeamAssign()

    const onTeamSelected = useCallback(
        (volunteerId, selectedTeamId) => {
            saveTeam(volunteerId, selectedTeamId)
        },
        [saveTeam]
    )

    if (!team) return null

    return (
        <div>
            <div>
                Equipe {team.name} ({team.volunteers.length}) :
            </div>
            <ul>
                {team.volunteers.map(({ id, lastname, firstname, teamWishes, dayWishes }) => (
                    <li key={id}>
                        <span className={styles.volunteerName}>
                            {firstname} {lastname} (<DaysDisplay dayWishes={dayWishes} />)
                        </span>
                        {teamWishes.map((teamWish) => {
                            const active = false
                            return (
                                <button
                                    key={teamWish.id}
                                    type="button"
                                    onClick={() => onTeamSelected(id, teamWish.id)}
                                    className={classnames(
                                        styles.teamWishButton,
                                        active && styles.teamActive
                                    )}
                                >
                                    {teamWish.name}
                                </button>
                            )
                        })}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default memo(TeamWithCandidates)
