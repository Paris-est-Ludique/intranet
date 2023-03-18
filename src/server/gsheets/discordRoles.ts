import ExpressAccessors from "./expressAccessors"
import {
    DiscordRole,
    DiscordRoleWithoutId,
    translationDiscordRoles,
} from "../../services/discordRoles"

const expressAccessor = new ExpressAccessors<DiscordRoleWithoutId, DiscordRole>(
    "DiscordRoles",
    new DiscordRole(),
    translationDiscordRoles
)

export const discordRolesListGet = expressAccessor.listGet()
