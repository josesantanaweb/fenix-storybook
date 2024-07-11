import React from 'react'
import { ReferralData } from '..'

const StatisticsReferral = ({ referralData }: { referralData: ReferralData | undefined }) => {
  return (
    <div className="box-referrals-medium max-sm:max-w-[372px] w-full">
      <div className="relative z-50">
        <p className="text-white text-sm sm:text-base font-medium">Your statistics</p>
      </div>
      <div className="relative z-50 flex justify-center items-end md:h-28 gap-4 p-4 px-5">
        {/*  */}
        <div className="bg-shark-400 bg-opacity-20 rounded-xl sm:min-w-[173px] min-w-[149px] sm:max-w-[173px] min-h-[38px] sm:min-h-[58px] flex items-center gap-2 border border-solid border-shark-300">
          <div className="rounded-xl w-9 h-9 sm:w-14 sm:h-14 flex  items-center justify-center bg-shark-400 transition-colors hover:border-outrageous-orange-500 hover:bg-button-primary-hover hover:bg-opacity-80 ">
            <span className="icon-users-1 text-white text-lg" />
          </div>
          <div className="text-xs text-white text-center font-semibold">
            <p>Total Attributions</p>
            <p>{referralData?.total_attributions ?? '-'}</p>
          </div>
        </div>
        <div className="bg-shark-400 bg-opacity-20 rounded-xl sm:min-w-[173px] min-w-[149px] sm:max-w-[173px] min-h-[38px] sm:min-h-[58px] flex items-center gap-2 border border-solid border-shark-300">
          <div className="rounded-xl w-9 h-9 sm:w-14 sm:h-14 flex  items-center justify-center bg-shark-400 transition-colors hover:border-outrageous-orange-500 hover:bg-button-primary-hover hover:bg-opacity-80">
            <span className="icon-compass text-white text-lg" />
          </div>
          <div className="text-xs text-white text-center font-semibold">
            <p>Rings earned</p>
            <p>{referralData?.total_amount ?? '-'}</p>
          </div>
        </div>
        <div className="bg-shark-400 bg-opacity-20 rounded-xl sm:min-w-[173px] min-w-[149px] sm:max-w-[173px] min-h-[38px] sm:min-h-[58px] flex items-center gap-2 border border-solid border-shark-300">
          <div className="rounded-xl w-9 h-9 sm:w-14 sm:h-14 flex  items-center justify-center bg-shark-400 transition-colors hover:border-outrageous-orange-500 hover:bg-button-primary-hover hover:bg-opacity-80">
            <span className="icon-users-1 text-white text-lg" />
          </div>
          <div className="text-xs text-white text-center font-semibold">
            <p>Referred by</p>
            <p>{referralData?.referrer_by || '-'}</p>
          </div>
        </div>
        {/*  */}
      </div>
    </div>
  )
}

export default StatisticsReferral
