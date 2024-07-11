'use client'

import Image from 'next/image'

const Summary = () => {

  return (
    <div className="bg-shark-400 bg-opacity-40 rounded-lg p-5 mb-5">
      <div className="flex justify-between items-center px-5 py-2">
        <p className="text-sm text-white">Pooled FNX:</p>
        <div className="flex items-center gap-2">
          <p className="text-sm text-white">0</p>
          <Image src="/static/images/tokens/FNX.svg" width={20} height={20} alt="token" className="w-6 h-6" />
        </div>
      </div>
      <div className="flex justify-between items-center px-5 py-2">
        <p className="text-sm text-white">Pooled FNX:</p>
        <div className="flex items-center gap-2">
          <p className="text-sm text-white">0</p>
          <Image src="/static/images/tokens/ETH.svg" width={20} height={20} alt="token" className="w-6 h-6" />
        </div>
      </div>
      <div className="flex justify-between items-center px-5 py-2">
        <p className="text-sm text-white">ETH Fees Earned:</p>
        <div className="flex items-center gap-2">
          <p className="text-sm text-white">0</p>
          <Image src="/static/images/tokens/ETH.svg" width={20} height={20} alt="token" className="w-6 h-6" />
        </div>
      </div>
      <div className="flex justify-between items-center px-5 py-2">
        <p className="text-sm text-white">FNX Fees Earned:</p>
        <div className="flex items-center gap-2">
          <p className="text-sm text-white">0.001</p>
          <Image src="/static/images/tokens/FNX.svg" width={20} height={20} alt="token" className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}

export default Summary
