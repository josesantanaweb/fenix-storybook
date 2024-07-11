import axios from 'axios'
import cache from 'memory-cache'
import { useAccount } from 'wagmi'
// models
import TokenListItem from '@/src/library/types/token-list-item';

// constants
import { TOKEN_API } from '../constants/addresses'


export const fetchTokens = async (chainId: number): Promise<TokenListItem[]> => {
  // const cacheKey = 'token-prices'
  // let cachedData = cache.get(cacheKey)
  // if (!cachedData) {
  try {
    if (chainId) {
      const response = await fetch(TOKEN_API[chainId], {
        method: 'GET',
      })
      const responseData = await response.json()
      // cachedData = responseData
      // cache.put(cacheKey, responseData, 1000 * 60 * 5)
      return responseData
    }

    // const response = await axios.get<Token[]>(`${process.env.NEXT_PUBLIC_API_URL}/token-prices`)
    // return response.data
  } catch (error) {
    console.error('Error fetching token prices:', error)
    return []
  }
  return []
}
//   return cachedData
// }
