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

const VolunteerEmail: FC<VolunteerEmailProps> = withUserRole("référent", ({ email }) => (
    <div className={styles.volunteerEmail}>{email}</div>
))

type DaysAvailabilityProps = {
    volunteer: Volunteer
}

const DaysAvailability: FC<DaysAvailabilityProps> = ({ volunteer }): JSX.Element => {
    if (volunteer.dayWishes.length === 0) {
        return (
            <>
                <div className={classnames(styles.day, styles.unknown)}>S</div>
                <div className={classnames(styles.day, styles.unknown)}>D</div>
            </>
        )
    }
    return (
        <>
            <div className={classnames(styles.day, hasDay("S")(volunteer) && styles.available)}>
                S
            </div>
            <div className={classnames(styles.day, hasDay("D")(volunteer) && styles.available)}>
                D
            </div>
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
        <ul className={styles.volunteers}>
            <li>
                <div className={styles.volunteerName} />
                <div className={styles.dayTitle}>S ({volunteers.filter(hasDay("S")).length})</div>
                <div className={styles.dayTitle}>D ({volunteers.filter(hasDay("D")).length})</div>
            </li>
            {volunteers.map((volunteer) => (
                <li key={volunteer.id} className={styles.volunteer}>
                    <div className={styles.volunteerName}>
                        {volunteer.firstname} {volunteer.lastname}
                    </div>
                    <DaysAvailability volunteer={volunteer} />
                    <VolunteerEmail email={volunteer.email} />
                </li>
            ))}
        </ul>
    )
}

export default TeamMembers
