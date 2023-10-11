/* eslint-disable @typescript-eslint/no-var-requires */
import { Client, Collection, GatewayIntentBits } from 'discord.js'
import { readdirSync } from 'fs'
import { join } from 'path'
import { BotEvent, SlashCommand } from './types'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
})

const eventsPath = join(__dirname, 'events')
const eventFiles = readdirSync(eventsPath)

for (const file of eventFiles) {
  const filePath = join(eventsPath, file)
  const event: BotEvent = require(filePath).default
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args))
  } else {
    client.on(event.name, (...args) => event.execute(...args))
  }
}

client.commands = new Collection<string, SlashCommand>()
/* const commandsPath = join(__dirname, 'commands')
const commandFiles = readdirSync(commandsPath)

for (const file of commandFiles) {
    const filePath = join(commandsPath, file)
    const command = require(filePath).default
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command)
        console.log(`\u{1F525} new command ${command.data.name}`)
    } else {
        console.log(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        )
    }
} */

const apiKey = process.env.INVOICE_READ_KEY
if (!apiKey) {
  throw new Error('Invoice read key not found')
}

client.login(process.env.DISCORD_BOT_TOKEN)
