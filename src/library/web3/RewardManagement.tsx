import { writeContract } from '@wagmi/core'
import { wagmiConfig } from '@/src/app/layout'
import { Address, Hash } from 'viem'
import externalbribeABI from './abis/externalBribeABI'

export async function createBribe(tokenAddress: Address, amount: string, externalBribeAddress: Address): Promise<Hash> {
  const data = await writeContract(wagmiConfig, {
    address: externalBribeAddress,
    abi: externalbribeABI,
    functionName: 'notifyRewardAmount',
    args: [tokenAddress, amount],
  })

  return data as Hash
  // return data?.hash as Hash
}
