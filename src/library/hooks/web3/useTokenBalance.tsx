/* eslint-disable @typescript-eslint/no-explicit-any */

import { Address, http } from 'viem'
import { multicall } from '@wagmi/core'
import { createConfig, fallback } from 'wagmi'
import { ERC20_ABI } from '../../constants/abi'
import { blast, blastSepolia } from 'viem/chains'
import { ethers } from 'ethers'
import { publicClient } from '../../constants/viemClient'
import { NATIVE_ETH_LOWERCASE } from '../../Constants'
import { configwallets, wagmiConfig } from '@/src/app/layout'
import { getPublicClient } from '@wagmi/core'
export async function getTokenBalance(token1: Address, user: Address) {
  if (!token1 || !user) return '0'
  /**
   * This hook is used to get token balance for a user address
   */

  if (token1.toLowerCase() == NATIVE_ETH_LOWERCASE) {
    return await publicClient.getBalance({ address: user })
  }

  const balance = await multicall(
    createConfig({
      chains: [blast],
      transports: {
        [blast.id]: fallback([
          http('https://ancient-powerful-emerald.blast-mainnet.quiknode.pro/e93288d60f12f4fbb136d310242ac46df10b8f74/'),
          http('https://rpc.blast.io'),
        ]),
      },
    }),
    {
      contracts: [
        {
          abi: ERC20_ABI,
          address: token1,
          functionName: 'balanceOf',
          args: [user],
        },
      ],
    }
  )

  if (balance[0].status === 'failure') return '0'

  const b: string = balance[0].result as string
  return b
}

export async function getTokensBalance(tokens: Address[], user: Address) {
  if (tokens.length < 1 || !user) return {}

  /**
   * This hook is used to get tokens balance for a user address
   */

  const contractsList = tokens.map((item) => {
    if (item.toLowerCase() == '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
      item = '0x4300000000000000000000000000000000000004'

    return {
      abi: ERC20_ABI,
      address: item,
      functionName: 'balanceOf',
      args: [user],
    }
  })

  const balance = await multicall(
    createConfig({
      chains: [blast],
      transports: {
        [blast.id]: fallback([
          http('https://ancient-powerful-emerald.blast-mainnet.quiknode.pro/e93288d60f12f4fbb136d310242ac46df10b8f74/'),
          http('https://rpc.blast.io'),
        ]),
      },
    }),
    {
      contracts: contractsList,
    }
  )

  const balances: any = {}
  balances['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'] = await publicClient.getBalance({ address: user })

  for (let i = 0; i < balance.length; i++) {
    balances[tokens[i]] = balance[i].result
  }

  if (balance.length == 0 || balance[0].status === 'failure') return {}
  return balances
}
export async function getTokensBalanceChainSpecific(tokens: Address[], user: Address) {
  if (tokens.length < 1 || !user) return {}

  /**
   * This hook is used to get tokens balance for a user address
   */

  const contractsList = tokens.map((item) => {
    if (item.toLowerCase() == '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
      item = '0x4300000000000000000000000000000000000004'

    return {
      abi: ERC20_ABI,
      address: item,
      functionName: 'balanceOf',
      args: [user],
    }
  })

  const balance = await multicall(wagmiConfig, {
    contracts: contractsList,
  })
  //
  const balances: any = {}
  balances['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'] = await publicClient.getBalance({ address: user })

  for (let i = 0; i < balance.length; i++) {
    balances[tokens[i]] = balance[i].result
  }

  if (balance.length == 0 || balance[0].status === 'failure') return {}
  return balances
}
export async function fetchTokenBalance(token: Address, user: Address) {
  try {
    const publicClient = getPublicClient(wagmiConfig)
    const balance = await publicClient?.readContract({
      address: token,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [user],
    })
    return balance
  } catch (e) {
    return '0'
  }
}
