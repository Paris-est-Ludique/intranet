export class Announcement {
  id = 0
  created = new Date()
  type = ''
  title = ''
  url = ''
  informedWithNotif = false
}

export const translationAnnouncement: { [k in keyof Announcement]: string } = {
  id: 'id',
  created: 'creation',
  type: 'type',
  title: 'titre',
  url: 'url',
  informedWithNotif: 'informéAvecUneNotif',
}

export const elementNameAnnouncement = 'Announcement'

export type AnnouncementWithoutId = Omit<Announcement, 'id'>
