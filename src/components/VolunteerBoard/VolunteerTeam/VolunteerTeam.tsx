import { FC, useEffect, useMemo } from "react"
import { useSelector } from "react-redux"
import TeamMembers from "../../TeamMembers/TeamMembers"
import useAction from "../../../utils/useAction"
import styles from "./styles.module.scss"
import { selectUserId } from "../../../store/auth"
import { fetchVolunteerListIfNeed, selectVolunteerList } from "../../../store/volunteerList"

const useUserTeam = () => {
    const userId = useSelector(selectUserId)
    const fetch = useAction(fetchVolunteerListIfNeed)
    const volunteers = useSelector(selectVolunteerList)

    useEffect(() => {
        if (userId) fetch()
    }, [userId, fetch])

    const user = useMemo(
        () => volunteers.find((volunteer) => volunteer.id === userId),
        [volunteers, userId]
    )

    return user?.team
}

const VolunteerTeam: FC = (): JSX.Element => {
    const team = useUserTeam()
    if (!team) return <div />

    return (
        <div className={styles.root}>
            <div className={styles.title}>Mon équipe</div>
            <TeamMembers teamId={team} />
        </div>
    )
}

export default VolunteerTeam
