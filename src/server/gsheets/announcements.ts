import ExpressAccessors from "./expressAccessors"
import {
    Announcement,
    AnnouncementWithoutId,
    translationAnnouncement,
} from "../../services/announcement"

const expressAccessor = new ExpressAccessors<AnnouncementWithoutId, Announcement>(
    "Announcements",
    new Announcement(),
    translationAnnouncement
)

export const announcementListGet = expressAccessor.listGet()
// export const announcementGet = expressAccessor.get()
// export const announcementAdd = expressAccessor.add()
// export const announcementSet = expressAccessor.set()
