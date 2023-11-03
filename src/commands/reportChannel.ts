import { ChannelType } from 'discord.js'
import { guildRepository } from '../database/repositories/GuildRepository'
import { replyTimedMessage } from '../helpers'
import { Command } from '../types'

const command: Command = {
  name: 'reportChannel',
  description:
    'Cambia el canal donde se mandan los reportes.\n### Ejemplo: `!rc #general`',
  execute: async function (message, args) {
    try {
      if (args.length !== 2)
        return replyTimedMessage(this.description, message, 5000)

      if (!message.guild) return

      const name = args[1]
      const channel = await message.guild.channels
        .fetch(name.slice(2, -1)) // Remove "<#" and ">"
        .catch((error) => {
          console.error('ERROR in reportChannel command:', error)
        })

      if (!channel)
        return replyTimedMessage(
          `Canal \`${name}\`no encontrado`,
          message,
          5000
        )

      if (channel.type !== ChannelType.GuildText)
        return replyTimedMessage(
          `Canal \`${name}\`no es un canal de texto`,
          message,
          5000
        )

      const updatedGuild = await guildRepository.updateReportChannel(
        message.guild.id,
        channel.id
      )

      if (updatedGuild) {
        message.reply(`Canal de reportes cambiado a \`${channel.name}\``)
        console.log('Guild updated:', updatedGuild)
      } else {
        replyTimedMessage(
          `Error al actualizar el canal de reportes`,
          message,
          5000
        )
        console.error('ERROR in reportChannel command:', updatedGuild)
      }
    } catch (error) {
      console.error(error)
    }
  },
  permissions: ['Administrator'],
  aliases: ['rc'],
}

export default command
