/* eslint-disable max-len */
'use client'
import CreateReferral from './CreateReferral'
import Referrer from './Referrer'
import ShareReferral from './ShareReferral'
import StatisticsReferral from './StatisticsReferral'
import ReferralCard from './ReferralCard'
import { Button } from '../UI'
import useActiveConnectionDetails from '@/src/library/hooks/web3/useActiveConnectionDetails'
import { useSignMessage } from 'wagmi'
import { Fuul } from '@fuul/sdk'
import { useIsReferralSystemInitialized, useReferrerBy } from '@/src/state/referrals/hooks'
import { useEffect, useState } from 'react'
export interface ReferralData {
  total_attributions: number
  total_amount: string
  rank: number
  referrer_by?: string
}
const Referrals = () => {
  const { account } = useActiveConnectionDetails()
  const referrerBy = useReferrerBy()
  const isReferralSystemInitialized = useIsReferralSystemInitialized()
  const [referralData, setReferralData] = useState<ReferralData>()
  useEffect(() => {
    const fetchReferralData = async () => {
      if (!account || !isReferralSystemInitialized) return
      try {
        const data = await Fuul.getPointsLeaderboard({
          user_type: 'affiliate',
          user_address: account,
        })
        const result = data?.results?.find((result) => result.address?.toLowerCase() === account.toLowerCase())
        if (result) {
          setReferralData({ ...result, referrer_by: referrerBy })
        } else {
          setReferralData({ total_attributions: 0, total_amount: '0', rank: 0, referrer_by: referrerBy })
        }
      } catch (error) {
        console.log('error', error)
      }
    }
    fetchReferralData()
  }, [isReferralSystemInitialized, account, referrerBy])

  return (
    <div className="flex w-full gap-5 flex-col items-center py-20 relative z-50">
      <div className="flex flex-col  items-center gap-1 pb-10">
        <div className="border-2 border-solid border-shark-300 bg-shark-400 bg-opacity-20 rounded-xl p-4 flex justify-center">
          <span className="icon-hyperlink text-gradient text-xl flex items-center justify-center" />
        </div>
        <h1 className="text-sm text-center max-sm:max-w-[227px] md:text-xl font-normal text-white">
          Refer Fenix to your friends and boost your earnings!
        </h1>
      </div>
      <div className="flex flex-col w-full items-center gap-2">
        <CreateReferral />
        {/* <ShareReferral /> */}
      </div>
      <div className="flex flex-col gap-6 w-full items-center">
        <StatisticsReferral referralData={referralData} />
        <Referrer />
        <div className="xl:max-w-[1127px] max-sm:max-w-[372px] w-full flex gap-2 flex-col">
          <h1 className="text-white text-sm sm:text-xl font-semibold text-left ">How it works</h1>
          <div className="flex  w-full mx-auto flex-wrap md:flex-nowrap gap-5">
            <ReferralCard
              title="Spread your link, earn rewards"
              img="/static/images/referrals/img-1.svg"
              description="Share your unique referral link with your friends to start earning."
            />
            <ReferralCard
              title="New user"
              img="/static/images/referrals/img-2.svg"
              description="When a new user accesses our platform using your link and provide liquidity, they become your referee."
            />
            <ReferralCard
              title="Share more, Earn more"
              img="/static/images/referrals/img-3.svg"
              description="Referees receive a 5% increase on Rings earned. You earn 15% of the Rings Boost earned by your referrals."
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Referrals
