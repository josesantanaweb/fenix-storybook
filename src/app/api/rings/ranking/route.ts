export const dynamic = 'force-dynamic'

import { toBN } from '@/src/library/utils/numbers'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/src/library/utils/db'
BigInt.prototype.toJSON = function () {
  return this.toString()
}
export async function GET(request: NextRequest) {
  const users = await prisma.users.findMany({
    select: {
      id: true,
      accumulated_rings_points: true,
    },
    where: {
      accumulated_rings_points: {
        gt: 0,
      },
    },
    orderBy: {
      accumulated_rings_points: 'desc',
    },
  })

  return NextResponse.json(
    { ranking: users },
    {
      status: 200,
    }
  )
}
