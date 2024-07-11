/* eslint-disable @typescript-eslint/no-explicit-any */
import { Address } from 'viem'
import { useAccount } from 'wagmi'

interface IActiveConnectionDetails {
  chainId?: number
  chain?: any
  account?: Address
  isConnected: boolean
  isConnecting: boolean
}

export default function useActiveConnectionDetails(): IActiveConnectionDetails {
  /**
   * This hook is used to get the current connection details for the application
   * Used to display the current connection details, unifying account abstraction with defi
   * This hook should be the only one used in the application to interact with web3
   */
  const {
    chainId,
    address: wagmiAddress,
    isConnected: wagmiIsConnected,
    isConnecting: wagmiIsConnecting,
  } = useAccount()

  return {
    chainId,
    isConnected: wagmiIsConnected,
    isConnecting: wagmiIsConnecting,
    account: wagmiAddress,
  }
}
