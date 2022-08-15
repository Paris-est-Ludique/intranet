import { FC } from "react"
import { createSelector } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import classnames from "classnames"
import { selectVolunteerListAlphaSorted } from "../../store/volunteerList"
import { selectTeamList } from "../../store/teamList"
import styles from "./styles.module.scss"
import { Volunteer } from "../../services/volunteers"
import { Team } from "../../services/teams"
import ROLES from "../../utils/roles.constants"
import { selectUserRoles } from "../../store/auth"

interface ExtendedVolunteer extends Volunteer {
    teamObject: Team | undefined
}

const selectVolunteersWithTeam = createSelector(
    selectVolunteerListAlphaSorted,
    selectTeamList,
    (volunteers, teams): ExtendedVolunteer[] =>
        volunteers
            .filter((volunteer) => volunteer.team)
            .map((volunteer) => ({
                ...volunteer,
                teamObject: teams.find((team: any) => volunteer.team === team?.id),
            }))
)

const hasDay = (day: string) => (volunteer: Volunteer) => volunteer.dayWishes.includes(day)

type DaysAvailabilityProps = {
    volunteer: Volunteer
}

const DaysAvailability: FC<DaysAvailabilityProps> = ({ volunteer }): JSX.Element => {
    const hasWishes = volunteer.dayWishes.length > 0
    return (
        <>
            <td
                className={classnames(
                    styles.day,
                    hasWishes ? hasDay("S")(volunteer) && styles.available : styles.unknown
                )}
            >
                {hasWishes ? "" : "?"}
            </td>
            <td
                className={classnames(
                    styles.day,
                    hasWishes ? hasDay("D")(volunteer) && styles.available : styles.unknown
                )}
            >
                {hasWishes ? "" : "?"}
            </td>
        </>
    )
}

type Props = {
    teamId: number
}

const TeamMembers: FC<Props> = ({ teamId }): JSX.Element => {
    const volunteers = useSelector(selectVolunteersWithTeam).filter(
        (volunteer) => volunteer?.teamObject?.id === teamId
    )
    const roles = useSelector(selectUserRoles)

    if (volunteers.length === 0) return <div />

    return (
        <table className={styles.teamMembers}>
            <tbody>
                <tr>
                    <th>Bénévoles</th>
                    <th className={styles.dayTitle}>S ({volunteers.filter(hasDay("S")).length})</th>
                    <th className={styles.dayTitle}>D ({volunteers.filter(hasDay("D")).length})</th>
                </tr>
                {volunteers.map((volunteer) => (
                    <tr key={volunteer.id}>
                        <td
                            className={classnames(
                                styles.volunteerName,
                                roles.includes(ROLES.TEAMLEAD) && styles.extendedVolunteerName
                            )}
                        >
                            {volunteer.firstname} {volunteer.lastname}
                            {roles.includes(ROLES.TEAMLEAD) && (
                                <>
                                    {" "}
                                    <span className={styles.email}>&lt;{volunteer.email}&gt;</span>
                                    <span className={styles.hiddenText}>,</span>
                                </>
                            )}
                        </td>
                        <DaysAvailability volunteer={volunteer} />
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default TeamMembers
