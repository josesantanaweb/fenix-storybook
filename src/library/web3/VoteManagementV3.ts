import { getPublicClient, readContract, getWalletClient, writeContract } from '@wagmi/core'
import { Address, Hash } from 'viem'

import VoterV3ABI from './abis/VoterV3ABI'

import { VoterV3Address } from './ContractAddresses'
import { encodeFunctionData } from 'viem'
import { wagmiConfig } from '@/src/app/layout'

export async function resetVotes(tokenId: number): Promise<Hash> {
  const data = await writeContract(wagmiConfig, {
    address: VoterV3Address,
    abi: VoterV3ABI,
    functionName: 'reset',
    args: [tokenId],
  })

  return data as Hash
}

export async function castVotes(tokenId: number, poolAddresses: Address[], weights: bigint[]): Promise<Hash> {
  const provider = getPublicClient(wagmiConfig)
  const signer = await getWalletClient(wagmiConfig)

  const gas = await provider?.estimateGas({
    // args: [tokenId],
    data: encodeFunctionData({
      abi: VoterV3ABI,
      functionName: 'vote',
      args: [BigInt(tokenId), poolAddresses, weights],
    }),
    to: VoterV3Address,
    account: signer.account,
  })
  // const gas = await contract.estimateGas.vote(tokenId, poolAddresses, weights);

  const data = await writeContract(wagmiConfig, {
    address: VoterV3Address,
    abi: VoterV3ABI,
    functionName: 'vote',
    args: [tokenId, poolAddresses, weights],
    gas: gas,
  })

  return data as Hash
}

export async function getPoolWeight(pairAddress: Address): Promise<bigint> {
  const weight = (await readContract(wagmiConfig, {
    address: VoterV3Address,
    abi: VoterV3ABI,
    functionName: 'weights',
    args: [pairAddress],
  })) as bigint

  return weight
}

export async function getTotalWeight(): Promise<bigint> {
  const weight = (await readContract(wagmiConfig, {
    address: VoterV3Address,
    abi: VoterV3ABI,
    functionName: 'totalWeight',
    args: [],
  })) as bigint

  return weight
}
