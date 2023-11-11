import max from 'lodash/max'
import type { FC } from 'react'
import { memo } from 'react'
import { useSelector } from 'react-redux'
import MemberEdit from './MemberEdit'
import styles from './styles.module.scss'
import withUserConnected from '@/utils/withUserConnected'
import { fetchVolunteerListIfNeed, selectVolunteerList } from '@/store/volunteerList'
import withUserRole from '@/utils/withUserRole'
import ROLES from '@/utils/roles.constants'
import useAction from '@/utils/useAction'
import { fetchVolunteerSetIfNeed } from '@/store/volunteerSet'
import { fetchVolunteerAddNewIfNeed } from '@/store/volunteerAddNew'
import { Volunteer } from '@/services/volunteers'

const DbEdit: FC = (): JSX.Element => {
  const volunteers: Volunteer[] = useSelector(selectVolunteerList)
  const saveVolunteer = useAction(fetchVolunteerSetIfNeed)
  const addVolunteer = useAction(fetchVolunteerAddNewIfNeed)

  if (!volunteers) {
    return <>No member found</>
  }

  const nextId = (max<number>(volunteers.map(v => v.id)) || 0) + 1
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

export const fetchForDbEdit = [fetchVolunteerListIfNeed]
