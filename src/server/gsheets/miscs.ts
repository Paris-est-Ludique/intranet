import ExpressAccessors from './expressAccessors'
import type { MiscDiscordInvitation, MiscFestivalDate, MiscMeetingDate, MiscWithoutId } from '@/services/miscs'
import { Misc, translationMisc } from '@/services/miscs'

const expressAccessor = new ExpressAccessors<MiscWithoutId, Misc>('Miscs', new Misc(), translationMisc)

export const miscDiscordInvitation = expressAccessor.get(async (list, _body, id) => {
  if (id <= 0) {
    throw new Error(`L'accès est réservé aux utilisateurs identifiés`)
  }

  return list
    .filter(misc => !!misc.discordInvitation)
    .map(
      misc =>
        ({
          id: misc.id,
          discordInvitation: misc.discordInvitation,
        }) as MiscDiscordInvitation,
    )
})

export const miscFestivalDateListGet = expressAccessor.get(async list =>
  list
    .filter(misc => !!misc.date)
    .map(
      misc =>
        ({
          id: misc.id,
          date: misc.date,
        }) as MiscFestivalDate,
    ),
)

export const miscMeetingDateListGet = expressAccessor.get(async list =>
  list
    .filter(misc => !!misc.meetingId)
    .map(
      misc =>
        ({
          id: misc.id,
          meetingId: misc.meetingId,
          meetingTitle: misc.meetingTitle,
          meetingUrl: misc.meetingUrl,
        }) as MiscMeetingDate,
    ),
)
