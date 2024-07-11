import { Address } from 'viem'

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

export interface PairInfoV3 {
  pair_address: Address
  symbol: string
  name: string
  decimals: number
  stable: boolean
  total_supply: bigint
  clPool: Address
  dysonPool: Address
  dysonStrategy: Address
  feeAmount: bigint

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
  fee: Address
  bribe: Address
  emissions: bigint
  emissions_token: Address
  emissions_token_decimals: number

  // User deposit
  account_lp_balance: bigint
  account_token0_balance: bigint
  account_token1_balance: bigint
  account_gauge_balance: bigint
  account_gauge_total_weight: bigint
  account_gauge_earned: bigint

  inactive_gauge?: boolean

  _a0Expect: bigint
  _a1Expect: bigint
}

export interface MaNFTInfo {
  token_id: number
  name: string
  symbol: string
  ma_gauge_id: number
  pair_address: string
  gauge: string
  owner: string
  lp_balance: bigint
  weight: bigint
  maturity_level: number
}

export interface MaNFTInfoV3 {
  token_id: number
  name: string
  symbol: string
  // ma_gauge_id: number;
  pair_address: string
  vault_address: string

  gauge: string
  owner: string

  lp_balance: bigint
  weight: bigint

  emissions_claimeable: bigint
  maturity_time: bigint
  maturity_multiplier: bigint
}

/*
export interface TokenBribe {
    token: string;
    decimals: number;
    amount: number;
    symbol: string;
}

export interface PairBribeEpoch {
    epochTimestamp: number;
    totalVotes: number;
    pair: string;
    tokenBribe:    
}*/

export interface CLPairInfo {}
