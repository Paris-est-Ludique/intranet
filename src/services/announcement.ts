export class Announcement {
    id = 0

    created = new Date()

    type = ""

    title = ""

    url = ""
}

export const translationAnnouncement: { [k in keyof Announcement]: string } = {
    id: "id",
    created: "creation",
    type: "type",
    title: "titre",
    url: "url",
}

export const elementName = "Announcement"

export type AnnouncementWithoutId = Omit<Announcement, "id">
