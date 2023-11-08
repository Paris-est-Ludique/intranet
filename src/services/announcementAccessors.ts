import ServiceAccessors from './accessors'
import type { Announcement, AnnouncementWithoutId } from './announcement'
import { elementNameAnnouncement } from './announcement'

const serviceAccessors = new ServiceAccessors<AnnouncementWithoutId, Announcement>(elementNameAnnouncement)

// export const announcementGet = serviceAccessors.get()
// export const announcementAdd = serviceAccessors.add()
// export const announcementSet = serviceAccessors.set()

export const announcementListGet = serviceAccessors.securedListGet()
