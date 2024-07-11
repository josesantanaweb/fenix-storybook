import pairAPIV3ABI from '../abis/PairAPIV3ABI'

import { getPublicClient } from '@wagmi/core'
import { blast, blastSepolia } from '@wagmi/core/chains'
import { MaNFTInfoV3, PairInfoV3 } from './pairAPI'
import { PairAPIV3Address } from '../ContractAddresses'
import { Address } from 'viem'
import { wagmiConfig } from '@/src/app/layout'
import { ChainId } from '@cryptoalgebra/integral-sdk'
import { PAIR_API_ADDRESS } from '../../constants/addresses'
import { FALLBACK_CHAIN_ID } from '../../constants/chains'

export async function getPairInformation(user: Address, pair: Address): Promise<PairInfoV3> {
  const publicClient = getPublicClient(wagmiConfig)

  const data = (await publicClient?.readContract({
    address: PairAPIV3Address,
    abi: pairAPIV3ABI,
    functionName: 'getPair',
    args: [pair, user],
  })) as PairInfoV3

  return data
}

export async function getCLPairInformation(user: Address, pair: Address): Promise<PairInfoV3> {
  const publicClient = getPublicClient(wagmiConfig)

  const data = (await publicClient?.readContract({
    address: PairAPIV3Address,
    abi: pairAPIV3ABI,
    functionName: 'getCLPair',
    args: [pair, user],
  })) as PairInfoV3

  return data
}

export async function getPositionsOfOwnerInGauge(owner: Address, gauge: Address): Promise<MaNFTInfoV3[]> {
  const publicClient = getPublicClient(wagmiConfig)
  const positions = (await publicClient?.readContract({
    address: PairAPIV3Address,
    abi: pairAPIV3ABI,
    functionName: 'getGaugeMaNFTsOfOwner',
    args: [owner, gauge],
  })) as {
    token_id: bigint
    name: string
    symbol: string
    vault_address: string
    pair_address: string
    gauge: string
    owner: string
    lp_balance: bigint
    weight: bigint
    emissions_claimeable: bigint
    maturity_time: bigint
    maturity_multiplier: bigint
  }[]
  const parsedPositions: MaNFTInfoV3[] = []
  for (let i = 0; i < positions.length; i++) {
    const position = positions[i]

    parsedPositions.push({
      token_id: Number(position.token_id),
      name: position.name,
      symbol: position.symbol,
      vault_address: position.vault_address,
      // ma_gauge_id: Number(position.ma_gauge_id),
      pair_address: position.pair_address,
      gauge: position.gauge,
      owner: position.owner,
      lp_balance: position.lp_balance,
      weight: position.weight,
      // maturity_level: Number(position.maturity_level),
      emissions_claimeable: position.emissions_claimeable,
      maturity_time: position.maturity_time,
      maturity_multiplier: position.maturity_multiplier,
    })
  }

  return parsedPositions
}

export async function getAllPairsForUser(user: Address, chainId: number): Promise<PairInfoV3[]> {
  const publicClient = getPublicClient(wagmiConfig)
  const allPairs = (await publicClient?.readContract({
    address: chainId ? (PAIR_API_ADDRESS[chainId] as Address) : (PAIR_API_ADDRESS[FALLBACK_CHAIN_ID] as Address),
    abi: pairAPIV3ABI,
    functionName: 'getAllPair',
    args: [user, 300, 0],
  })) as PairInfoV3[]

  const parsedPairs: PairInfoV3[] = []

  for (let i = 0; i < allPairs.length; i++) {
    const pair = allPairs[i]

    parsedPairs.push({
      pair_address: pair.pair_address,
      symbol: pair.symbol,
      name: pair.name,
      decimals: Number(pair.decimals),
      stable: pair.stable,
      total_supply: pair.total_supply,

      // Token pair info
      token0: pair.token0,
      token0_symbol: pair.token0_symbol,
      token0_decimals: Number(pair.token0_decimals),
      reserve0: pair.reserve0,
      claimable0: pair.claimable0,

      token1: pair.token1,
      token1_symbol: pair.token1_symbol,
      token1_decimals: Number(pair.token1_decimals),
      reserve1: pair.reserve1,
      claimable1: pair.claimable1,

      // pairs gauge
      gauge: pair.gauge,
      gauge_total_supply: pair.gauge_total_supply,
      fee: pair.fee,
      bribe: pair.bribe,
      emissions: pair.emissions,
      emissions_token: pair.emissions_token,
      emissions_token_decimals: Number(pair.emissions_token_decimals),

      // User deposit
      account_lp_balance: pair.account_lp_balance,
      account_token0_balance: pair.account_token0_balance,
      account_token1_balance: pair.account_token1_balance,
      account_gauge_balance: pair.account_gauge_balance,
      account_gauge_total_weight: pair.account_gauge_total_weight,
      account_gauge_earned: pair.account_gauge_earned,

      gauge_total_weight: pair.gauge_total_weight,
      clPool: pair.clPool,
      dysonPool: pair.dysonPool,
      feeAmount: pair.feeAmount,
      inactive_gauge: pair.inactive_gauge,
      dysonStrategy: pair.dysonStrategy,

      _a0Expect: pair._a0Expect,
      _a1Expect: pair._a1Expect,
    })
  }

  return allPairs
}

export async function getAllCLPairsForUser(user: Address): Promise<PairInfoV3[]> {
  const publicClient = getPublicClient(wagmiConfig)
  const allPairs = (await publicClient?.readContract({
    address: PairAPIV3Address,
    abi: pairAPIV3ABI,
    functionName: 'getAllCLPair',
    args: [user, 300, 0],
  })) as PairInfoV3[]

  const parsedPairs: PairInfoV3[] = []

  for (let i = 0; i < allPairs.length; i++) {
    const pair = allPairs[i]

    parsedPairs.push({
      pair_address: pair.pair_address,
      symbol: pair.symbol,
      name: pair.name,
      decimals: Number(pair.decimals),
      stable: pair.stable,
      total_supply: pair.total_supply,

      // Token pair info
      token0: pair.token0,
      token0_symbol: pair.token0_symbol,
      token0_decimals: Number(pair.token0_decimals),
      reserve0: pair.reserve0,
      claimable0: pair.claimable0,

      token1: pair.token1,
      token1_symbol: pair.token1_symbol,
      token1_decimals: Number(pair.token1_decimals),
      reserve1: pair.reserve1,
      claimable1: pair.claimable1,

      // pairs gauge
      gauge: pair.gauge,
      gauge_total_supply: pair.gauge_total_supply,
      fee: pair.fee,
      bribe: pair.bribe,
      emissions: pair.emissions,
      emissions_token: pair.emissions_token,
      emissions_token_decimals: Number(pair.emissions_token_decimals),

      // User deposit
      account_lp_balance: pair.account_lp_balance,
      account_token0_balance: pair.account_token0_balance,
      account_token1_balance: pair.account_token1_balance,
      account_gauge_balance: pair.account_gauge_balance,
      account_gauge_total_weight: pair.account_gauge_total_weight,
      account_gauge_earned: pair.account_gauge_earned,

      gauge_total_weight: pair.gauge_total_weight,
      clPool: pair.clPool,
      dysonPool: pair.dysonPool,
      feeAmount: pair.feeAmount,
      inactive_gauge: pair.inactive_gauge,
      dysonStrategy: pair.dysonStrategy,

      _a0Expect: pair._a0Expect,
      _a1Expect: pair._a1Expect,
    })
  }

  // return [];
  return allPairs
}
