import { Address } from '@/src/library/types'
import { erc20Abi } from 'viem'
import { useReadContract } from 'wagmi'
import { ethers } from 'ethers'
import { useState } from 'react'

function useERC20Allowance(tokenAddress: Address, ownerAddress: Address, spenderAddress: Address) {
  const [refreshIndex, setRefreshIndex] = useState<number>(0)
  const refreshAllowance = () => setRefreshIndex((prev) => prev + 1)

  const { data, isError, isLoading } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [ownerAddress as `0x${string}`, spenderAddress as `0x${string}`],
  })

  const allowance = data ? parseFloat(ethers.utils.formatEther(data)) : 0

  return { allowance, isError, isLoading, refreshAllowance }
}

export default useERC20Allowance
