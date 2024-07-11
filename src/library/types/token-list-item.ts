interface TokenListItem {
  tokenAddress: string
  priceUSD: string
  chainId: string
  basetoken: {
    address: string
    name: string
    symbol: string
  }
  decimals: string
  logourl: string
  common: boolean
}

export default TokenListItem
