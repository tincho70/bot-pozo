import { ChannelType, Message } from 'discord.js'
import { checkPermissions, sendTimedMessage } from '../helpers'
import { guildRepository } from '../database/repositories/GuildRepository'

import { BotEvent } from '../types'

const event: BotEvent = {
  name: 'messageCreate',
  execute: async (message: Message) => {
    if (!message.member || message.member.user.bot) return
    if (!message.guild) return
    const guild = await guildRepository.getById(message.guild.id)
    const prefix = guild ? guild.prefix : process.env.DISCORD_COMMAND_PREFIX

    if (!message.content.startsWith(prefix)) return
    if (message.channel.type !== ChannelType.GuildText) return

    const args = message.content.substring(prefix.length).split(' ')
    let command = message.client.commands.get(args[0])

    if (!command) {
      const commandFromAlias = message.client.commands.find((command) =>
        command.aliases.includes(args[0])
      )
      if (commandFromAlias) command = commandFromAlias
      else return
    }

    const cooldown = message.client.cooldowns.get(
      `${command.name}-${message.member.user.username}`
    )
    const neededPermissions = checkPermissions(
      message.member,
      command.permissions
    )
    if (neededPermissions !== null)
      return sendTimedMessage(
        `
            No tienes permisos para usar este comando.
            \n Necesitas: ${neededPermissions.join(', ')}
            `,
        message.channel,
        5000
      )

    if (command.cooldown && cooldown) {
      if (Date.now() < cooldown) {
        sendTimedMessage(
          `Tienes que esperar ${Math.floor(
            Math.abs(Date.now() - cooldown) / 1000
          )} segundo(s) para utilizar este comando nuevamente.`,
          message.channel,
          5000
        )
        return
      }
      message.client.cooldowns.set(
        `${command.name}-${message.member.user.username}`,
        Date.now() + command.cooldown * 1000
      )
      setTimeout(() => {
        message.client.cooldowns.delete(
          `${command?.name}-${message.member?.user.username}`
        )
      }, command.cooldown * 1000)
    } else if (command.cooldown && !cooldown) {
      message.client.cooldowns.set(
        `${command.name}-${message.member.user.username}`,
        Date.now() + command.cooldown * 1000
      )
    }

    command.execute(message, args)
  },
}

export default event
