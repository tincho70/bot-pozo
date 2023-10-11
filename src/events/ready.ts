import { Client, Events } from 'discord.js'
import deployCommands from '../deploy-commands'
import botTicker from '../service/ticker'
import { BotEvent } from '../types'
import cron from 'node-cron'

const event: BotEvent = {
  name: Events.ClientReady,
  once: true,
  execute: async (client: Client) => {
    botTicker(client)
    cron.schedule('* * * * *', async () => {
      await client.updateTicker(process.env.INVOICE_READ_KEY!)
    })
    await client.updateTicker(process.env.INVOICE_READ_KEY!)
    deployCommands(client)
    console.log(
      'Discord bot ready with API_KEY: ',
      process.env.INVOICE_READ_KEY!
    )
  },
}

export default event
