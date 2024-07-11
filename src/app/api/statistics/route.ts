import { NextResponse, NextRequest } from 'next/server'
import { fetchv3Factories } from '@/src/state/liquidity/reducer'
import { toBN } from '@/src/library/utils/numbers'
export interface GlobalStatisticsData {
  totalVolume: number
  totalTVL: number
  totalFees: number
  lastUpdate: string
  totalUsers: number
}
import prisma from '@/src/library/utils/db'

export async function GET(request: NextRequest) {
  const [factoriesResult, usersResult] = await Promise.allSettled([fetchv3Factories(), prisma.users.count()])
  const fetchedFactoriesData = factoriesResult.status === 'fulfilled' ? factoriesResult.value : null
  const totalUsers = usersResult.status === 'fulfilled' ? usersResult.value : null

  if (!fetchedFactoriesData || !totalUsers) {
    return NextResponse.json({ error: 'Could not fetch data' }, { status: 500 })
  }

  const totalVolume = toBN(fetchedFactoriesData[0].totalVolumeUSD).toNumber()
  const totalTVL = toBN(fetchedFactoriesData[0].totalValueLockedUSD).toNumber()
  const totalFees = toBN(fetchedFactoriesData[0].totalFeesUSD).toNumber()
  const data: GlobalStatisticsData = {
    totalVolume,
    totalTVL,
    totalFees,
    lastUpdate: new Date().toISOString(),
    totalUsers,
  }

  return NextResponse.json(data, {
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
      'CDN-Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
      'Vercel-CDN-Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
    },
  })
}
