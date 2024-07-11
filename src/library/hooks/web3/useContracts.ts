import { erc20Abi } from 'viem'
import { useContract } from './contracts'

export function useERC20Contract(tokenAddress: string | null | undefined) {
  return useContract(tokenAddress, erc20Abi)
}
