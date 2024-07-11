export function adjustTokenOrder(token0Symbol: string, token1Symbol: string) {
  if (token0Symbol === 'WETH' || (token0Symbol === 'USDB' && token1Symbol !== 'WETH')) {
    return [token1Symbol, token0Symbol]
  }
  return [token0Symbol, token1Symbol]
}
