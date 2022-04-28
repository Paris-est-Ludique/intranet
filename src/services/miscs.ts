/* eslint-disable max-classes-per-file */
export class Misc {
    id = 0

    meetingId = ""

    meetingTitle = ""

    discordInvitation = ""
}

export const translationMisc: { [k in keyof Misc]: string } = {
    id: "id",
    meetingId: "rencontreId",
    meetingTitle: "rencontreTitre",
    discordInvitation: "invitationDiscord",
}

export const elementName = "Misc"

export type MiscWithoutId = Omit<Misc, "id">

export interface MiscMeetingDate {
    id: Misc["id"]
    meetingId: Misc["meetingId"]
    meetingTitle: Misc["meetingTitle"]
}

export interface MiscDiscordInvitation {
    id: Misc["id"]
    discordInvitation: Misc["discordInvitation"]
}
