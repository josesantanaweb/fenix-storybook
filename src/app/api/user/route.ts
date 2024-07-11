export const revalidate = 60
import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http, isAddress } from 'viem'
import prisma from '@/src/library/utils/db'
import { IchiProvider } from '@/src/library/providers/liquidity-provider/IchiProvider'
import { PoolProvider } from '@/src/library/providers/PoolProvider'
import { ManualLiquidityProvider } from '@/src/library/providers/liquidity-provider/ManualLiquidityProvider'
import { BN_ZERO } from '@/src/library/utils/numbers'
import { GammaProvider } from '@/src/library/providers/liquidity-provider/GammaProvider'

export async function POST(request: NextRequest) {
  try {
    const { account } = await request.json()

    if (!account || !isAddress(account?.toLowerCase())) {
      return NextResponse.json(
        {
          status: 'Invalid address',
        },
        { status: 400 }
      )
    }

    await prisma.users.upsert({
      where: { id: account?.toLowerCase() },
      update: {},
      create: {
        id: account?.toLowerCase(),
      },
    })
    return NextResponse.json(
      {
        status: 'ok',
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        status: 'Internal Server Error',
      },
      {
        status: 500,
      }
    )
  }
}
BigInt.prototype.toJSON = function () {
  return this.toString()
}

// poner que no se caché
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const searchParams = new URLSearchParams(url.searchParams)
  const account = searchParams.get('account')
  if (!account || !isAddress(account?.toLowerCase())) {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid address',
      },
      { status: 400 }
    )
  }
  const user = await prisma.users.findUnique({
    where: { id: account?.toLowerCase() },
    select: {
      id: true,
      accumulated_rings_points: true,
      given_blast_poins: true,
      pending_blast_points: true,
      given_blast_gold_points: true,
      pending_blast_gold_points: true,
    },
  })
  // si no es not found, simplemente devolver 0
  if (!user) {
    return NextResponse.json(
      {
        success: true,
        user: {
          id: account,
          accumulated_rings_points: '0',
        },
        totalTVL: '0',
        totalBoostedTVL: '0',
      },
      { status: 200 }
    )
  }

  // si no existe, devolver 0

  const ichiProvider = new IchiProvider()
  const manualProvider = new ManualLiquidityProvider()
  const gammaProvider = new GammaProvider()
  const [ichi, manualV3, gamma] = await Promise.all([
    ichiProvider.getUserLiquidity(account),
    manualProvider.getUserLiquidity(account),
    gammaProvider.getUserLiquidity(account),
  ])
  let totalTVL = BN_ZERO
  let boostedTVL = BN_ZERO

  totalTVL = totalTVL.plus(ichi.TVL).plus(manualV3.TVL).plus(gamma.TVL)
  boostedTVL = boostedTVL.plus(ichi.boostedTVL).plus(manualV3.boostedTVL)
  const nftBonus = await prisma.ring_bonus.aggregate({
    where: {
      user_id: account,
    },
    _sum: {
      ring_points: true,
      gold_points: true,
    },
  })
  const userData = { ...user, nft_extra_rings_points: nftBonus._sum.ring_points, totalTVL }
  return NextResponse.json(
    {
      success: true,
      user: userData,
      // totalTVL: totalTVL.decimalPlaces(2).toString(),
      // totalBoostedTVL: boostedTVL.decimalPlaces(2).toString(),
      // nftBonus,
      // liquidity: {
      //   manualV3,
      //   clm: {
      //     ichi,
      //   },
      // },
    },
    { status: 200 }
  )
}
