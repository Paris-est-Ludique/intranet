import { FC, memo, useCallback } from "react"
import { useSelector } from "react-redux"
import { createSelector } from "@reduxjs/toolkit"
import classnames from "classnames"
import { selectVolunteerListAlphaSorted } from "../../store/volunteerList"
import { selectTeamList } from "../../store/teamList"
import styles from "./styles.module.scss"
import { useTeamAssign } from "./teamAssign.utils"
import TeamMembers from "../TeamMembers/TeamMembers"

const selectTeamsWithVolunteersCandidates = createSelector(
    selectVolunteerListAlphaSorted,
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
                volunteersWithoutTeam: volunteersSelection.filter((volunteer) => !volunteer.team),
                volunteersWithCurrentTeam: volunteersSelection.filter(
                    (volunteer) => volunteer.team === id
                ),
                volunteersWithOtherTeam: volunteersSelection.filter(
                    (volunteer) => volunteer.team && volunteer.team !== id
                ),
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

type TeamWithCandidatesVolunteerProps = {
    volunteer: any
    teamId: number
}

const TeamWithCandidatesVolunteer: FC<TeamWithCandidatesVolunteerProps> = ({
    teamId,
    volunteer,
}): JSX.Element => {
    const { id, lastname, firstname, teamWishes, dayWishes, team } = volunteer
    const [, saveTeam] = useTeamAssign()

    const onTeamSelected = useCallback(
        (selectedVolunteer, selectedTeamId) => {
            saveTeam(selectedVolunteer, selectedTeamId)
        },
        [saveTeam]
    )

    return (
        <li key={id}>
            <span className={styles.volunteerName}>
                {firstname} {lastname} (<DaysDisplay dayWishes={dayWishes} />)
            </span>
            {teamWishes.map((teamWish: any) => {
                const active = teamWish.id === team
                const current = teamWish.id === teamId
                return (
                    <button
                        key={teamWish.id}
                        type="button"
                        onClick={() => onTeamSelected({ id, team }, teamWish.id)}
                        className={classnames(
                            styles.teamWishButton,
                            current && styles.teamCurrent,
                            active && styles.teamActive
                        )}
                    >
                        {teamWish.name}
                    </button>
                )
            })}
        </li>
    )
}

type TeamWithCandidatesProps = {
    teamId: number
}

const TeamWithCandidates: FC<TeamWithCandidatesProps> = ({ teamId }): JSX.Element => {
    const teams = useSelector(selectTeamsWithVolunteersCandidates)
    const currentTeam = teams.find((t) => t.id === teamId)

    if (!currentTeam) return <div />

    return (
        <div>
            <div className={styles.teamHeaderName}>Equipe {currentTeam.name}</div>
            <TeamMembers teamId={teamId} />
            <div>Bénévoles intéressés :</div>
            <ul>
                {currentTeam.volunteersWithoutTeam.map((volunteer) => (
                    <TeamWithCandidatesVolunteer
                        key={volunteer.id}
                        teamId={teamId}
                        volunteer={volunteer}
                    />
                ))}
            </ul>
            <ul>
                {currentTeam.volunteersWithCurrentTeam.map((volunteer) => (
                    <TeamWithCandidatesVolunteer
                        key={volunteer.id}
                        teamId={teamId}
                        volunteer={volunteer}
                    />
                ))}
            </ul>
            <ul>
                {currentTeam.volunteersWithOtherTeam.map((volunteer) => (
                    <TeamWithCandidatesVolunteer
                        key={volunteer.id}
                        teamId={teamId}
                        volunteer={volunteer}
                    />
                ))}
            </ul>
        </div>
    )
}

export default memo(TeamWithCandidates)
