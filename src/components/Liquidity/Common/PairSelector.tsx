'use client'
import Image from 'next/image'

import { useState } from 'react'
import SelectToken from '@/src/components/Modals/SelectToken'

import { IToken } from '@/src/library/types'
import {
  useSetToken0,
  useSetToken0TypedValue,
  useSetToken1,
  useSetToken1TypedValue,
  useToken0,
  useToken0TypedValue,
  useToken1,
  useToken1TypedValue,
} from '@/src/state/liquidity/hooks'
import { Address } from 'viem'

interface PairSelectorProps {
  firstToken: string
  secondToken: string
  tokenList: IToken[]
}

const PairSelector = ({ firstToken, secondToken, tokenList }: PairSelectorProps) => {
  const [openSelectFirstToken, setOpenSelectFirstToken] = useState<boolean>(false)
  const [openSelectSecondToken, setOpenSelectSecondToken] = useState<boolean>(false)
  const setToken0 = useSetToken0()
  const setToken1 = useSetToken1()
  const setToken0TypedValue = useSetToken0TypedValue()
  const setToken1TypedValue = useSetToken1TypedValue()
  const token0TypedValue = useToken0TypedValue()
  const token1TypedValue = useToken1TypedValue()

  const token0 = useToken0()
  const token1 = useToken1()
  //

  const firstTokenSymbol =
    tokenList.find((token) => {
      return token.address?.toLowerCase() === firstToken.toLowerCase()
    })?.symbol || 'WETH'
  const secondTokenSymbol =
    tokenList.find((token) => {
      return token.address?.toLowerCase() === secondToken.toLowerCase()
    })?.symbol || 'WETH'

  return (
    <div className="bg-shark-400 bg-opacity-40 py-[29px] px-[15px] md:px-[19px] border border-shark-950 rounded-[10px] mb-2.5">
      <div className="mb-2 text-xs leading-normal text-white">Select a Pair</div>

      <div className="flex items-center gap-3">
        <div
          className="bg-shark-400 bg-opacity-40 rounded-lg text-white px-2.5 md:px-4 flex cursor-pointer items-center justify-between h-[45px] md:h-[50px] w-full"
          onClick={() => setOpenSelectFirstToken(true)}
        >
          <div className="flex items-center gap-2.5 md:gap-2">
            <Image
              src={`/static/images/tokens/${firstTokenSymbol}.svg`}
              alt="token"
              className="w-5 h-5 rounded-full md:w-6 md:h-6"
              width={24}
              height={24}
            />
            <span className="text-xs md:text-base">{firstTokenSymbol}</span>
          </div>
          <span className="inline-block ml-2 text-xs icon-chevron md:text-sm" />
        </div>
        <div className="flex-grow flex justify-center items-center w-[50px]">
          <button
            type="button"
            className="flex items-center justify-center"
            onClick={() => {
              const temp = firstToken
              setToken0(secondToken as Address)
              setToken1(temp as Address)
              const tempTypedValue = token0TypedValue
              setToken0TypedValue(token1TypedValue)
              setToken1TypedValue(tempTypedValue)
            }}
          >
            <span className="text-2xl text-transparent icon-swap bg-gradient-to-r from-outrageous-orange-500 to-festival-500 bg-clip-text"></span>
          </button>
        </div>
        <div
          className="bg-shark-400 bg-opacity-40 rounded-lg cursor-pointer text-white px-2.5 md:px-4 flex items-center justify-between h-[45px] md:h-[50px] w-full"
          onClick={() => setOpenSelectSecondToken(true)}
        >
          <div className="flex items-center gap-2.5 md:gap-2">
            <Image
              src={`/static/images/tokens/${secondTokenSymbol}.svg`}
              alt="token"
              className="w-5 h-5 rounded-full md:w-6 md:h-6"
              width={24}
              height={24}
            />
            <span className="text-xs md:text-base">{secondTokenSymbol}</span>
          </div>
          <span className="inline-block ml-2 text-xs icon-chevron md:text-sm" />
        </div>
      </div>

      <SelectToken
        openModal={openSelectFirstToken}
        setOpenModal={setOpenSelectFirstToken}
        setToken={(token) => setToken0(token.address)}
      />
      <SelectToken
        openModal={openSelectSecondToken}
        setOpenModal={setOpenSelectSecondToken}
        setToken={(token) => setToken1(token.address)}
      />
    </div>
  )
}

export default PairSelector
