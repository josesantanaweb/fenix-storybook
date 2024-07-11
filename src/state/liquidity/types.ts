import { ApiState } from '@/src/library/types/connection'
import { ClmProvider } from '@/src/library/types/liquidity'
import { BigDecimal } from '@/src/library/common/BigDecimal'
import { PairInfoV3 } from '@/src/library/web3/apis/pairAPI'
import { Address } from 'viem'
import RingCampaignData from '@/src/library/types/pools/ring-campaign-data'

export interface LiquidityState {
  // Liquidity V2 Pairs
  token0: Address
  token0TypedValue: string
  token1: Address
  token1TypedValue: string
  clmProvider: ClmProvider
  v2Pairs: {
    state: ApiState
    tablestate: ApiState
    data: PairInfoV3[]
    tableData?: LiquidityTableElement[]
  }
  pools: {
    state: ApiState
    data: LiquidityTableElement[]
  }
  gammaVaults: {
    state: ApiState
    data: GammaVault[]
  }
  ringsCampaigns: {
    state: ApiState
    data: RingCampaignData | null
  }
}

// TODO: Move this type to types/liquidity.ts
export type PoolData = {
  pairDetails: LiquidityTableElement
}
export type v3PoolData = {
  pairDetails: V3PairInfo
}

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
export interface PairInfo {
  pair_address: Address
  symbol: string
  name: string
  decimals: number
  stable: boolean
  total_supply: bigint

  // Token pair info
  token0: Address
  token0_symbol: string
  token0_decimals: number
  reserve0: bigint
  claimable0: bigint

  token1: Address
  token1_symbol: string
  token1_decimals: number
  reserve1: bigint
  claimable1: bigint

  // pairs gauge
  gauge: string
  gauge_total_supply: bigint
  gauge_total_weight: bigint
  fee: string
  bribe: string
  emissions: bigint
  emissions_token: string
  emissions_token_decimals: number

  // User deposit
  account_lp_balance: bigint
  account_token0_balance: bigint
  account_token1_balance: bigint
  account_gauge_balance: bigint
  account_gauge_total_weight: bigint
  account_gauge_earned: bigint

  inactive_gauge?: boolean
}
export interface LiquidityTableElement {
  id: string
  aprRings?: Number
  pairAddress: Address
  pairSymbol: string
  pairInformationV2?: PairInfo
  pairInformationV3?: PairInfoV3
  priceA: number
  priceB: number
  isInactiveGauge?: boolean
  apr: number
  volumeUSD: string
  volumeToken0: string
  volumeToken1: string
  maxAPR?: number
  tvl: string
  fee: string
  token0Symbol: string
  token1Symbol: string
  unmigrated: boolean
  totalPoolAmountValue: string
  myPoolAmountValue: BigDecimal
  myStackedAmountValueV3: BigDecimal
  myStackedAmountValueV2: BigDecimal
}
export interface V2PairInfo {
  id: string
  isStable: boolean
  token0: {
    name: string
    id: string
    symbol: string
  }
  token1: { name: string; id: string; symbol: string }
  volumeToken0: string
  volumeToken1: string
  volumeUSD: string
}
export interface V2PairId {
  id: string
}
export interface V3PairInfo {
  id: Address
  feesToken0: string
  feesToken1: string
  feesUSD: string
  communityFee: string
  createdAtBlockNumber: string
  createdAtTimestamp: string
  fee: string
  feeGrowthGlobal0X128: string
  feeGrowthGlobal1X128: string
  liquidity: string
  liquidityProviderCount: string
  observationIndex: string
  sqrtPrice: string
  tick: string
  tickSpacing: string
  totalValueLockedMatic: string
  totalValueLockedToken0: string
  totalValueLockedToken1: string
  totalValueLockedUSD: string
  totalValueLockedUSDUntracked: string
  txCount: string
  untrackedFeesUSD: string
  untrackedVolumeUSD: string
  volumeToken0: string
  volumeToken1: string
  volumeUSD: string
  token0: {
    decimals: string
    id: Address
    name: string
    symbol: string
  }
  token1: {
    decimals: string
    id: Address
    name: string
    symbol: string
  }
}

export interface v3FactoryData {
  totalFeesUSD: string
  totalVolumeUSD: string
  totalValueLockedUSD: string
}

export interface v2FactoryData {
  totalLiquidityUSD: string
  totalVolumeUSD: string
}
export interface BasicPool {
  id: string
  volumeUSD: string
  feesUSD: string
  liquidity: string
  totalValueLockedUSD: string
  poolType: 'concentrated' | 'stable' | 'volatile'
  token0Price: string
  token1Price: string
  feesToken0: string
  feesToken1: string
  volumeToken0: string
  volumeToken1: string
  fee: string
  token0: BasicToken
  token1: BasicToken
  apr?: string
  isStable?: boolean
  reserve0?: string
  reserve1?: string
  totalSupply?: string
  aprRings?: string
  totalCampaigns?: number
}
export interface BasicToken {
  id: string
  decimals: string
  symbol: string
  name: string
}
export interface ConcentratedPool extends BasicPool {
  poolType: 'concentrated'
  token0: BasicToken & {
    derivedMatic: string
  }
  token1: BasicToken & {
    derivedMatic: string
  }
  sqrtPrice: string
  tick: string
  tickSpacing: string
  untrackedFeesUSD: string
}

export interface GammaVault {
  id: string // ID único para el objeto GammaVault
  createDate: string
  poolAddress: string
  name: string
  token0: string
  token1: string
  decimals0: number
  decimals1: number
  depositCap0: number
  depositCap1: number
  grossFeesClaimed0: number
  grossFeesClaimed1: number
  grossFeesClaimedUSD: string
  feesReinvested0: number
  feesReinvested1: number
  feesReinvestedUSD: string
  tvl0: number
  tvl1: number
  tvlUSD: string
  totalSupply: number
  maxTotalSupply: number
  capacityUsed: string
  sqrtPrice: string
  tick: number
  baseLower: number
  baseUpper: number
  inRange: boolean
  observationIndex: string
  poolTvlUSD: string
  poolFeesUSD: string
  returns: {
    daily: {
      feeApr: number
      feeApy: number
    }
    weekly: {
      feeApr: number
      feeApy: number
    }
    monthly: {
      feeApr: number
      feeApy: number
    }
    allTime: {
      feeApr: number
      feeApy: number
    }
    status: string
  }
}
