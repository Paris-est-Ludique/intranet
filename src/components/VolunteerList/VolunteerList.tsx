import { memo } from 'react'

import styles from './styles.module.scss'
import type { Volunteer } from '@/services/volunteers'

interface Props {
  items: Volunteer[]
}

function VolunteerList({ items }: Props) {
  return (
    <div className={styles.VolunteerList}>
      <h4>Volunteer List</h4>
      <ul>
        {items.map(({ id, lastname, firstname }) => (
          <li key={id}>
            <a href={`/Volunteer/${id}`}>
              <b>{firstname}</b>
              {' '}
              {lastname}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default memo(VolunteerList)
