import { guildRepository } from '../database/repositories/GuildRepository'
import { replyTimedMessage } from '../helpers'
import { Command } from '../types'

const command: Command = {
  name: 'changePrefix',
  description:
    'Cambia el prefijo para los compandos del bot.\n### Ejemplo: `!cp bot!` o `!changePrefix p!`',
  execute: async function (message, args) {
    if (args.length !== 2)
      return replyTimedMessage(this.description, message, 5000)
    if (!message.guild) return

    const prefix = args[1]
    const updatedGuild = await guildRepository.updatePrefix(
      message.guild.id,
      prefix
    )
    if (updatedGuild) {
      message.channel.send('El prefijo se cambió con éxito!')
      console.log('Guild updated:', updatedGuild)
    } else {
      message.channel.send('Error al actualizar el prefijo')
      console.error('ERROR in changePrefix command:', updatedGuild)
    }
  },
  permissions: ['Administrator'],
  aliases: ['cp'],
}

export default command
