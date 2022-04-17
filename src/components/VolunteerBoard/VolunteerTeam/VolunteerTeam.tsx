import { FC, useEffect, useMemo } from "react"
import { useSelector } from "react-redux"
import TeamMembers from "../../TeamMembers/TeamMembers"
import useAction from "../../../utils/useAction"
import styles from "./styles.module.scss"
import { selectUserId } from "../../../store/auth"
import { fetchVolunteerListIfNeed, selectVolunteerList } from "../../../store/volunteerList"
import { selectTeamList } from "../../../store/teamList"

const useUserTeam = () => {
    const userId = useSelector(selectUserId)
    const fetch = useAction(fetchVolunteerListIfNeed)
    const volunteers = useSelector(selectVolunteerList)
    const teams = useSelector(selectTeamList)

    useEffect(() => {
        if (userId) fetch()
    }, [userId, fetch])

    const user = useMemo(
        () => volunteers.find((volunteer) => volunteer.id === userId),
        [volunteers, userId]
    )

    return useMemo(() => teams.find((t) => t?.id === user?.team), [user, teams])
}

const VolunteerTeam: FC = (): JSX.Element => {
    const team = useUserTeam()
    if (!team) return <div />

    return (
        <div className={styles.root}>
            <div className={styles.title}>Mon équipe : {team.name}</div>
            <TeamMembers teamId={team.id} />
        </div>
    )
}

export default VolunteerTeam
