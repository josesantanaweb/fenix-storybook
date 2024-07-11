import { ethers } from 'ethers'
import { useCallback, useState } from 'react'
import useERC20Allowance from '@/src/library/hooks/web3/erc20/useERC20Allowance'
import { useWriteContract } from 'wagmi'
import { Address } from '@/src/library/types'
import { erc20Abi } from 'viem'
interface ApproveTokenIfNeededArgs {
  tokenAddress: `0x${string}`
  spenderAddress: `0x${string}`
  desiredAmountToApprove?: bigint
}
export const useApproveERC20Token = ({
  tokenAddress,
  spenderAddress,
  desiredAmountToApprove,
}: ApproveTokenIfNeededArgs) => {
  const [isApproving, setIsApproving] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { writeContractAsync } = useWriteContract()

  const approve = useCallback(async () => {
    setIsApproving(true)
    setError(null)
    try {
      const amountToApprove = desiredAmountToApprove ?? BigInt(ethers.constants.MaxInt256.toNumber())

      await writeContractAsync({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'approve',
        args: [spenderAddress, amountToApprove],
      })
    } catch (e) {
      setError(e as Error)
      console.error('Error during token approval:', e)
    } finally {
      setIsApproving(false)
    }
  }, [tokenAddress, spenderAddress, writeContractAsync, desiredAmountToApprove])

  return { approve, isApproving, error }
}
