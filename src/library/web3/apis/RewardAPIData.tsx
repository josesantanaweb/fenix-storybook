import { Address } from 'viem'

export interface Bribes {
  tokens: Address[]
  symbols: string[]
  decimals: bigint[]
  amounts: bigint[]
  bribe: Address
}

export interface Rewards {
  bribes: Bribes[]
}

export interface RewardPairInfo {
  _pool: Address
  _gauge: Address
  _externalBribeAddress: Address
  _internalBribeAddress: Address
  totalVotesOnGauge: bigint
  totalVotesOnGaugeByUser: bigint
  externalBribeReward: Bribes
  internalBribeReward: Bribes
}

export interface CurrentEpochReward {
  amounts: bigint[]
  bribe: Address
  tokens: Address[]
}

export interface ToClaim {
  tokens: Address[]
  symbols: Address[]
  decimals: bigint[]
  amounts: bigint[]

  bribe: Address
}
