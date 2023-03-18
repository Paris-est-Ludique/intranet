/* eslint-disable max-classes-per-file */
export class DiscordRole {
    id = 0

    messageId = ""

    emoji = ""

    role = ""
}

export const translationDiscordRoles: { [k in keyof DiscordRole]: string } = {
    id: "id",
    messageId: "messageId",
    emoji: "emoji",
    role: "rôle",
}

export const elementName = "DiscordRoles"

export type DiscordRoleWithoutId = Omit<DiscordRole, "id">

export interface DiscordRole {
    id: DiscordRole["id"]
    messageId: DiscordRole["messageId"]
    emoji: DiscordRole["emoji"]
    role: DiscordRole["role"]
}
