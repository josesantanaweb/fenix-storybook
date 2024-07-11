import { NextRequest, NextResponse } from 'next/server'

// api
import getProtocolCoreClient, { getAlgebraClient } from '@/src/library/apollo/client/protocolCoreClient'
import { POOLSV2_LIST, POOLS_TVL } from '@/src/library/apollo/queries/pools'
import { TokenDataProvider } from '@/src/library/providers/TokenDataProvider'

// helpers
import { totalCampaigns } from '@/src/library/utils/campaigns'
import { toBN } from '@/src/library/utils/numbers'

// constants
import boostedPools from '@/src/library/constants/pools/boosted-pools'

// personal constants
const POINTS_SUPLY = 25055600
const POINTS_TOTAL_VALUE = 37082.288
const PRICE_PER_POINT = POINTS_TOTAL_VALUE / POINTS_SUPLY
export const revalidate = 60

export async function GET(request: NextRequest) {
  const client = getAlgebraClient()
  const protocolClient = getProtocolCoreClient()

  const {
    data: { pools },
  } = await client.query({
    query: POOLS_TVL,
    fetchPolicy: 'cache-first',
  })
  const {
    data: { pairs: pairs2 },
  } = await protocolClient.query({
    query: POOLSV2_LIST,
    fetchPolicy: 'cache-first',
  })

  const tokenData = await TokenDataProvider.getTokenPrices()
  let poolData: any
  const enhancedBoostedPools = boostedPools.map((pool) => {
    if (pool.poolType === 'v2') {
      // sacar tvl con la resever
      poolData = pairs2.find((p: any) => p?.id?.toLowerCase() === pool?.id?.toLowerCase())

      const token0Price =
        tokenData.find((t) => t.tokenAddress.toLowerCase() === poolData?.token0?.id?.toLowerCase())?.priceUSD || 0
      const token1Price =
        tokenData.find((t) => t.tokenAddress.toLowerCase() === poolData?.token1?.id?.toLowerCase())?.priceUSD || 0
      console.log(token0Price)
      console.log(token1Price)
      const reserve0USD = toBN(poolData.reserve0).multipliedBy(token0Price)
      const reserve1USD = toBN(poolData.reserve1).multipliedBy(token1Price)
      poolData = { ...poolData, totalValueLockedUSD: reserve0USD.plus(reserve1USD).toNumber() }
      // poolData.totalValueLockedUSD =
    } else if (pool.poolType === 'v3') {
      poolData = pools.find(
        (p: { id: string; totalValueLockedUSD: string }) => p?.id?.toLowerCase() === pool?.id?.toLowerCase()
      )
    }

    const annualFactor = 365 / (pool?.distributionDays || 7)

    const updatedPool = {
      ...pool,
      blastGold: toBN(
        totalCampaigns.find((c) => c.pairAddress.toLowerCase() === pool.id.toLowerCase())?.blastGoldAmount || 0
      ).toNumber(),
      apr: poolData?.totalValueLockedUSD
        ? toBN(pool.points)
            .multipliedBy(PRICE_PER_POINT)
            .dividedBy(poolData.totalValueLockedUSD)
            .multipliedBy(annualFactor)
            .multipliedBy(100)
            .toNumber()
        : 0,
    }

    if (pool.extraPoints && pool.extraPoints.length > 0) {
      updatedPool.extraPoints = pool.extraPoints.map((extra) => {
        const tokenPrice = tokenData?.find((t) => t.tokenAddress.toLowerCase() === extra.tokenAddress.toLowerCase())
        return {
          ...extra,
          apr: poolData?.totalValueLockedUSD
            ? toBN(extra.points)
                .multipliedBy(tokenPrice?.priceUSD || 0)
                .dividedBy(poolData.totalValueLockedUSD)
                .multipliedBy(annualFactor)
                .multipliedBy(100)
                .toNumber()
            : 0,
        }
      })
    }
    return updatedPool
  })

  return NextResponse.json(
    {
      totalPoints: POINTS_SUPLY,
      pricePerPoint: PRICE_PER_POINT,
      pointsTotalValue: POINTS_TOTAL_VALUE,
      boostedPools: enhancedBoostedPools,
    },
    {
      status: 200,
    }
  )
}
