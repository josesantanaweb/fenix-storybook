import { BN_TEN, toBN } from '@/src/library/utils/numbers'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
// import { BN_TEN, toBN } from 'utils/numbers'
// import { useERC20Contract } from 'hooks/useContract'
import { Address } from 'viem'
import { useReadContract } from 'wagmi' // Asumiendo que este es el nuevo hook
import { useERC20Contract } from '../useContracts'

interface UseERC20Balance {
  tokenAddress: Address
  tokenDecimals: number
  owner: Address | undefined
  enabled?: boolean
}

export function useERC20Balance({ tokenAddress, tokenDecimals, owner }: UseERC20Balance): {
  tokenBalance: BigNumber | undefined
  isSyncing: boolean
  refetch: ReturnType<typeof useReadContract>['refetch']
} {
  const contract = useERC20Contract(tokenAddress)

  const { data, isLoading, refetch } = useReadContract({
    address: contract?.address,
    abi: contract?.abi,
    functionName: 'balanceOf',
    args: [owner as Address],
  })

  const tokenBalance = useMemo(() => {
    if (data && tokenAddress) {
      return toBN(data.toString()).div(BN_TEN.pow(tokenDecimals))
    }
  }, [data, tokenAddress, tokenDecimals])

  return {
    tokenBalance,
    isSyncing: isLoading,
    refetch,
  }
}
