import { memo } from 'react'

import styles from './styles.module.scss'
import type { Volunteer } from '@/services/volunteers'

interface Props {
  item: Volunteer
}

function VolunteerInfo({ item }: Props) {
  return (
    <div className={styles.VolunteerCard}>
      <h4>Volunteer Info</h4>
      <ul>
        <li>
          Prénom:
          {item.firstname}
        </li>
        <li>
          Nom:
          {item.lastname}
        </li>
      </ul>
    </div>
  )
}

export default memo(VolunteerInfo)
