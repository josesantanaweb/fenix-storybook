'use client'

import { useState } from 'react'
import { Button } from '@/src/components/UI'
import InputRange from '@/src/components/UI/SliderRange/InputRange'
const Amount = () => {
  const [amount, setAmount] = useState<number>(0)

  return (
    <div className="relative w-full bg-shark-400 bg-opacity-40 rounded-lg p-5 mb-5">
      <h4 className="text-white text-sm mb-3">Amount</h4>
      <div className="flex items-center gap-4 justify-between mb-5">
        <Button variant="secondary" className="w-1/4">25%</Button>
        <Button variant="secondary" className="w-1/4">50%</Button>
        <Button variant="secondary" className="w-1/4">75%</Button>
        <Button variant="secondary" className="w-1/4">Max</Button>
      </div>
      <div className="flex gap-5 items-center px-5">
        <p className="text-3xl text-white">0%</p>
        <div className="flex-grow">
          <InputRange
            height={8.412}
            thumbSize={14.421}
            value={amount}
            min={1}
            max={100}
            disabled={false}
            onChange={(value) => setAmount(value)}
          />
        </div>
      </div>
    </div>
  )
}

export default Amount
