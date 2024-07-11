import { RINGS_TOKEN_DECIMALS } from '@/src/library/constants/misc'
import { totalCampaigns } from '@/src/library/utils/campaigns'
import { notificationService } from '@/src/library/utils/notificationService/factory'
import { NextRequest, NextResponse } from 'next/server'
interface Reward {
  recipient: string
  reason: string
  rewardToken: string
  amount: string
}
import prisma from '@/src/library/utils/db'

export async function GET(request: NextRequest) {
  const authorizationHeader = request.headers.get('Authorization')
  if (authorizationHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  for (const campaign of totalCampaigns) {
    // const campaignId = campaign.campaignId
    const pairAddress = campaign.pairAddress
    try {
      const response = await fetch(`https://api.merkl.xyz/v3/rewardsReport?chainId=81457`, {
        //&campaignId=${campaignId}`, {
        cache: 'no-cache',
      })
      const data: Reward[] = await response.json()
      for (const reward of data) {
        const rewardAmount = BigInt(reward.amount) / 10n ** BigInt(RINGS_TOKEN_DECIMALS)
        await prisma.$transaction([
          prisma.users.upsert({
            where: { id: reward.recipient.toLowerCase() },
            update: {
              accumulated_rings_points: {
                increment: rewardAmount,
              },
            },
            create: {
              id: reward.recipient.toLowerCase(),
              accumulated_rings_points: rewardAmount,
            },
          }),
          prisma.ring_distribution.create({
            data: {
              // campaign_id: campaignId.toLowerCase(),
              user_id: reward.recipient.toLowerCase(),
              gold_points: 0,
              ring_points: rewardAmount,
              pool_id: pairAddress.toLowerCase(),
            } as any,
          }),
        ])
      }
    } catch (error) {
      await notificationService.sendNotification(
        `There was an error with the rewards distribution: ${error}` // ${campaignId} -
      )
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return NextResponse.json({ ok: true }, { status: 200 })
}
