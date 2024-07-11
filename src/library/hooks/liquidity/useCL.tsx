/* eslint-disable @typescript-eslint/no-explicit-any */

import { Address, http, maxUint256 } from 'viem'
import { multicall, writeContract } from '@wagmi/core'
import { createConfig, fallback, useAccount, useChainId, useContractWrite, useWriteContract } from 'wagmi'
import {
  ALGEBRA_ABI,
  ALGEBRA_FACTORY_ABI,
  CL_MANAGER_ABI,
  ERC20_ABI,
  FACTORY_ABI,
  ROUTERV2_ABI,
  TICK_MATH_ABI,
} from '../../constants/abi'
import { blast } from 'viem/chains'
import { ethers } from 'ethers'
import { contractAddressList } from '../../constants/contactAddresses'
import { injected } from 'wagmi/connectors'
import { NATIVE_ETH_LOWERCASE } from '../../Constants'

export async function getAlgebraPoolPrice(token1: Address, token2: Address) {
  if (token1.toLowerCase() == NATIVE_ETH_LOWERCASE) token1 = '0x4300000000000000000000000000000000000004' as Address
  if (token2.toLowerCase() == NATIVE_ETH_LOWERCASE) token2 = '0x4300000000000000000000000000000000000004' as Address

  /**
   * This hook is used to get token current price on an AlgebraPool
   */

  const pool = await multicall(
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
          abi: ALGEBRA_FACTORY_ABI,
          address: contractAddressList.cl_factory as Address,
          functionName: 'poolByPair',
          args: [token1, token2],
        },
      ],
    }
  )

  const state = await multicall(
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
          abi: ALGEBRA_ABI,
          address: pool[0].result as Address,
          functionName: 'globalState',
          args: [],
        },
      ],
    }
  )

  if (state[0].status === 'failure') {
    //
    return {
      price: 0,
      currentTick: 0,
    }
  }
  const result: [number, number, number, number, number, boolean] = state[0].result as [
    number,
    number,
    number,
    number,
    number,
    boolean,
  ]

  //
  return {
    price: sqrtPriceToPrice(result[0].toString()),
    currentTick: result[1],
  }
}

export async function getTickToPrice(tick: any) {
  /**
   * This hook is used to change tick into price on AlgebraPool
   */

  const price = await multicall(
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
          abi: TICK_MATH_ABI,
          address: contractAddressList.tick_math as Address,
          functionName: 'getSqrtRatioAtTick',
          args: [tick],
        },
      ],
    }
  )

  if (price[0].status === 'failure') return 0
  return sqrtPriceToPrice(price[0].result as string)
}

export async function getPriceToTick(price: any) {
  price = priceToSqrtPrice(Number(BigInt(parseInt((price * 1e18).toString()))))
  /**
   * This hook is used to change price into tick on AlgebraPool
   */

  const tick = await multicall(
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
          abi: TICK_MATH_ABI,
          address: contractAddressList.tick_math as Address,
          functionName: 'getTickAtSqrtRatio',
          args: [price],
        },
      ],
    }
  )

  if (tick[0].status === 'failure') return 0
  return tick[0].result
}

export async function getPriceAndTick(price: any) {
  if (price == Infinity)
    return { price: maxUint256, tick: 887220 }
  if (price == 0) return { price: 0, tick: -887220 }
  if (isNaN(price)) return { price: 0, tick: 0 }
  price = priceToSqrtPrice(price > 1 ? BigInt(price * 1e18) : parseInt((price * 1e18).toString()))
  /**
   * This hook is used to get info from AlgebraPool
   */

  const tick = await multicall(
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
          abi: TICK_MATH_ABI,
          address: contractAddressList.tick_math as Address,
          functionName: 'getPriceAndTick',
          args: [price],
        },
      ],
    }
  )

  if (tick[0].status === 'failure') {
    //
    return { price: 0, tick: 0 }
  }
  const result: [number, number] = tick[0].result as [number, number]

  return {
    price: sqrtPriceToPrice(result[1].toString()),
    tick: result[0],
  }
}

export async function getAmounts(cTick: any, hTick: any, lTick: any, amount0: any, amount1: any) {
  const amounts = await multicall(
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
          abi: TICK_MATH_ABI,
          address: contractAddressList.tick_math as Address,
          functionName: 'getAmounts',
          args: [
            cTick,
            hTick,
            lTick,
            ethers.utils.parseUnits(parseFloat(amount0).toFixed(10), 'ether'),
            ethers.utils.parseUnits(parseFloat(amount1).toFixed(10), 'ether'),
          ],
        },
      ],
    }
  )

  if (amounts[0].status === 'failure') {
    //
    return { amount0: amount0, amount1: amount1 }
  }
  const result: [number, number] = amounts[0].result as [number, number]

  return {
    amount0: result[0],
    amount1: result[1],
  }
}

