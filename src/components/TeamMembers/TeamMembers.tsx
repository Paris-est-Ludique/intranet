import { FC } from "react"
import { createSelector } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import classnames from "classnames"
import { selectVolunteerListAlphaSorted } from "../../store/volunteerList"
import { selectTeamList } from "../../store/teamList"
import styles from "./styles.module.scss"
import { Volunteer } from "../../services/volunteers"
import { Team } from "../../services/teams"
import withUserRole from "../../utils/withUserRole"
import ROLES from "../../utils/roles.constants"

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

type VolunteerEmailProps = {
    email: string
}

const VolunteerEmail: FC<VolunteerEmailProps> = withUserRole(ROLES.TEAMLEAD, ({ email }) => (
    <td> {email}</td>
), null)

type DaysAvailabilityProps = {
    volunteer: Volunteer
}

const DaysAvailability: FC<DaysAvailabilityProps> = ({ volunteer }): JSX.Element => {
    if (volunteer.dayWishes.length === 0) {
        return (
            <>
                <td className={classnames(styles.day, styles.unknown)}>S</td>
                <td className={classnames(styles.day, styles.unknown)}>D</td>
            </>
        )
    }
    return (
        <>
            <td className={classnames(styles.day, hasDay("S")(volunteer) && styles.available)} />
            <td className={classnames(styles.day, hasDay("D")(volunteer) && styles.available)} />
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

    if (volunteers.length === 0) return <div />

    return (
        <table>
            <tr>
                <th>Volontaires</th>
                <th className={styles.dayTitle}>S ({volunteers.filter(hasDay("S")).length})</th>
                <th className={styles.dayTitle}>D ({volunteers.filter(hasDay("D")).length})</th>
                <th>@</th>
            </tr>
            {volunteers.map((volunteer) => (
                <tr key={volunteer.id}>
                    <td>
                        {volunteer.firstname} {volunteer.lastname}
                    </td>
                    <DaysAvailability volunteer={volunteer} />
                    <VolunteerEmail email={volunteer.email} />
                </tr>
            ))}
        </table>
    )
}

export default TeamMembers
