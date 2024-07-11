'use client'

import Image from 'next/image'

const Liquidity = () => {
  return (
    <div className="bg-shark-400 bg-opacity-40 p-5 rounded-lg w-full mb-5 flex items-center gap-5">
      <div className="flex flex-col w-1/2">
        <p className="text-xs text-white">Liquidity</p>
        <p className="text-xl text-white font-medium">$0.00575</p>
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
              <p className="text-sm text-white">0.03</p>
              <p className="text-sm text-white bg-shark-400 bg-opacity-40 border border-shark-300 rounded-md px-4 py-1">
                51%
              </p>
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
              <p className="text-sm text-white">0.03</p>
              <p className="text-sm text-white bg-shark-400 bg-opacity-40 border border-shark-300 rounded-md px-4 py-1">
                51%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Liquidity
