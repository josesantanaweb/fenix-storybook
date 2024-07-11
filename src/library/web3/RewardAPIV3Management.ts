//@ts-nocheck
import { CurrentEpochReward, RewardPairInfo, Rewards, ToClaim } from './apis/RewardAPIData'
import RewardAPIABIV3 from './abis/RewardAPIABIV3'
import { RewardAPIV3Address } from './ContractAddresses'
import { Address } from 'viem'
import { getPublicClient, readContract } from '@wagmi/core'
import { Token, TokenData } from '../structures/common/TokenData'
import { getCurrentEpochRewardTokens } from '../apollo/rewards/parsers/Rewards'
import { wagmiConfig } from '@/src/app/layout'
import { REWARD_API_ADDRESS } from '@/src/library/constants/addresses'
/**
 * RewardAPI: getPairBribe
 * @param pairAddress
 * @returns
 */
export async function getPoolRewards(pairAddress: Address): Promise<Rewards> {
  const rewardTokens = (await readContract(wagmiConfig, {
    address: RewardAPIV3Address,
    abi: RewardAPIABIV3,
    functionName: 'getPairBribe',
    args: [pairAddress],
  })) as Rewards

  return rewardTokens
}

export async function getAllPairRewards(
  user: Address,
  availableTokensData: { [tokenAddr: string]: Token },
  chainId: number
): Promise<RewardPairInfo[]> {
  const l: RewardPairInfo[] = []
  const publicClient = getPublicClient(wagmiConfig)
  const rewardPairs = (await publicClient?.readContract({
    address: REWARD_API_ADDRESS[chainId],
    functionName: 'getAllPairRewards',
    args: [user, 250, 0],
    abi: RewardAPIABIV3,
  })) as RewardPairInfo[]
  const subgraphTokenRewards = await getCurrentEpochRewardTokens(availableTokensData, chainId)

  for (const r of rewardPairs) {
    const rc = {
      ...r,
    }
    rc['externalBribeReward'] = subgraphTokenRewards[r._externalBribeAddress.toLowerCase()] || {
      tokens: [],
      symbols: [],
      decimals: [],
      amounts: [],
      bribe: '',
    }
    rc['internalBribeReward'] = subgraphTokenRewards[r._internalBribeAddress.toLowerCase()] || {
      tokens: [],
      symbols: [],
      decimals: [],
      amounts: [],
      bribe: '',
    }

    l.push(rc)
  }

  return l as RewardPairInfo[]
}

export async function getAllClPairRewards(
  user: Address,
  availableTokensData: { [tokenAddr: string]: Token },
  chainId: number
) {
  const l: RewardPairInfo[] = []
  const publicClient = getPublicClient(wagmiConfig)

  const rewardPairs = (await publicClient?.readContract({
    address: REWARD_API_ADDRESS[chainId],
    abi: RewardAPIABIV3,
    functionName: 'getAllCLPairRewards',
    args: [user, 250, 0],
  })) as RewardPairInfo[]

  const subgraphTokenRewards = await getCurrentEpochRewardTokens(availableTokensData, chainId)

  for (const r of rewardPairs) {
    const rc = {
      ...r,
    }
    rc['externalBribeReward'] = subgraphTokenRewards[r._externalBribeAddress.toLowerCase()] || {
      tokens: [],
      symbols: [],
      decimals: [],
      amounts: [],
      bribe: '',
    }
    rc['internalBribeReward'] = subgraphTokenRewards[r._internalBribeAddress.toLowerCase()] || {
      tokens: [],
      symbols: [],
      decimals: [],
      amounts: [],
      bribe: '',
    }

    l.push(rc)
  }

  return l as RewardPairInfo[]
}

export async function getExpectedClaimForNextEpoch(tokenId: number, pairs: Address[]): Promise<Rewards[]> {
  const rewards = (await readContract(wagmiConfig, {
    address: RewardAPIV3Address,
    abi: RewardAPIABIV3,
    functionName: 'getExpectedClaimForNextEpoch',
    args: [tokenId, pairs],
  })) as Rewards[]

  return rewards
}

export async function getAvailableRewards(
  tokenId: number,
  targetSearchPairs: [string[], string[][]]
): Promise<CurrentEpochReward[]> {
  const rewards = (await readContract(wagmiConfig, {
    address: RewardAPIV3Address,
    abi: RewardAPIABIV3,
    functionName: 'getAvailableRewards',
    args: [tokenId, targetSearchPairs[0], targetSearchPairs[1]],
  })) as CurrentEpochReward[]

  return rewards
}

export async function getAmountToClaimFromUser(user: Address, targetSearchPairs: [string[], string[][]]) {
  const rewards = (await readContract(wagmiConfig, {
    address: RewardAPIV3Address,
    abi: RewardAPIABIV3,
    functionName: 'getAmountToClaim',
    args: [user, targetSearchPairs[0], targetSearchPairs[1]],
  })) as ToClaim[]

  return rewards
}
