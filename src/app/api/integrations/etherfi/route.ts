export const dynamic = 'force-dynamic'
import { getAlgebraClient } from '@/src/library/apollo/client/protocolCoreClient'
import { gql } from '@apollo/client'
import { isAddress } from 'ethers/lib/utils'

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const block_number = searchParams.get('blockNumber')
  const addresses = searchParams.get('addresses')
  if (!block_number) {
    return NextResponse.json(
      {
        message: 'blockNumber is required',
      },
      {
        status: 400,
      }
    )
  }
  const START_BLOCK = 1586148
  if (Number(block_number) < START_BLOCK) {
    return NextResponse.json(
      {
        message: `data starting at block number ${START_BLOCK}`,
      },
      {
        status: 400,
      }
    )
  }
  const owners = addresses ? addresses.split(',') : null
  if (owners && owners?.length > 0) {
    for (const address of owners) {
      if (!isAddress(address)) {
        return NextResponse.json(
          {
            message: `Invalid address ${address}`,
          },
          {
            status: 400,
          }
        )
      }
    }
  }

  const query = gql`
        query Positions($owners: [String], $blockNumber: Int!) {
            positions(
                where: {
                pool: "0x9304ba542df9bc61dd1c97c073ed35f81cab6149",
                    ${owners ? 'owner_in: $owners,' : ''}
                },
                block: { number: $blockNumber }
            ) {
                id
                owner
                withdrawnToken0
                depositedToken0
            }
        }
    `
  const Result = []
  interface Balances {
    [key: string]: number
  }
  const client = getAlgebraClient()
  const { data } = await client.query({
    query,
    variables: {
      owners,
      blockNumber: parseInt(block_number),
    },
  })

  const balances: Balances = {}
  for (const position of data.positions) {
    const positionBalance = Number(position.depositedToken0) - Number(position.withdrawnToken0)
    if (balances[position.owner]) {
      balances[position.owner] += positionBalance
    } else {
      balances[position.owner] = positionBalance
    }
  }
  for (const address in balances) {
    if (balances[address] <= 1e-16) continue
    Result.push({
      address: address,
      effective_balance: balances[address],
    })
  }
  return NextResponse.json({
    Result: Result,
  })
}
