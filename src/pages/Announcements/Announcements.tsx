import { FC, memo } from "react"
import * as _ from "lodash"
import { RouteComponentProps, Link } from "react-router-dom"
import { useSelector, shallowEqual } from "react-redux"
import { Helmet } from "react-helmet"
import { EntityState } from "@reduxjs/toolkit"

import { AppState, AppThunk } from "../../store"
import { AnnouncementLink, LoginForm } from "../../components"
import styles from "./styles.module.scss"
import { fetchAnnouncementListIfNeed } from "../../store/announcementList"
import { Announcement } from "../../services/announcement"
import { selectUserJwtToken } from "../../store/auth"

export type Props = RouteComponentProps

let prevAnnouncements: EntityState<Announcement> | undefined

const AnnouncementsPage: FC<Props> = (): JSX.Element => {
    const jwtToken = useSelector(selectUserJwtToken)

    const announcementList = useSelector((state: AppState) => {
        if (!state.announcementList) {
            return undefined
        }
        const announcements = _.pick(state.announcementList, "entities", "ids")
        if (announcements) {
            prevAnnouncements = announcements
            return announcements
        }
        return prevAnnouncements
    }, shallowEqual)

    if (jwtToken === undefined) return <p>Loading...</p>

    if (jwtToken && announcementList) {
        const list = _.orderBy(announcementList.ids, _.identity, "desc")
        const listElements = list.map((id) => {
            const announcement = announcementList.entities[id] as Announcement
            return announcement && <AnnouncementLink key={id} announcement={announcement} />
        })

        return (
            <div className={styles.announcements}>
                <div className={styles.announcementsContent}>{listElements}</div>
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
                    <Link to="/sinscrire"> S&apos;informer sur le bénévolat </Link>
                </div>
            </div>
        </div>
    )
}

// Fetch server-side data here
export const loadData = (): AppThunk[] => [fetchAnnouncementListIfNeed()]

export default memo(AnnouncementsPage)
