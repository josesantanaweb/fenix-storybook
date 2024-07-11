'use client'

import Image from 'next/image'

const TopCurrentPosition = () => {
  return (
    <div className="bg-shark-400 bg-opacity-40 p-5 rounded-lg w-full mb-5">
      <div className="flex items-center gap-5">
        <div className="flex items-center">
          <Image
            src={`/static/images/tokens/FNX.svg`}
            alt="token"
            className="w-10 h-10 rounded-full"
            width={40}
            height={40}
          />
          <Image
            src={`/static/images/tokens/USDC.svg`}
            alt="token"
            className="w-10 h-10 rounded-full -ml-4"
            width={40}
            height={40}
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <p className="text-md text-white">FNX / ETH</p>
            <p className="text-green-400 text-xs">Open</p>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-xs text-white bg-shark-400 bg-opacity-40 rounded-md border border-shark-300 px-2 py-1">Min: 133.72 FNX per ETH</p>
            <p className="text-xs text-white bg-shark-400 bg-opacity-40 rounded-md border border-shark-300 px-2 py-1">Max: 454.73 FNX per ETH</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopCurrentPosition
