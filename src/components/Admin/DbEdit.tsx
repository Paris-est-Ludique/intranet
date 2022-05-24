import { FC, memo } from "react"
import { useSelector } from "react-redux"
import withUserConnected from "../../utils/withUserConnected"
import { fetchVolunteerListIfNeed, selectVolunteerList } from "../../store/volunteerList"
import withUserRole from "../../utils/withUserRole"
import ROLES from "../../utils/roles.constants"
import MemberEdit from "./MemberEdit"
import useAction from "../../utils/useAction"
import { fetchVolunteerSetIfNeed } from "../../store/volunteerSet"
import { Volunteer } from "../../services/volunteers"
import styles from "./styles.module.scss"

const DbEdit: FC = (): JSX.Element => {
    const volunteers = useSelector(selectVolunteerList)
    const saveVolunteer = useAction(fetchVolunteerSetIfNeed)
    if (!volunteers) {
        return <>No member found</>
    }
    return (
        <ul className={styles.list}>
            {volunteers.map((volunteer: Volunteer) => (
                <MemberEdit
                    key={volunteer.id}
                    saveVolunteer={saveVolunteer}
                    volunteer={volunteer}
                />
            ))}
        </ul>
    )
}

export default withUserRole(ROLES.ADMIN, memo(withUserConnected(DbEdit)))

export const fetchFor = [fetchVolunteerListIfNeed]
