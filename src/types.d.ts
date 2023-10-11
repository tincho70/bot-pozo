import {
  Collection,
  SlashCommandBuilder,
  CommandInteraction,
  AutocompleteInteraction,
} from 'discord.js'

export interface SlashCommand {
  data: SlashCommandBuilder
  execute: (interaction: CommandInteraction) => void
  autocomplete?: (interaction: AutocompleteInteraction) => void
  cooldown?: number // in seconds
}

declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, SlashCommand>
    updateTicker: (apiKey: string) => void
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
