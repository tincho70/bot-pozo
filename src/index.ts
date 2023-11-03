/* eslint-disable @typescript-eslint/no-var-requires */
import { Client, Collection, GatewayIntentBits } from 'discord.js'
import { Command, SlashCommand } from './types'
import { readdirSync } from 'fs'
import { join } from 'path'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
})

client.slashCommands = new Collection<string, SlashCommand>()
client.commands = new Collection<string, Command>()
client.cooldowns = new Collection<string, number>()

const handlersDir = join(__dirname, './handlers')
readdirSync(handlersDir).forEach((handler) => {
  if (!handler.endsWith('.js')) return
  require(`${handlersDir}/${handler}`)(client)
})

const apiKey = process.env.INVOICE_READ_KEY
if (!apiKey) {
  throw new Error('Invoice read key not found')
}

client.login(process.env.DISCORD_BOT_TOKEN)
