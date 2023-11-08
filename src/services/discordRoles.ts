export class DiscordRole {
  id = 0
  messageId = ''
  emoji = ''
  role = ''
}

export const translationDiscordRoles: { [k in keyof DiscordRole]: string } = {
  id: 'id',
  messageId: 'messageId',
  emoji: 'emoji',
  role: 'rôle',
}

export const elementNameDiscordRoles = 'DiscordRoles'

export type DiscordRoleWithoutId = Omit<DiscordRole, 'id'>
