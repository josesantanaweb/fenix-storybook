import type { Address } from 'viem'

export interface Token {
  name: string
  symbol: string
  decimals: string
  id: string
}

export interface TokenData {
  name: string
  symbol: string
  decimals: number
  address: Address
  price_quote?: number
  is_low_liquidity?: boolean
}

export interface TokenPairData {
  token0: TokenData
  token1: TokenData
  pairAddress: string
  pairSymbol: string
}

export interface AvailableTokenData {
  commonTokens: TokenData[]
  whitelistedTokens: TokenData[]
  tokens: TokenData[]
  tokensDictionary: Record<string, TokenData>
}

export interface AllBalances {
  [tokenAddress: Address]: bigint
}
