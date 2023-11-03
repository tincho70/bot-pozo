import { ActivityType, Client } from 'discord.js'
import getWalletInfo from './walletInfo'
import convert from './Yadio'

const updateTicker = async (client: Client) => {
  try {
    const walletInfo = await getWalletInfo()
    if (walletInfo) {
      const balance = Math.ceil(walletInfo.balance / 1000)
      const yadio = await convert(balance, 'sat', 'ars')
      client.user!.setPresence({
        activities: [
          {
            type: ActivityType.Custom,
            name: 'custom', // name is exposed through the API but not shown in the client for ActivityType.Custom
            state:
              yadio && !yadio.error
                ? `$${yadio.result.toLocaleString('es-AR')} ARS`
                : '⚡ Pozo ⚡',
          },
        ],
        status: 'online',
      })

      const nickname = `${balance.toLocaleString('es-AR')} sats`
      client.guilds.cache.forEach((guild) => {
        if (nickname != guild.members.me?.nickname) {
          console.log(`[${guild.name}] New balance: ${nickname}`)
          guild.members.me?.setNickname(nickname).catch(console.error)
        }
      })
    }
  } catch (error) {
    console.error(error)
  }
}

export default updateTicker
