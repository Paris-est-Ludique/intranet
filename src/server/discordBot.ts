import _ from 'lodash'
import type {
  CommandInteraction,
  Guild,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  SlashCommandBuilder,
  User,
} from 'discord.js'
import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  /* REST, Routes, */ Partials,
} from 'discord.js'

import { getSheet } from '@/server/gsheets/accessors'
import type { VolunteerWithoutId } from '@/services/volunteers'
import { Volunteer, translationVolunteer } from '@/services/volunteers'
import type {
  DiscordRoleWithoutId,
} from '@/services/discordRoles'
import {
  DiscordRole,
  translationDiscordRoles,
} from '@/services/discordRoles'

const { DISCORD_TOKEN, DISCORD_GUILD_ID } = env

interface Command {
  data: SlashCommandBuilder
  execute: (interaction: CommandInteraction) => Promise<void>
}

const commands: Collection<string, Command> = new Collection()

export async function discordBot(): Promise<void> {
  try {
    if (__REGISTER_DISCORD_COMMANDS__) {
      return
    }

    if (!DISCORD_TOKEN) {
      console.error(`Discord bot: no creds found, not running bot`)
      return
    }

    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
      ],
      partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    })

    // commands.set(userCommand.data.name, userCommand)

    client.once(Events.ClientReady, (localClient) => {
      setInterval(() => setBotReactions(localClient), 5 * 60 * 1000)
      setTimeout(() => setBotReactions(localClient), 20 * 1000)

      setInterval(() => setAllRoles(localClient), 5 * 60 * 1000)
      setTimeout(() => setAllRoles(localClient), 5 * 1000)
    })

    client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand())
        return

      const command = commands.get(interaction.commandName)

      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`)
        return
      }

      try {
        await command.execute(interaction)
      }
      catch (error) {
        console.error(error)
      }
    })

    client.on(Events.MessageReactionAdd, async (reaction, user) => {
      await fetchPartial(reaction)

      await setRolesFromEmoji(client, user, reaction, 'add')
    })

    client.on(Events.MessageReactionRemove, async (reaction, user) => {
      await fetchPartial(reaction)

      await setRolesFromEmoji(client, user, reaction, 'remove')
    })

    client.login(DISCORD_TOKEN)
  }
  catch (error) {
    console.error('Discord error', error)
  }
}

async function setBotReactions(client: Client) {
  try {
    const discordRolesSheet = await getSheet<DiscordRoleWithoutId, DiscordRole>(
      'DiscordRoles',
      new DiscordRole(),
      translationDiscordRoles,
    )
    const discordRolesList = await discordRolesSheet.getList()
    if (!discordRolesList) {
      return
    }

    client.channels.cache.each(async (channel) => {
      if (!channel.isTextBased()) {
        return
      }

      discordRolesList.forEach(async (discordRole: DiscordRole) => {
        let message
        try {
          message = await channel.messages.fetch(discordRole.messageId)
        }
        catch (error) {
          return
        }

        const reaction = message.reactions.cache.find(
          r => r.emoji.name === discordRole.emoji,
        )
        if (reaction) {
          return
        }
        await message.react(discordRole.emoji)
      })
    })
  }
  catch (error) {
    console.error('Error in setBotReactions', error)
  }
}

async function setAllRoles(client: Client) {
  try {
    const volunteerSheet = await getSheet<VolunteerWithoutId, Volunteer>(
      'Volunteers',
      new Volunteer(),
      translationVolunteer,
    )
    const volunteerList = await volunteerSheet.getList()
    if (!volunteerList) {
      return
    }

    const volunteerByDiscordId = _.mapKeys(volunteerList, v => v.discordId.toString())

    const guild = await client.guilds.fetch(DISCORD_GUILD_ID)

    if (!guild || !guild.members.cache) {
      return
    }

    // Set (maybe) volunteer roles

    const volunteerRoleIds: { [key: string]: string } = _.mapValues(
      {
        'oui': 'Bénévole',
        'peut-etre': 'Bénévole incertain',
        'à distance': 'Bénévole à distance',
        'non': '',
      },
      v => (_.isEmpty(v) ? '' : guild.roles.cache.find(role => role.name === v)?.id || ''),
    )

    await setVolunteersRoles(
      guild,
      volunteerByDiscordId,
      volunteerRoleIds,
      (volunteer: Volunteer) => volunteer.active,
    )

    // Set Team- and Référent- roles

    const teamIds = {
      1: 'accueil',
      5: 'paillante',
      21: 'photo',
      4: 'tournois',
      // "19": "exposants-asso", ignored because it's mixed with volunteers of last edition
      2: 'jav',
      18: 'jeux-xl',
      27: 'ring',
      8: 'coindespetitsjoueurs',
      23: 'jeuxdelires',
      3: 'jdd',
      9: 'figurines',
      10: 'jdr',
      28: 'jeuxhistoire',
      6: 'évènements',
      29: 'presse',
      30: 'initiation-18xx',
      0: '',
    }

    const volunteerByDiscordIdNoOrga = _.pickBy(
      volunteerByDiscordId,
      (volunteer: Volunteer) => volunteer.team !== 13,
    )

    const teamRoleIds: { [key: string]: string } = _.mapValues(teamIds, v =>
      _.isEmpty(v)
        ? ''
        : guild.roles.cache.find(role => role.name === `Team-${v}`)?.id || '')

    await setVolunteersRoles(
      guild,
      volunteerByDiscordIdNoOrga,
      teamRoleIds,
      (volunteer: Volunteer) =>
        _.includes(['oui', 'peut-etre', 'à distance'], volunteer.active)
          ? `${volunteer.team}`
          : '',
    )

    const teamReferentRoleIds: { [key: string]: string } = _.mapValues(teamIds, v =>
      _.isEmpty(v)
        ? ''
        : guild.roles.cache.find(role => role.name === `Référent-${v}`)?.id || '')

    await setVolunteersRoles(
      guild,
      volunteerByDiscordIdNoOrga,
      teamReferentRoleIds,
      (volunteer: Volunteer) =>
        _.includes(['oui', 'peut-etre', 'à distance'], volunteer.active)
                && volunteer.roles.includes('référent')
          ? `${volunteer.team}`
          : '0',
    )

    const referentRoleId = guild.roles.cache.find(role => role.name === `Référent`)?.id

    await setVolunteersRoles(
      guild,
      volunteerByDiscordIdNoOrga,
      referentRoleId ? { ref: referentRoleId } : {},
      (volunteer: Volunteer) =>
        _.includes(['oui', 'peut-etre', 'à distance'], volunteer.active)
                && volunteer.roles.includes('référent')
          ? 'ref'
          : '',
    )
  }
  catch (error) {
    console.error('Error in setAllRoles', error)
  }
}

async function setVolunteersRoles(
  guild: Guild,
  volunteerByDiscordId: { [key: string]: Volunteer },
  volunteerRoleIds: { [key: string]: string },
  funcKey: (volunteer: Volunteer) => string,
) {
  const members = await guild.members.fetch()
  members.each(async (member) => {
    const volunteer = volunteerByDiscordId[member.id]
    if (!volunteer) {
      return
    }

    _.forOwn(volunteerRoleIds, (roleId, active) => {
      if (!roleId) {
        return
      }

      const shouldHaveRole = active === funcKey(volunteer)
      const hasRole = member.roles.cache.has(roleId)

      if (hasRole && !shouldHaveRole) {
        member.roles.remove(roleId)
      }
      else if (!hasRole && shouldHaveRole) {
        member.roles.add(roleId)
      }
    })
  })
}

async function setRolesFromEmoji(
  client: Client,
  user: User | PartialUser,
  reaction: MessageReaction | PartialMessageReaction,
  action: 'add' | 'remove',
) {
  const discordRolesSheet = await getSheet<DiscordRoleWithoutId, DiscordRole>(
    'DiscordRoles',
    new DiscordRole(),
    translationDiscordRoles,
  )
  const discordRolesList = await discordRolesSheet.getList()
  if (!discordRolesList) {
    return
  }

  await client.guilds.fetch()
  const guild = client.guilds.resolve(DISCORD_GUILD_ID)

  if (!guild || !guild.members.cache) {
    return
  }

  discordRolesList.forEach(async (discordRole: DiscordRole) => {
    if (
      reaction.message.id === discordRole.messageId
            && reaction.emoji.name === discordRole.emoji
    ) {
      const roleId = guild.roles.cache.find(role => role.name === discordRole.role)
      if (!roleId) {
        return
      }

      const member = guild.members.cache.find(m => m.id === user.id)
      if (!member) {
        return
      }
      await member.fetch()
      if (action === 'add') {
        member.roles.add(roleId)
      }
      else if (action === 'remove') {
        member.roles.remove(roleId)
      }
    }
  })
}

async function fetchPartial(reaction: MessageReaction | PartialMessageReaction): Promise<boolean> {
  if (reaction.partial) {
    try {
      await reaction.fetch()
    }
    catch (error) {
      console.error('Something went wrong when fetching the message', error)
      return false
    }
  }
  return true
}
