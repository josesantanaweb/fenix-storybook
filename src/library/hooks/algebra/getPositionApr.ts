import { positions } from '@/src/components/Dashboard/MyStrategies/Strategy'

import { CurrencyAmount, NonfungiblePositionManager, Pool, unwrappedToken } from '@cryptoalgebra/integral-sdk'
import { contractAddressList } from '../../constants/contactAddresses'
import { configwallets, wagmiConfig } from '@/src/app/layout'
import { CL_MANAGER_ABI } from '../../constants/abi'
import { getPublicClient } from '@wagmi/core'
import { FALLBACK_CHAIN_ID } from '../../constants/chains'
import { simulateContract } from '@wagmi/core'
import { Abi, Address, getContract } from 'viem'
import { Tenderly, Network } from '@tenderly/sdk'
import { Interface } from 'ethers/lib/utils'

export async function getPositionAPR(
  liquidity: String,
  position: any,
  pool: any,
  poolFeeData: any,
  nativePrice: string | never[]
) {
  if (!pool || !poolFeeData || !nativePrice) return

  try {
    //

    // Today fees
    // const poolDayFees = poolFeeData && Boolean(poolFeeData.length) && Number(poolFeeData[0].feesUSD)

    // Avg fees
    const poolDayFees =
      poolFeeData &&
      Boolean(poolFeeData.length) &&
      poolFeeData.reduce((acc: number, v: any) => acc + Number(v.feesUSD), 0) / poolFeeData.length

    const yearFee = poolDayFees && poolDayFees * 365

    const liquidityRelation = position && liquidity && Number(position.liquidity.toString()) / Number(liquidity)

    const [amount0, amount1] = position ? [position.depositedToken0, position.depositedToken1] : [0, 0]

    const tvl =
      pool &&
      Number(pool.token0.derivedMatic) * Number(nativePrice) * Number(amount0) +
        Number(pool.token1.derivedMatic) * Number(nativePrice) * Number(amount1)
    //
    return liquidityRelation && yearFee && tvl && ((yearFee * liquidityRelation) / tvl) * 100
  } catch {
    return 0
  }
}

// export async function getPositionFees(pool: Pool, positionId: number, position: any) {
//   const publicClient = getPublicClient(wagmiConfig)
//   const MAX_UINT128 = 340282366920938463463374607431768211455n
//   const tenderlyInstance = new Tenderly({
//     accountName: 'sanchitdawareth',
//     projectName: 'project',
//     accessKey: '134gEYbYnikLK4ESkVNSJdY9VYMKTZZU',
//     network: Network.BLAST, // Replace with the appropriate network
//   })
//   const collectParams = {
//     tokenId: BigInt(positionId),
//     recipient: position.owner,
//     amount0Max: MAX_UINT128,
//     amount1Max: MAX_UINT128,
//   }

//   const algebraPositionManager = await getContract({
//     abi: CL_MANAGER_ABI,
//     address: contractAddressList.cl_manager as `0x${string}`,
//     client: publicClient,
//   })

//   const owner = await algebraPositionManager.read.ownerOf([BigInt(positionId)])

//   const {
//     result: [fees0, fees1],
//   }: { result: [bigint, bigint] } = await algebraPositionManager.simulate.collect(
//     [
//       {
//         tokenId: BigInt(positionId),
//         recipient: owner,
//         amount0Max: MAX_UINT128,
//         amount1Max: MAX_UINT128,
//       },
//     ],
//     {
//       account: owner as Address,
//     }
//   )
//   // const {
//   //   result: [fees0, fees1],
//   // }: { result: [bigint, bigint] } = await publicClient.simulateContract({
//   //   abi: CL_MANAGER_ABI,
//   //   address: contractAddressList.cl_manager as Address,
//   //   functionName: 'collect',
//   //   args: [collectParams],
//   // })
//   // const {
//   //   result: [fees0, fees1],
//   // }: { result: [bigint, bigint] } = await algebraPositionManager.simulate.collect([
//   //   [
//   //     {
//   //       tokenId: BigInt(positionId),
//   //       recipient: owner,
//   //       amount0Max: MAX_UINT128,
//   //       amount1Max: MAX_UINT128,
//   //     },
//   //   ],
//   //   {
//   //     account: owner,
//   //   },
//   // ])
//   console.log(fees0, fees1)
//   return [fees0.toString(), fees1.toString()]
// }
