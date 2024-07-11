import { useMemo } from 'react'
import { Abi, Address, WalletClient, getContract } from 'viem'
import { usePublicClient, useWalletClient } from 'wagmi'
import useActiveConnectionDetails from './useActiveConnectionDetails'
import { AddressZero } from '../../constants/misc'

export function useContract<T extends Abi>(address: string | null | undefined, ABI?: T) {
  const { chainId } = useActiveConnectionDetails()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  return useMemo(() => {
    if (!address || !ABI || !chainId) return null
    if (address === AddressZero) return null
    try {
      return getContract({
        address: address as Address,
        abi: ABI,
        client: {
          public: publicClient,
          wallet: (walletClient as WalletClient) ?? publicClient,
        },
      })
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, chainId, walletClient, publicClient])
}
