import NodeCache from 'node-cache'
import { toBN } from '../utils/numbers'

interface BaseToken {
  address: string
  name: string
  symbol: string
}

interface TokenPrice {
  tokenAddress: string
  priceUSD: number
  chainId: string
  basetoken: BaseToken
  decimals: string
  common: boolean
  logourl: string
}
const tokenPricesCache = new NodeCache({ stdTTL: 60, checkperiod: 120 })

export class TokenDataProvider {
  private static async fetchTokenPrices(): Promise<TokenPrice[]> {
    const response = await fetch('https://fenix-dex-api.vercel.app/token-prices', {
      cache: 'no-cache',
    })
    const data = await response.json()
    return data
  }
  static async getTokenPrices(): Promise<TokenPrice[]> {
    let tokenPrices = tokenPricesCache.get<TokenPrice[]>('tokenPrices')

    if (!tokenPrices) {
      tokenPrices = await this.fetchTokenPrices()
      tokenPricesCache.set('tokenPrices', tokenPrices)
    }

    return tokenPrices
  }
  static async getTokenInfoByAddress(address: string): Promise<TokenPrice | undefined> {
    const tokenPrices = await this.getTokenPrices()
    return tokenPrices.find((token) => token.tokenAddress === address)
  }

  static async calculateTokenValue(tokenAddress: string, amount: string): Promise<number> {
    const tokenInfo = await TokenDataProvider.getTokenInfoByAddress(tokenAddress)
    if (!tokenInfo) return 0
    return await toBN(amount).multipliedBy(tokenInfo.priceUSD).toNumber()
  }
}
