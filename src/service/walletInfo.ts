import axios from 'axios'
import { ApiWallet } from '../types'

const getWalletInfo = async (
  apiKey: string
): Promise<ApiWallet | undefined> => {
  try {
    const { data } = await axios.get(
      'https://wallet.lacrypta.ar/api/v1/wallet',
      {
        headers: {
          Accept: 'application/json',
          'X-Api-Key': apiKey,
        },
      }
    )
    return data as ApiWallet
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('AXIOS ERROR', error)
    } else {
      console.error('UNEXPECTED ERROR', error)
    }
    return undefined
  }
}

export default getWalletInfo
