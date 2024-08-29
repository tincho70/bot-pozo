import { Client, Events } from 'discord.js'
import ticker from '../service/discord/ticker'
import { BotEvent } from '../types'

import { logger } from '../helpers'

const event: BotEvent = {
  name: Events.ClientReady,
  once: true,
  execute: async (client: Client) => {
    ticker(client)
    //await client.updateTicker();
    logger(`🚀 Discord bot ready with APP_ID: ${process.env.DISCORD_APP_ID}`)
  },
}

export default event
