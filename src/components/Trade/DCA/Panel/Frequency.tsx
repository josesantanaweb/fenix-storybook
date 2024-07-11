'use client'

import React, { useState } from 'react'
import { Select } from '@/src/components/UI'
import { TIME_OPTIONS } from '@/src/components/Trade/data'

import { IOption } from '@/src/library/types'

interface FrequencyProps {
  over: number
  setOver: (over: number) => void
  handleShowSummary: () => void
}

const Frequency = ({ setOver, over, handleShowSummary }: FrequencyProps) => {
  const [frequencyOptions, setFrequencyOptions] = useState<IOption>({ label: 'Minutes', value: 'minutes' })
  const [everyNumber, setEveryNumber] = useState<number>(0)

  const onChangeEveryNumber = (e: React.ChangeEvent<HTMLInputElement>) => setEveryNumber(parseFloat(e.target.value))

  const onChangeOrders = (e: React.ChangeEvent<HTMLInputElement>) => setOver(parseFloat(e.target.value))

  return (
    <div className="exchange-box-x2 mb-3">
      <div className="mb-4">
        <div className="flex items-center justify-start mb-3">
          <p className="text-white text-sm">Every</p>
        </div>
        <div className="flex flex-col xl:flex-row items-center gap-3">
          <div className="relative w-full xl:w-4/6">
            <input
              type="text"
              placeholder="0"
              onChange={onChangeEveryNumber}
              value={everyNumber}
              className="bg-shark-400 bg-opacity-40 border border-shark-400 h-[50px] w-full rounded-lg outline-none px-3 text-white text-sm"
            />
          </div>
          <div className="relative w-full xl:w-2/6">
            <Select options={TIME_OPTIONS} selected={frequencyOptions} setSelected={setFrequencyOptions} />
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-white text-sm">Over</p>
          <span
            onClick={handleShowSummary}
            className="flex items-center justify-center w-5 h-5 text-xs text-white rounded-full cursor-pointer icon-info bg-shark-200 hover:bg-outrageous-orange-500"
          ></span>
        </div>
        <div className="flex flex-col xl:flex-row items-center gap-3">
          <div className="relative w-full">
            <input
              type="number"
              placeholder="0"
              onChange={onChangeOrders}
              value={over}
              className="bg-shark-400 bg-opacity-40 border border-shark-400 h-[50px] w-full rounded-lg outline-none px-3 text-white text-sm"
            />
            <div className="absolute right-2 top-[10px] flex items-center">
              <span className="text-xs text-white p-2">Orders</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Frequency
