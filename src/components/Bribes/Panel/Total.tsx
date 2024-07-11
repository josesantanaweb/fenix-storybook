'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/src/components/UI'
import SelectToken from '@/src/components/Modals/SelectToken'

import { IToken } from '@/src/library/types'

interface TotalProps {
  bal: any
  value: number
  setValue: (value: number) => void
}

const Total = ({ bal, setValue, value }: TotalProps) => {
  const [openSelectToken, setOpenSelectToken] = useState<boolean>(false)

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => setValue(parseFloat(e.target.value))

  const handlerSelectToken = () => setOpenSelectToken(true)

  return (
    <div className="exchange-box-x1">
      <div className="flex flex-col xl:flex-row items-center gap-3">
        {/* <div className="relative w-full xl:w-2/6">
          <div
            onClick={handlerSelectToken}
            className="cursor-pointer bg-shark-400 bg-opacity-40 rounded-lg text-white px-4 flex items-center justify-between h-[50px]"
          >
            <div className="flex items-center gap-2">
              <Image
                src={`/static/images/tokens/${token.symbol}.svg`}
                alt="token"
                className="w-6 h-6 rounded-full"
                width={20}
                height={20}
              />
              <span className="text-base">{token.symbol}</span>
            </div>
            <span className="icon-chevron text-sm inline-block ml-2" />
          </div>
        </div> */}
        <div className="relative w-full">
          <input
            type="number"
            placeholder="0"
            onChange={onChangeInput}
            value={value}
            className="bg-shark-400 bg-opacity-40 border border-shark-400 h-[50px] w-full rounded-lg outline-none px-3 text-white text-sm"
          />
          <div className="absolute right-2 top-[10px] flex items-center gap-1">
            <Button onClick={() => setValue(bal)} variant="tertiary" className="!py-1 !px-3 !text-xs">
              Max
            </Button>
          </div>
        </div>
      </div>
      {/* <SelectToken openModal={openSelectToken} setOpenModal={setOpenSelectToken} setToken={setToken} /> */}
    </div>
  )
}

export default Total
