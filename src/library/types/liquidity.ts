export type LiquidityV2PairDetails = {
  id: string
  isStable: boolean
  token0: {
    name: string
    id: string
    symbol: string
  }
  token1: {
    id: string
    symbol: string
    name: string
  }
}

export enum ClmProvider {
  ICHI = 'ICHI',
  GAMMA = 'GAMMA',
}
