import { isAddress } from '@/src/library/utils/validate'
import { algebraPoolABI } from '@/src/library/web3/abis/algebraPool'
import { useReadContract } from 'wagmi'

export default function useAlgebraSafelyStateOfAMM(pool: `0x${string}`) {
  const data = useReadContract({
    address: pool,
    functionName: 'safelyGetStateOfAMM',
    abi: algebraPoolABI,
  })
  return {
    loading: data.isLoading,
    isError: data.isError,
    error: data.error,
    data: data.data,
    refetch: data.refetch,
  }
}
