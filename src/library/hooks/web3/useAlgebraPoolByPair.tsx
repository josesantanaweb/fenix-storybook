import { useReadContract } from 'wagmi'
import { algebraFactoryABI } from '@/src/library/web3/abis/algebraFactory'
import { useMemo } from 'react'
import { zeroAddress } from 'viem'
import { contractAddressList } from '@/src/library/constants/contactAddresses'

export default function useAlgebraPoolByPair(token0: `0x${string}`, token1: `0x${string}`) {
  const [sortedToken0, sortedToken1]: `0x${string}`[] = useMemo(() => {
    const tokens: `0x${string}`[] = [token0, token1].sort()
    return tokens
  }, [token0, token1])
  const data = useReadContract({
    address: contractAddressList.cl_factory as `0x${string}`,
    functionName: 'poolByPair',
    args: [sortedToken0, sortedToken1],
    abi: algebraFactoryABI,
  })
  return {
    loading: data.isLoading,
    isError: data.isError,
    refetch: data.refetch,
    error: data.error,
    data: data.data || zeroAddress,
  }
}
