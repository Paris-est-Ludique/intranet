import ServiceAccessors from "./accessors"
import {
    elementName,
    Misc,
    MiscWithoutId,
    MiscDiscordInvitation,
    MiscFestivalDate,
    MiscMeetingDate,
} from "./miscs"

const serviceAccessors = new ServiceAccessors<MiscWithoutId, Misc>(elementName)

export const miscDiscordInvitation = serviceAccessors.securedCustomGet<[], MiscDiscordInvitation>(
    "DiscordInvitationGet"
)

export const miscFestivalDateListGet = serviceAccessors.customGet<[], MiscFestivalDate>(
    "FestivalDateListGet"
)

export const miscMeetingDateListGet = serviceAccessors.customGet<[], MiscMeetingDate>(
    "MeetingDateListGet"
)
