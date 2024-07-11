import { erc20Abi } from 'viem'
import { useReadContract } from 'wagmi'

export function useERC20Decimals(tokenAddress: `0x${string}`) {
  const { data, isError, isLoading } = useReadContract({
    abi: erc20Abi,
    address: tokenAddress,
    functionName: 'decimals',
  })
  return {
    decimals: data ? data : 18,
    isError,
    isLoading,
  }
}
