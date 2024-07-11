export abstract class LiquidityProvider {
  abstract getUserLiquidity(account: string): Promise<{
    TVL: string
    boostedTVL: string
  }>
}
