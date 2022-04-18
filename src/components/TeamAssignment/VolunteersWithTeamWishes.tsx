import { FC, memo } from "react"
import { useSelector } from "react-redux"
import { createSelector } from "@reduxjs/toolkit"
import { selectVolunteerListAlphaSorted } from "../../store/volunteerList"
import { selectTeamList } from "../../store/teamList"
import styles from "./styles.module.scss"

const selectVolunteersWithTeamWishes = createSelector(
    selectVolunteerListAlphaSorted,
    selectTeamList,
    (volunteers, teams) =>
        volunteers
            .filter((volunteer) => volunteer.teamWishes.length > 0)
            .map((volunteer) => ({
                ...volunteer,
                teamWishes: volunteer.teamWishes
                    .filter((wishId) => wishId !== volunteer.team)
                    .map((wishId) => {
                        const matchingTeam = teams.find((team: any) => wishId === team?.id)
                        return matchingTeam?.name
                    }),
                teamObject: teams.find((team: any) => volunteer.team === team?.id),
            }))
)

const VolunteersWithTeamWishes: FC = (): JSX.Element => {
    const volunteers = useSelector(selectVolunteersWithTeamWishes)

    return (
        <div>
            <div>Bénévoles ayant choisi des équipes ({volunteers.length}) :</div>
            <ul>
                {volunteers.map(({ id, lastname, firstname, teamWishes, teamObject }) => (
                    <li key={id}>
                        <span className={styles.volunteerName}>
                            {firstname} {lastname}{" "}
                        </span>
                        <span className={styles.teamActive}>{teamObject?.name} </span>
                        <span>{teamWishes.join(", ")}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default memo(VolunteersWithTeamWishes)
