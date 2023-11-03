import axios from 'axios'
import { ApiWallet } from '../types'

const getWalletInfo = async (): Promise<ApiWallet | undefined> => {
  try {
    const { data } = await axios.get(
      'https://wallet.lacrypta.ar/api/v1/wallet',
      {
        headers: {
          Accept: 'application/json',
          'X-Api-Key': process.env.INVOICE_READ_KEY,
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
