'use client'

import Image from 'next/image'

const TopCurrentPosition = () => {

  return (
    <>
      <p className="text-xs text-white mb-2">Current Position</p>
      <div className="flex items-center justify-between bg-shark-400 bg-opacity-40 py-8 px-5 rounded-md mb-4">
        <div className="flex items-center">
          <Image src="/static/images/tokens/FNX.svg" width={20} height={20} alt="token" className="w-8 h-8" />
          <Image src="/static/images/tokens/USDC.svg" width={20} height={20} alt="token" className="w-8 h-8 -ml-3" />
        </div>
        <p className="text-white text-base">FNX / ETH</p>
        <p className="text-green-400 text-xs">Open</p>
      </div>
    </>
  )
}

export default TopCurrentPosition
