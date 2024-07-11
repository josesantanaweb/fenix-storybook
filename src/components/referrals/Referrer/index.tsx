import Image from 'next/image'
import React from 'react'

const Referrer = () => {
  return (
    <div className="xl:max-w-[1127px] max-sm:max-w-[372px] w-full flex gap-2 flex-col ">
      <h1 className="text-white text-sm sm:text-base font-semibold text-left ">
        Each successful referral gives referrer{' '}
      </h1>
      <div className="flex flex-wrap xl:flex-nowrap gap-4 w-full justify-center xl:justify-between relative">
        <div className="absolute max-xl:-left-8 top-32 max-xl:rotate-90 xl:right-[47%] xl:top-4 z-50 ">
          <Image src={'/static/images/referrals/lines.svg'} width={97} height={1} alt="lines" />
        </div>
        <div className="box-referrals-minimum">
          <div className="relative z-50 flex  sm:justify-between flex-wrap sm:flex-nowrap items-center w-full h-28 text-white">
            <div className="w-full flex justify-evenly sm:justify-between items-center">
              <p className="sm:text-5xl  text-4xl font-semibold ">15%</p>
              <p className="text-sm font-normal w-32">Bonus from the boost earned by each referral</p>
            </div>
            <div className="w-full sm:w-2/3  flex max-sm:justify-evenly   justify-end">
              <p className="flex items-center gap-2  text-xs px-5 py-2 bg-green-500 bg-opacity-40 border rounded-xl border-solid border-green-500">
                <span className="icon-check" />
                For you
              </p>
              <span className="w-[106px] sm:hidden" />
            </div>
          </div>
        </div>
        <div className="box-referrals-minimum">
          <div className="relative z-50 flex  sm:justify-between flex-wrap sm:flex-nowrap items-center w-full h-28 text-white">
            <div className="w-full flex justify-evenly sm:justify-between items-center">
              <p className="sm:text-5xl  text-4xl font-semibold ">5%</p>
              <p className="text-sm font-normal">increase in their LP</p>
            </div>
            <div className="w-full sm:w-2/3  flex max-sm:justify-evenly   justify-end">
              <p className="flex items-center gap-2  text-xs px-5 py-2 bg-green-500 bg-opacity-40 border rounded-xl border-solid border-green-500">
                <span className="icon-check" />
                For them
              </p>
              <span className="w-[106px] sm:hidden" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Referrer
