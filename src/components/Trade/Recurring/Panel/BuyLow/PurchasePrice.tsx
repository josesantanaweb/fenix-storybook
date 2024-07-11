'use client'

import { useState } from 'react'
import { Button } from '@/src/components/UI'

interface PurchasePriceProps {
  value: number
  setValue: (value: number) => void
}

const PurchasePrice = ({ setValue, value }: PurchasePriceProps) => {

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => setValue(parseFloat(e.target.value))

  return (
    <div className="exchange-box-x1">
      <div className="flex items-center justify-between mb-3">
        <p className="text-white text-sm">Purchase price</p>
      </div>
      <div className="flex flex-col xl:flex-row items-center gap-3 xl:justify-between">
        <div className="relative w-full">
          <input
            type="number"
            placeholder="0"
            onChange={onChangeInput}
            value={value}
            className="bg-shark-400 bg-opacity-40 border border-shark-400 h-[50px] w-full rounded-lg outline-none px-3 text-white text-sm"
          />
        </div>
        <span className="icon-swap text-3xl rotate-180 text-gradient"></span>
        <div className="relative w-full">
          <input
            type="number"
            placeholder="0"
            onChange={onChangeInput}
            value={value}
            className="bg-shark-400 bg-opacity-40 border border-shark-400 h-[50px] w-full rounded-lg outline-none px-3 text-white text-sm"
          />
        </div>
      </div>
    </div>
  )
}

export default PurchasePrice
