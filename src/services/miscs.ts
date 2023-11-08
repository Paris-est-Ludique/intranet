export class Misc {
  id = 0
  date = ''
  meetingId = ''
  meetingTitle = ''
  meetingUrl = ''
  discordInvitation = ''
}

export const translationMisc: { [k in keyof Misc]: string } = {
  id: 'id',
  date: 'date',
  meetingId: 'rencontreId',
  meetingTitle: 'rencontreTitre',
  meetingUrl: 'rencontreUrl',
  discordInvitation: 'invitationDiscord',
}

export const elementNameMisc = 'Misc'

export type MiscWithoutId = Omit<Misc, 'id'>

export interface MiscDiscordInvitation {
  id: Misc['id']
  discordInvitation: Misc['discordInvitation']
}

export interface MiscFestivalDate {
  id: Misc['id']
  date: Misc['date']
}

export interface MiscMeetingDate {
  id: Misc['id']
  meetingId: Misc['meetingId']
  meetingTitle: Misc['meetingTitle']
  meetingUrl: Misc['meetingUrl']
}
