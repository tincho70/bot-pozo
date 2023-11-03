import {
  SlashCommandBuilder,
  Collection,
  PermissionResolvable,
  Message,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  ModalSubmitInteraction,
  CacheType,
} from 'discord.js'

export interface SlashCommand {
  command: SlashCommandBuilder
  execute: (interaction: ChatInputCommandInteraction) => void
  autocomplete?: (interaction: AutocompleteInteraction) => void
  modal?: (interaction: ModalSubmitInteraction<CacheType>) => void
  cooldown?: number // in seconds
}

export interface Command {
  name: string
  description: string
  execute: (message: Message, args: Array<string>) => void
  permissions: Array<PermissionResolvable>
  aliases: Array<string>
  cooldown?: number
}

declare module 'discord.js' {
  export interface Client {
    slashCommands: Collection<string, SlashCommand>
    commands: Collection<string, Command>
    cooldowns: Collection<string, number>
  }
}

export interface BotEvent {
  name: string // Nombre del evento
  once?: boolean | false // Por única vez?
  execute: (...args) => void // Ejecución del evento
}

export interface ApiWallet {
  name: string
  balance: number // in millisats
}

// Para las variables de entorno
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_BOT_TOKEN: string
      DISCORD_APP_ID: string
      DISCORD_REPORT_CHANNEL_ID: string
      DISCORD_COMMAND_PREFIX: string
      INVOICE_READ_KEY: string
      POSTGRES_DB: string
      POSTGRES_USER: string
      POSTGRES_PASSWORD: string
      POSTGRES_HOST: string
      POSTGRES_PORT: number
      NODE_ENV: string
    }
  }
}