export async function getRatio(cTick: any, hTick: any, lTick: any) {
  if (cTick == 0 && hTick == 0) return '1'
  const amounts = await multicall(
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
          abi: TICK_MATH_ABI,
          address: contractAddressList.tick_math as Address,
          functionName: 'getAmounts',
          args: [cTick, hTick, lTick, ethers.utils.parseUnits('1', 'ether'), ethers.utils.parseUnits('1', 'ether')],
        },
      ],
    }
  )

  if (amounts[0].status === 'failure') {
    //
    return '1'
  }
  const result: [number, number] = amounts[0].result as [number, number]
  if (Number(result[1]) == 0) return '1'
  return (Number(result[0]) / Number(result[1])).toString()
}

export async function getPositionData(id: any) {
  const positions = await multicall(
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
          abi: CL_MANAGER_ABI,
          address: contractAddressList.cl_manager as Address,
          functionName: 'positions',
          args: [id],
        },
      ],
    }
  )

  if (positions[0].status === 'failure') {
    //
    return false
  }

  const info: [number, Address, Address, Address, number, number, number, number, number, number, number] = positions[0]
    .result as [number, Address, Address, Address, number, number, number, number, number, number, number]

  const pool = await multicall(
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
          abi: ALGEBRA_FACTORY_ABI,
          address: contractAddressList.cl_factory as Address,
          functionName: 'poolByPair',
          args: [info[2], info[3]],
        },
      ],
    }
  )

  const state = await multicall(
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
          abi: ALGEBRA_ABI,
          address: pool[0].result as Address,
          functionName: 'globalState',
          args: [],
        },
      ],
    }
  )

  if (state[0].status === 'failure') return [0, 0, 0, 0, 0, false]
  const stateResult: [number, number, number, number, number, boolean] = state[0].result as [
    number,
    number,
    number,
    number,
    number,
    boolean,
  ]

  const amounts = await multicall(
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
          abi: TICK_MATH_ABI,
          address: contractAddressList.tick_math as Address,
          functionName: 'getAmountsForLiquidityTicks',
          args: [stateResult[1], info[4], info[5], info[6]],
        },
      ],
    }
  )

  const _amounts: [number, number] = amounts[0].result as [number, number]

  return {
    id: id,
    token0: info[2],
    token1: info[3],
    liquidity: info[6],
    amount0: _amounts[0],
    amount1: _amounts[1],
    ratio: _amounts[0] == 0 ? 0 : parseInt(_amounts[1].toString()) / parseInt(_amounts[0].toString()),
    pool: pool[0].result as Address,
  }
}

export async function getPositionDataByPoolAddresses(addresses: any) {
  const result = await multicall(
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
      contracts: addresses.map((address: any) => {
        return {
          address: address.id,
          abi: ALGEBRA_ABI,
          functionName: 'globalState',
        }
      }),
    }
  )

  const callsArray = []
  for (let i = 0; i < result.length; i++) {
    if (!result[i]) continue
    const stateResult: [number, number, number, number, number, boolean] = result[i].result as [
      number,
      number,
      number,
      number,
      number,
      boolean,
    ]

    callsArray.push({
      abi: TICK_MATH_ABI,
      address: contractAddressList.tick_math as Address,
      functionName: 'getAmountsForLiquidityTicks',
      args: [stateResult[1], addresses[i].lower, addresses[i].higher, addresses[i].liq],
    })
  }

  const amounts = await multicall(
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
      contracts: callsArray,
    }
  )

  return amounts.map((amount) => {
    const _amounts: [number, number] = amount.result as [number, number]
    return _amounts
  })
}

export function sqrtPriceToPrice(sqrtPrice: string) {
  const priceQ64_96 = BigInt(sqrtPrice) * BigInt(sqrtPrice) * BigInt(1e18)
  const price = priceQ64_96 >> BigInt(2 * 96)
  const priceNumber = Number(price)

  return priceNumber
}

export function priceToSqrtPrice(priceNumber: any): string {
  if (priceNumber == 0) return '0'
  const priceBigInt: bigint = BigInt(priceNumber) << BigInt(2 * 96)
  const sqrted = sqrtBigInt(priceBigInt / BigInt(1e18))
  return sqrted.toString()
}

function sqrtBigInt(value: bigint): bigint {
  if (value < (BigInt(0) as bigint)) {
    return BigInt(0)
  }

  if (value < (BigInt(0) as bigint)) {
    return value
  }

  const newtonIteration = (n: bigint, x0: bigint): bigint => {
    const x1: bigint = (n / x0 + x0) >> (BigInt(1) as bigint)
    if (x0 === x1 || x0 === x1 - (BigInt(1) as bigint)) {
      return x0
    }
    return newtonIteration(n, x1)
  }

  return newtonIteration(value, BigInt(1) as bigint)
}
