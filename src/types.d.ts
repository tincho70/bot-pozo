/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AutocompleteInteraction,
  CacheType,
  ChatInputCommandInteraction,
  Collection,
  ModalSubmitInteraction,
  SlashCommandBuilder,
} from "discord.js";

export interface SlashCommand {
  command: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => void;
  autocomplete?: (interaction: AutocompleteInteraction) => void;
  modal?: (interaction: ModalSubmitInteraction<CacheType>) => void;
  cooldown?: number; // in seconds
}

declare module "discord.js" {
  export interface Client {
    slashCommands: Collection<string, SlashCommand>;
    cooldowns: Collection<string, number>;
    updateTicker: (client: Client) => void;
    laWallet: ApiWallet | undefined;
  }
}

export interface BotEvent {
  name: string; // Event name
  once?: boolean | false; // Once?
  execute: (...args: any) => void; // Event execution
}

export interface ApiWallet {
  name: string;
  balance: number; // in millisats
}

// Enviroment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_BOT_TOKEN: string;
      DISCORD_APP_ID: string;
      DISCORD_COMMAND_PREFIX: string;
      INVOICE_READ_KEY: string;
      LEDGER_PUBKEY: string;
      LAWALLET_PUBKEY: string;
      RELAYS: string;
      POSTGRES_DB: string;
      POSTGRES_USER: string;
      POSTGRES_PASSWORD: string;
      POSTGRES_HOST: string;
      POSTGRES_PORT: number;
      NODE_ENV: string;
    }
  }
}
