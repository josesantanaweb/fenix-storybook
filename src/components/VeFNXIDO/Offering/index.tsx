'use client'

import Image from 'next/image'
import { ProgressBar } from '@/src/components/UI'

const Offering = () => {
  return (
    <div className="offering-box">
      <div className="relative z-10">
        <h4 className="mb-3 text-xl text-white">veFNX IDO</h4>
        <div className="flex gap-2 items-center mb-4">
          <Image
            src="/static/images/tokens/FNX.svg"
            alt="token"
            className="w-8 h-8 rounded-full"
            width={20}
            height={20}
          />
          <div>
            <h4 className="text-white text-base">USDC Offering</h4>
            <p className="text-sm text-gradient">Finished</p>
          </div>
        </div>
        <div className="flex lg:gap-5 gap-3 box bg-shark-400 bg-opacity-40 2xl:w-full lg:h-auto w-full rounded-lg mb-5 items-center">
          <div>
            <p className="text-shark-100 font-bold text-[12px]">Starting</p>
            <p className="text-green-400 text-[12px]">Time</p>
          </div>
          <div className="flex items-center flex-col">
            <span className="text-white text-xs bg-shark-300 flex items-center p-2 h-[27px] bg-opacity-30  rounded-md">
              05
            </span>
            <p className="text-shark-100 text-sm">Days</p>
          </div>
          <div className="flex items-center flex-col">
            <span className="text-white bg-shark-300 text-xs flex items-center p-2 h-[27px] bg-opacity-30  rounded-md">
              11
            </span>
            <p className="text-shark-100 text-sm">Month</p>
          </div>
          <div className="flex items-center flex-col">
            <span className="text-white bg-shark-300 text-xs flex items-center p-2 h-[27px] bg-opacity-30  rounded-md">
              2024
            </span>
            <p className="text-shark-100 text-sm">Year</p>
          </div>
          <div className="flex items-center flex-col">
            <span className="text-white bg-shark-300 flex text-xs  items-center p-2 h-[27px] bg-opacity-30  rounded-md">
              21:00
            </span>
            <p className="text-shark-100 text-sm">Hours</p>
          </div>
        </div>
        <div className="flex lg:gap-5 gap-3 box bg-shark-400 bg-opacity-40 2xl:w-full lg:h-auto w-full rounded-lg mb-5 items-center">
          <div>
            <p className="text-shark-100 font-bold text-[12px]">End</p>
            <p className="text-red-400 text-[12px]">Time</p>
          </div>
          <div className="flex items-center flex-col">
            <span className="text-white text-xs bg-shark-300 flex items-center p-2 h-[27px] bg-opacity-30  rounded-md">
              05
            </span>
            <p className="text-shark-100 text-sm">Days</p>
          </div>
          <div className="flex items-center flex-col">
            <span className="text-white bg-shark-300 text-xs flex items-center p-2 h-[27px] bg-opacity-30  rounded-md">
              11
            </span>
            <p className="text-shark-100 text-sm">Month</p>
          </div>
          <div className="flex items-center flex-col">
            <span className="text-white bg-shark-300 text-xs flex items-center p-2 h-[27px] bg-opacity-30  rounded-md">
              2024
            </span>
            <p className="text-shark-100 text-sm">Year</p>
          </div>
          <div className="flex items-center flex-col">
            <span className="text-white bg-shark-300 flex text-xs  items-center p-2 h-[27px] bg-opacity-30  rounded-md">
              21:00
            </span>
            <p className="text-shark-100 text-sm">Hours</p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="text-lg text-gradient bg-clip-text mb-4 xl:mb-0">60,000 / 60,000 USDC</h4>
          <div className="w-full">
            <ProgressBar progress={50} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Offering
