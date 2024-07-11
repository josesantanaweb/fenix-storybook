import useActiveConnectionDetails from '@/src/library/hooks/web3/useActiveConnectionDetails'
import { BigNumber, ethers } from 'ethers'
import { writeContract } from '@wagmi/core'
import { Abi } from 'viem'
import { wagmiConfig } from '@/src/app/layout'
import { NATIVE_ETH_LOWERCASE } from '@/src/library/Constants'
import { getWeb3Provider } from '@/src/library/utils/web3'
import { IToken } from '@/src/library/types'

interface ApproveTokenParams {
  tokenAddress: `0x${string}`
  contractAddress: `0x${string}`
  abi: Abi
  amount?: BigNumber
  onSuccess: () => void
  onError: () => void
  onTransactionSuccess: (
    hash: `0x${string}` | undefined,
    tokenSell: IToken,
    tokenGet: IToken,
    isApproval: boolean
  ) => void
  onTransactionError: (e: any) => void
}

export const approveToken = async ({
  tokenAddress,
  contractAddress,
  abi,
  amount,
  onSuccess,
  onError,
  onTransactionSuccess,
  onTransactionError,
}: ApproveTokenParams) => {
  try {
    const approvalAmount = amount || ethers.constants.MaxUint256
    const hash = await writeContract(wagmiConfig, {
      abi: abi,
      address: tokenAddress,
      functionName: 'approve',
      args: [contractAddress, approvalAmount],
    })

    onSuccess()
    onTransactionSuccess(hash, { address: tokenAddress } as IToken, { address: contractAddress } as IToken, true)

    return hash
  } catch (error) {
    onError()
    onTransactionError(error)
  }
}
export const switchTokensValues = (
  token0: any,
  token1: any,
  setToken0: (token: any) => void,
  setToken1: (token: any) => void
) => {
  setToken0(token1)
  setToken1(token0)
}

export const isNativeToken = (token: string | undefined) => {
  if (!token) return false
  if (token?.toLowerCase() === NATIVE_ETH_LOWERCASE) return true
  return false
}
