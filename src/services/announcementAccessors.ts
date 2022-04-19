import ServiceAccessors from "./accessors"
import { elementName, Announcement, AnnouncementWithoutId } from "./announcement"

const serviceAccessors = new ServiceAccessors<AnnouncementWithoutId, Announcement>(elementName)

// export const announcementGet = serviceAccessors.get()
// export const announcementAdd = serviceAccessors.add()
// export const announcementSet = serviceAccessors.set()

export const announcementListGet = serviceAccessors.securedListGet()
