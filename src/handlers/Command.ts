/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Client, Routes, SlashCommandBuilder, REST } from 'discord.js'
import { readdirSync } from 'fs'
import { join } from 'path'
import { Command, SlashCommand } from '../types'

module.exports = (client: Client) => {
  const slashCommands: SlashCommandBuilder[] = []
  const commands: Command[] = []

  const slashCommandsDir = join(__dirname, '../slashCommands')
  const commandsDir = join(__dirname, '../commands')

  readdirSync(slashCommandsDir).forEach((file) => {
    if (!file.endsWith('.js')) return
    const command: SlashCommand = require(`${slashCommandsDir}/${file}`).default
    slashCommands.push(command.command)
    client.slashCommands.set(command.command.name, command)
  })

  readdirSync(commandsDir).forEach((file) => {
    if (!file.endsWith('.js')) return
    const command: Command = require(`${commandsDir}/${file}`).default
    commands.push(command)
    client.commands.set(command.name, command)
  })

  const rest = new REST({ version: '10' }).setToken(
    process.env.DISCORD_BOT_TOKEN
  )

  if (process.env.NODE_ENV == 'production') {
    rest
      .put(Routes.applicationCommands(process.env.DISCORD_APP_ID), {
        body: slashCommands.map((command) => command.toJSON()),
      })
      .then((data: any) => {
        console.log(`🔶 Successfully loaded ${data.length} slash command(s)`)
        console.log(`🔷 Successfully loaded ${commands.length} command(s)`)
      })
      .catch((e) => {
        console.log(e)
      })
  } else {
    // Si estoy en development, solo hago el deploy en el server de desarrollo
    rest
      .put(
        Routes.applicationGuildCommands(
          process.env.DISCORD_APP_ID,
          process.env.DISCORD_GUILD_ID
        ),
        {
          body: slashCommands.map((command) => command.toJSON()),
        }
      )
      .then((data: any) => {
        console.log(
          `🔶 Successfully loaded ${data.length} slash command(s) in GUILD_ID ${process.env.DISCORD_GUILD_ID}`
        )
        console.log(
          `🔷 Successfully loaded ${commands.length} command(s) in GUILD_ID ${process.env.DISCORD_GUILD_ID}`
        )
      })
      .catch((e) => {
        console.log(e)
      })
  }
}
