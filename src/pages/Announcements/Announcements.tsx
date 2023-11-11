import type { FC } from 'react'
import { memo } from 'react'
import orderBy from 'lodash/orderBy'
import identity from 'lodash/identity'
import type { RouteComponentProps } from 'react-router-dom'
import { shallowEqual, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import type { EntityState } from '@reduxjs/toolkit'
import styles from './styles.module.scss'

import type { AppState, AppThunk } from '@/store'
import AnnouncementLink from '@/components/AnnouncementLink/AnnouncementLink'
import LoginForm from '@/components/LoginForm/LoginForm'
import { fetchAnnouncementListIfNeed } from '@/store/announcementList'
import type { Announcement } from '@/services/announcement'
import { selectUserJwtToken } from '@/store/auth'
import ContentTitle from '@/components/ui/Content/ContentTitle'

export type Props = RouteComponentProps

let prevAnnouncements: EntityState<Announcement> | undefined

const AnnouncementsPage: FC<Props> = (): JSX.Element => {
  const jwtToken = useSelector(selectUserJwtToken)

  const announcementList = useSelector((state: AppState) => {
    if (!state.announcementList) {
      return undefined
    }

    const { ids, entities } = state.announcementList

    if (entities && ids) {
      prevAnnouncements = {
        ids,
        entities,
      }
    }

    return prevAnnouncements
  }, shallowEqual)

  if (jwtToken === undefined) {
    return <p>Loading...</p>
  }

  if (jwtToken && announcementList) {
    const list = orderBy(announcementList.ids, identity, 'desc')
    const listElements = list.map(id => {
      const announcement = announcementList.entities[id] as Announcement

      return (
        announcement && (
          <AnnouncementLink
            key={id}
            announcement={announcement}
          />
        )
      )
    })

    return (
      <div className={styles.announcements}>
        <div className={styles.announcementsContent}>
          <ContentTitle title="Annonces" />
          {listElements}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className={styles.announcements}>
        <div className={styles.loginContent}>
          <Helmet title="LoginPage" />
          <LoginForm />
        </div>
      </div>
      <div className={styles.announcements}>
        <div className={styles.navigationLink}>
          <a href="/sinscrire"> S&apos;informer sur le bénévolat </a>
        </div>
      </div>
    </div>
  )
}

export const loadData = (): AppThunk[] => [fetchAnnouncementListIfNeed()]

export default memo(AnnouncementsPage)
