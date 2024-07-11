'use client'

import { Button } from '@/src/components/UI'

const Detail = () => {
  return (
    <div className="detail-box">
      <div className="relative z-10">
        <div className="box bg-shark-400 bg-opacity-40 2xl:w-full rounded-lg mb-5 py-5 px-8">
          <div className="relative w-full">
            <div className="flex items-center justify-between w-full mb-2">
              <p className="text-white text-sm">Total Committed</p>
              <p className="text-white text-sm">60,000 USDC</p>
            </div>
            <div className="flex items-center justify-between w-full">
              <p className="text-white text-sm">Price Per veFNX Token</p>
              <p className="text-white text-sm">0.06 USDC</p>
            </div>
          </div>
        </div>
        <div className="box bg-shark-400 bg-opacity-40 2xl:w-full rounded-lg mb-5 py-5 px-8">
          <div className="relative w-full">
            <h4 className="text-white font-medium mb-2">DISTRIBUTION</h4>
            <div className="flex items-center justify-between w-full mb-2">
              <p className="text-white text-sm">veFNX</p>
              <p className="text-white text-sm">250,000</p>
            </div>
            <div className="flex items-center justify-between w-full mb-2">
              <p className="text-white text-sm">veFNX 180 Days</p>
              <p className="text-white text-sm">250,000</p>
            </div>
            <div className="flex items-center justify-between w-full mb-2">
              <p className="text-white text-sm">veFNX 365 Days</p>
              <p className="text-white text-sm">250,000</p>
            </div>
            <div className="flex items-center justify-between w-full">
              <p className="text-white text-sm">veFNX 730 Days</p>
              <p className="text-white text-sm">250,000</p>
            </div>
          </div>
        </div>
        <Button variant="tertiary" className="w-full mb-4">
          Claim
        </Button>
      </div>
    </div>
  )
}

export default Detail
