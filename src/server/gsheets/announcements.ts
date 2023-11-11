import ExpressAccessors from './expressAccessors'
import type { AnnouncementWithoutId } from '@/services/announcement'
import { Announcement, translationAnnouncement } from '@/services/announcement'

const expressAccessor = new ExpressAccessors<AnnouncementWithoutId, Announcement>(
  'Announcements',
  new Announcement(),
  translationAnnouncement,
)

export const announcementListGet = expressAccessor.listGet()

// export const announcementGet = expressAccessor.get()
// export const announcementAdd = expressAccessor.add()
// export const announcementSet = expressAccessor.set()
