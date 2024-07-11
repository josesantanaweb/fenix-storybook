export const dynamic = 'force-dynamic'
import prisma from '@/src/library/utils/db'
import { ethereumAddressSchema } from '@/src/library/utils/schema'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
const userStatisticSchema = z.object({
  from: z.number().min(0).optional(),
  to: z.number().min(0).optional(),
  user: ethereumAddressSchema,
})

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Params
  }
) {
  const fromParam = Number(request.nextUrl.searchParams.get('from'))
  const toParam = Number(request.nextUrl.searchParams.get('to'))

  const from = fromParam ? new Date(Number(fromParam) * 1000) : new Date('2000-01-01T00:00:00Z')
  const to = toParam ? new Date(Number(toParam) * 1000) : new Date('2100-01-01T00:00:00Z')

  const user = params.user.toString().toLowerCase()

  const validateData = userStatisticSchema.safeParse({
    from: fromParam,
    to: toParam,
    user,
  })
  if (!validateData.success) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  const addLiquidityData = await prisma.action_event.aggregate({
    _sum: {
      value: true,
    },
    where: {
      user_id: user,
      event_type: 'ADD_LIQUIDITY',
      created_at: {
        gt: from,
        lt: to,
      },
    },
  })
  const swapData = await prisma.action_event.aggregate({
    _sum: {
      value: true,
    },
    where: {
      user_id: user,
      event_type: 'SWAP',
      created_at: {
        gt: from,
        lt: to,
      },
    },
  })
  return NextResponse.json(
    { liquidity: addLiquidityData._sum.value || 0, swap: swapData._sum.value || 0 },
    { status: 200 }
  )

  return NextResponse.json({ message: 'ok' }, { status: 200 })
}
