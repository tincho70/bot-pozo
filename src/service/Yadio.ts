import axios from 'axios'
import { ApiYadio } from './Yadio.d'

const convert = async (
  amount: number,
  from: string,
  to: string
): Promise<ApiYadio | undefined> => {
  try {
    // Se convierten los SAT a BTC para la API de Yadio
    let factor = 1
    if (from == 'sat') {
      amount /= 100000000
      from = 'btc'
    }
    if (to == 'sat') {
      to = 'btc'
      factor = 100000000
    }
    const { data } = await axios.get(
      `https://api.yadio.io/convert/${amount}/${from}/${to}`,
      {
        headers: {
          Accept: 'application/json',
        },
      }
    )
    // Se convierten los BTC a SAT en caso que sea necesario
    data.result *= factor
    return data as ApiYadio
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('AXIOS ERROR', error.cause)
    } else {
      console.error('UNEXPECTED ERROR', error)
    }
    return undefined
  }
}

export default convert
