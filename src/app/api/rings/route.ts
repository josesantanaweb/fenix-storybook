export const dynamic = 'force-dynamic'

import { RING_POINTS_ADDRESS } from '@/src/library/constants/addresses'
import { FALLBACK_CHAIN_ID, isSupportedChain } from '@/src/library/constants/chains'
import { toBN } from '@/src/library/utils/numbers'
import { ethers } from 'ethers'
import { NextRequest, NextResponse } from 'next/server'
interface Reward {
  recipient: string
  reason: string
  rewardToken: string
  amount: string
}
interface DistributionData {
  id: string
  rewardToken: string
  startTimestamp: number
  endTimestamp: number
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  let user = params.get('user')
  let pool = params.get('pool')
  const from = params.get('from') || '0'
  const to = params.get('to') || new Date('2100-01-01T00:00:00Z').getTime()
  const fromTimestamp = Number(from)
  const toTimestamp = Number(to)

  if (isNaN(fromTimestamp) || isNaN(toTimestamp) || toTimestamp <= fromTimestamp) {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid timestamp values for "from" or "to"',
      },
      { status: 400 }
    )
  }
  const chainId = Number(params.get('chainId')) || FALLBACK_CHAIN_ID
  if (!isSupportedChain(chainId)) {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid chainId',
      },
      { status: 400 }
    )
  }
  if (!user || !pool || !ethers.utils.isAddress(user) || !ethers.utils.isAddress(pool)) {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid user or pool address',
      },
      { status: 400 }
    )
  }
  const campaings = await fetch(`https://api.merkl.xyz/v3/merkl?chainIds=${chainId}&amms=fenix`, {
    next: {
      revalidate: 3600 * 2,
    },
  })
  pool = ethers.utils.getAddress(pool)
  user = ethers.utils.getAddress(user)
  const campaingsJson = await campaings.json()
  const poolData = campaingsJson[chainId]['pools'][pool]
  if (!poolData)
    return NextResponse.json(
      {
        success: false,
        error: 'Pool not found',
      },
      {
        status: 404,
      }
    )
  let userRings = 0

  const rewardsPromises = poolData['distributionData']
    .filter((distribution: DistributionData) => distribution['rewardToken'] === RING_POINTS_ADDRESS[chainId])
    .filter(
      (distribution: DistributionData) =>
        distribution['startTimestamp'] >= Number(from) && distribution['endTimestamp'] <= Number(to)
    )

    .map((distribution: DistributionData) => fetchRewards(distribution['id'], chainId.toString()))
  const rewardsResults = await Promise.all(rewardsPromises)

  rewardsResults.forEach((rewards) => {
    rewards.forEach((reward: Reward) => {
      if (reward['recipient'] === user) {
        userRings += toBN(reward['amount']).div(1e6).toNumber()
      }
    })
  })
  return NextResponse.json({
    success: true,
    user: {
      id: user.toLowerCase(),
      accumulated_rings_points: toBN(userRings).decimalPlaces(2).toNumber(),
    },
  })
}

async function fetchRewards(campaignId: string, chainId: string) {
  const url = `https://api.merkl.xyz/v3/rewardsReport?chainId=${chainId}&campaignId=${campaignId}`
  const response = await fetch(url, {
    next: {
      revalidate: 3600 * 8,
    },
  })
  return response.json()
}
