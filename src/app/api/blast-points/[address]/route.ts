export const dynamic = 'force-dynamic'
import prisma from '@/src/library/utils/db'
import { NextRequest, NextResponse } from 'next/server'
import { isAddress } from 'viem'
export interface UserBlastPointsData {
  id: string
  given_blast_poins: number
  pending_blast_points: number
  given_blast_gold_points: number
  pending_blast_gold_points: number
}
export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      address: string
    }
  }
) {
  const { address } = params
  if (!address || !isAddress(address)) {
    return NextResponse.json(
      {
        body: 'Invalid address',
      },
      {
        status: 400,
      }
    )
  }

  const userBlastPoints = await prisma.users.findUnique({
    where: {
      id: address.toLowerCase(),
    },
    select: {
      id: true,
      given_blast_poins: true,
      pending_blast_points: true,
      given_blast_gold_points: true,
      pending_blast_gold_points: true,
    },
  })
  return NextResponse.json(
    userBlastPoints
      ? userBlastPoints
      : {
          id: address.toLocaleLowerCase(),
          given_blast_poins: 0,
          pending_blast_points: 0,
          given_blast_gold_points: 0,
          pending_blast_gold_points: 0,
        }
  )
}
