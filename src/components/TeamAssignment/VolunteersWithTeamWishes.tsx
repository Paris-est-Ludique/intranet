import { FC, memo } from "react"
import { useSelector } from "react-redux"
import { createSelector } from "@reduxjs/toolkit"
import { selectVolunteerListAlphaSorted } from "../../store/volunteerList"
import { selectTeamList } from "../../store/teamList"

const selectVolunteersWithTeamWishes = createSelector(
    selectVolunteerListAlphaSorted,
    selectTeamList,
    (volunteers, teams) =>
        volunteers
            .filter((volunteer) => volunteer.teamWishes.length > 0)
            .map((volunteer) => ({
                ...volunteer,
                teamWishes: volunteer.teamWishes.map((wishId) => {
                    const matchingTeam = teams.find((team: any) => wishId === team?.id)
                    return matchingTeam?.name
                }),
            }))
)

const VolunteersWithTeamWishes: FC = (): JSX.Element => {
    const volunteers = useSelector(selectVolunteersWithTeamWishes)

    return (
        <div>
            <div>Bénévoles ayant choisi des équipes ({volunteers.length}) :</div>
            <ul>
                {volunteers.map(({ id, lastname, firstname, teamWishes }) => (
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

export default memo(VolunteersWithTeamWishes)
