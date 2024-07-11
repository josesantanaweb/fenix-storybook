'use client'

import Image from 'next/image'

const FeeFier = () => {
  return (
    <div className="flex flex-col w-full rounded-md bg-shark-400 bg-opacity-40 mb-4 py-6 px-5 gap-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image src="/static/images/tokens/FNX.svg" width={20} height={20} alt="token" className="w-6 h-6" />
          <p className="text-base text-white">FNX</p>
        </div>
        <p className="text-sm text-white">0.003</p>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image src="/static/images/tokens/USDC.svg" width={20} height={20} alt="token" className="w-6 h-6" />
          <p className="text-base text-white">ETH</p>
        </div>
        <p className="text-sm text-white">0.002</p>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-white text-sm">Fee tier</p>
        <p className="text-white text-xs bg-shark-400 bg-opacity-40 border border-shark-300 px-3 py-1 rounded-md">
          1.00%
        </p>
      </div>
    </div>
  )
}

export default FeeFier
