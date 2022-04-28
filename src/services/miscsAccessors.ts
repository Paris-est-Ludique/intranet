import ServiceAccessors from "./accessors"
import { elementName, Misc, MiscDiscordInvitation, MiscMeetingDate, MiscWithoutId } from "./miscs"

const serviceAccessors = new ServiceAccessors<MiscWithoutId, Misc>(elementName)

export const miscDiscordInvitation = serviceAccessors.securedCustomGet<[], MiscDiscordInvitation>(
    "DiscordInvitationGet"
)

export const miscMeetingDateListGet = serviceAccessors.customGet<[], MiscMeetingDate>(
    "MeetingDateListGet"
)
