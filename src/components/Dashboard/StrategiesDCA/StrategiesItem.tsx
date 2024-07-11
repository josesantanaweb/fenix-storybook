'use client'

import { useState } from 'react'
import { Button, ProgressBar } from '@/src/components/UI'
import Image from 'next/image'

const StrategiesItem = () => {
  const [open, setOpen] = useState<boolean>(false)

  const handleOpen = () => setOpen(!open)

  const classActive = open ? 'bg-outrageous-orange-400 bg-opacity-10' : 'bg-shark-400 bg-opacity-40'

  return (
    <div className={`px-4 py-2 rounded-xl mb-3 ${classActive}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Image src="/static/images/tokens/USDC.svg" width={20} height={20} alt="token" className="w-6 h-6" />
            <Image src="/static/images/tokens/FNX.svg" width={20} height={20} alt="token" className="w-6 h-6 -ml-2" />
          </div>
          <div className="">
            <h3 className="text-white text-sm">USDC/FNX</h3>
            <div className="flex items-center gap-1">
              <span className="icon-sand-clock text-outrageous-orange-500"></span>
              <p className="text-white text-xs">19 Minutes</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-[100px] text-right">
            <p className="text-white text-sm">12 USDC</p>
            <ProgressBar progress={10} />
          </div>
          <Button variant="tertiary" className="!py-2 !px-3" onClick={handleOpen}>
            <span className={`icon-chevron text-xs ${open &&  'rotate-180'}`}></span>
          </Button>
        </div>
      </div>

      {open && (
        <div className="p-5">
          <div className="border-b border-shark-400 mb-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white text-sm">DCA USDC Balance</p>
              <p className="text-white text-sm">0.00303044 USDC</p>
            </div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-white text-sm">DCA FNX Balance</p>
              <p className="text-white text-sm">0.00303044 USDC</p>
            </div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-white text-sm">Withdrawn Amount</p>
              <p className="text-white text-sm">0.00303044 USDC</p>
            </div>
          </div>
          <div className="">
            <div className="flex items-center justify-between mb-2">
              <p className="text-shark-100 text-sm">Total Deposited</p>
              <p className="text-shark-100 text-sm">100 USDC</p>
            </div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-shark-100 text-sm">Total Spent</p>
              <p className="text-shark-100 text-sm">0.00303044 USDC (33%)C</p>
            </div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-shark-100 text-sm">Buying</p>
              <p className="text-shark-100 text-sm">1 USDC</p>
            </div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-shark-100 text-sm">Interval</p>
              <p className="text-shark-100 text-sm">Every 1 day(s)</p>
            </div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-shark-100 text-sm"># of Orders Left</p>
              <p className="text-shark-100 text-sm">100</p>
            </div>
          </div>
          <div className="flex w-full justify-center items-center gap-3">
            <Button className="w-full">Withdraw Balance</Button>
            <Button className="w-full">Close and Withdraw</Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default StrategiesItem
