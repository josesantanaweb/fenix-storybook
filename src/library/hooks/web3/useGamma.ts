import { gammaUniProxyABI } from '../../constants/abi'
import { Address } from '../../types'
import { useReadContract } from 'wagmi'
import useActiveConnectionDetails from './useActiveConnectionDetails'
import { ethers } from 'ethers'
import { useState } from 'react'

import { useToken0, useToken0TypedValue, useToken1, useToken1TypedValue } from '@/src/state/liquidity/hooks'
import { erc20Abi, parseEther } from 'viem'
import { useWriteContract } from 'wagmi'
import useERC20Allowance from '@/src/library/hooks/web3/erc20/useERC20Allowance'

export const useGammaSmartContracts = (token0: Address, token1: Address) => {
  //   const gammaProxySmartContract = useContract('0xA42d55074869491D60Ac05490376B74cF19B00e6', gammaUniProxyABI)
  //   const gammaHypervisorSmartContract = useContract('0x02203f2351E7aC6aB5051205172D3f772db7D814')
  const gammaProxySmartContract = '0xA42d55074869491D60Ac05490376B74cF19B00e6' as `0x${string}`
  const gammaHypervisorSmartContract = '0x02203f2351E7aC6aB5051205172D3f772db7D814' as `0x${string}`
  //   TODO: Return the smart contracts instances
  return { gammaProxySmartContract, gammaHypervisorSmartContract }
}

export const useGammaToken1Range = () => {
  const token0 = useToken0()
  const token1 = useToken1()

  const token0Amount = useToken0TypedValue()

  const { gammaProxySmartContract, gammaHypervisorSmartContract } = useGammaSmartContracts(token0, token1) as {
    gammaProxySmartContract: `0x${string}`
    gammaHypervisorSmartContract: `0x${string}`
  }
  // const token1DepositRange = useReadContract({
  //   address: gammaProxySmartContract,
  //   abi: gammaUniProxyABI,
  //   functionName: 'getDepositAmount',
  //   args: [gammaHypervisorSmartContract, token0, ethers.parseUnits(token0Amount || '0', 18)],
  // })
  // const range = token1DepositRange?.data || [0n, 0n]
  // return range
}

export const useGammaCreatePosition = () => {
  const { account: userAddress } = useActiveConnectionDetails() as { account: `0x${string}` }
  const token0 = useToken0()
  const token1 = useToken1()
  const token0TypedValue = useToken0TypedValue()
  const token1TypedValue = useToken1TypedValue()

  const { gammaProxySmartContract, gammaHypervisorSmartContract } = useGammaSmartContracts(token0, token1)
  const token0Amount = useToken0TypedValue()
  const { writeContractAsync } = useWriteContract()
  const token0Allowance = useERC20Allowance(token0, userAddress, gammaHypervisorSmartContract)
  const token1Allowance = useERC20Allowance(token1, userAddress, gammaHypervisorSmartContract)
  const [isToken0AlloanceGranted, setIsToken0AlloanceGranted] = useState(false)
  const [isToken1AlloanceGranted, setIsToken1AlloanceGranted] = useState(false)
  const createPosition = async () => {
    // try {
    //   if (!isToken0AlloanceGranted && token0Allowance.allowance < token0Amount) {
    //     await writeContractAsync(
    //       {
    //         address: token0,
    //         abi: erc20Abi,
    //         functionName: 'approve',
    //         args: [gammaHypervisorSmartContract, ethers.constants.MaxUint256],
    //       },
    //       {
    //         onSuccess: (data) => {
    //           setIsToken0AlloanceGranted(true)
    //         },
    //         onError: (error) => {
    //           console.error('Transaction error:', error)
    //         },
    //       }
    //     )
    //   }
    //   if (!isToken1AlloanceGranted && token1Allowance < token1TypedValue) {
    //     await writeContractAsync(
    //       {
    //         address: token1,
    //         abi: erc20Abi,
    //         functionName: 'approve',
    //         args: [gammaHypervisorSmartContract, ethers.utils.MaxUint256],
    //       },
    //       {
    //         onSuccess: (data) => {
    //           setIsToken1AlloanceGranted(true)
    //         },
    //         onError: (error) => {
    //           console.error('Transaction error:', error)
    //         },
    //       }
    //     )
    //   }
    //   await writeContractAsync(
    //     {
    //       abi: gammaUniProxyABI,
    //       address: gammaProxySmartContract,
    //       functionName: 'deposit',
    //       args: [
    //         ethers.utils.parseUnits(token1TypedValue || '0', 18),
    //         ethers.utils.parseUnits(token0TypedValue || '0', 18),
    //         userAddress,
    //         gammaHypervisorSmartContract,
    //         [0n, 0n, 0n, 0n],
    //       ],
    //     },
    //     {
    //       onSuccess: (data) => {
    //         alert('Transaction sent! TxHash: ' + data)
    //       },
    //       onError: (error) => {
    //         console.error('Transaction error:', error)
    //       },
    //     }
    //   )
    // } catch (error) {
    //
    // }
  }

  return { createPosition }
}
