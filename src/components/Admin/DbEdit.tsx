import { max } from "lodash"
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
import { fetchVolunteerAddNewIfNeed } from "../../store/volunteerAddNew"

const DbEdit: FC = (): JSX.Element => {
    const volunteers = useSelector(selectVolunteerList)
    const saveVolunteer = useAction(fetchVolunteerSetIfNeed)
    const addVolunteer = useAction(fetchVolunteerAddNewIfNeed)
    if (!volunteers) {
        return <>No member found</>
    }
    const nextId = (max(volunteers.map((v) => v.id)) || 0) + 1
    const nextVolunteer = new Volunteer()
    nextVolunteer.id = nextId
    return (
        <ul className={styles.list}>
            {volunteers.map((volunteer: Volunteer) => (
                <MemberEdit
                    key={volunteer.id}
                    saveVolunteer={saveVolunteer}
                    volunteer={volunteer}
                />
            ))}
            <MemberEdit
                key={nextId}
                addBefore={addVolunteer}
                saveVolunteer={saveVolunteer}
                volunteer={nextVolunteer}
            />
        </ul>
    )
}

export default withUserRole(ROLES.ADMIN, memo(withUserConnected(DbEdit)))

export const fetchFor = [fetchVolunteerListIfNeed]
