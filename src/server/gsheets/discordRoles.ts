import ExpressAccessors from './expressAccessors'
import type {
  DiscordRoleWithoutId,
} from '@/services/discordRoles'
import {
  DiscordRole,
  translationDiscordRoles,
} from '@/services/discordRoles'

const expressAccessor = new ExpressAccessors<DiscordRoleWithoutId, DiscordRole>(
  'DiscordRoles',
  new DiscordRole(),
  translationDiscordRoles,
)

export const discordRolesListGet = expressAccessor.listGet()
