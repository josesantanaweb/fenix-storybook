'use client'

import Button from '@/src/components/UI/Button'
import Image from 'next/image'

const UnclaimedFees = () => {
  return (
    <div className="bg-shark-400 bg-opacity-40 p-5 rounded-lg w-full mb-5 flex items-center gap-5">
      <div className="flex flex-col w-1/2">
        <p className="text-xs text-white">Unclaimed Fees</p>
        <p className="text-xl text-white font-medium">$0.000000562</p>
        <Button variant="tertiary" className="text-xs text-center !py-2">Collect fees</Button>
      </div>
      <div className="flex items-center justify-between w-1/2">
        <div className="flex flex-col w-full gap-3">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Image
                src={`/static/images/tokens/FNX.svg`}
                alt="token"
                className="w-6 h-6 rounded-full"
                width={30}
                height={30}
              />
              <p className="text-sm text-white font-medium">FNX</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-white">0.001</p>
            </div>
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Image
                src={`/static/images/tokens/USDC.svg`}
                alt="token"
                className="w-6 h-6 rounded-full"
                width={30}
                height={30}
              />
              <p className="text-sm text-white font-medium">ETH</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-white">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UnclaimedFees
