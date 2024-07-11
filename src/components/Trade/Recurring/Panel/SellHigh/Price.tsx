'use client'

import { useState } from 'react'
import { Button } from '@/src/components/UI'

interface PriceProps {
  value: number
  setValue: (value: number) => void
}

const Price = ({ setValue, value }: PriceProps) => {
  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => setValue(parseFloat(e.target.value))

  return (
    <div className="exchange-box-x1">
      <div className="flex items-center justify-between mb-3">
        <p className="text-white text-sm">Set Enter Price</p>
      </div>
      <div className="flex flex-col xl:flex-row items-center gap-3">
        <div className="relative w-full">
          <input
            type="number"
            placeholder="0"
            onChange={onChangeInput}
            value={value}
            className="bg-shark-400 bg-opacity-40 border border-shark-400 h-[50px] w-full rounded-lg outline-none px-3 text-white text-sm"
          />
          <div className="absolute right-2 top-[10px] flex items-center gap-1">
            <Button variant="tertiary" className="!py-1 !px-3">
              Half
            </Button>
            <Button variant="tertiary" className="!py-1 !px-3">
              Max
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Price
