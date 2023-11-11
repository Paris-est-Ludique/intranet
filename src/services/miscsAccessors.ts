import ServiceAccessors from './accessors'
import type { Misc, MiscDiscordInvitation, MiscFestivalDate, MiscMeetingDate, MiscWithoutId } from './miscs'
import { elementNameMisc } from './miscs'

const serviceAccessors = new ServiceAccessors<MiscWithoutId, Misc>(elementNameMisc)

export const miscDiscordInvitation = serviceAccessors.securedCustomGet<[], MiscDiscordInvitation>(
  'DiscordInvitationGet',
)

export const miscFestivalDateListGet = serviceAccessors.customGet<[], MiscFestivalDate>('FestivalDateListGet')

export const miscMeetingDateListGet = serviceAccessors.customGet<[], MiscMeetingDate>('MeetingDateListGet')
