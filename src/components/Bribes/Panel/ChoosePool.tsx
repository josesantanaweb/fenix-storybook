'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/src/components/UI'
import SelectToken from '@/src/components/Modals/SelectToken'

import { IToken } from '@/src/library/types'
import SelectPool from '../../Modals/SelectPool'

interface ChoosePoolProps {
  token: any
  value: number
  setToken: (token: IToken) => void
  setValue: (value: number) => void
}

const ChoosePool = ({ token, setToken, setValue, value }: ChoosePoolProps) => {
  const [openSelectToken, setOpenSelectToken] = useState<boolean>(false)

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => setValue(parseFloat(e.target.value))

  const handlerSelectToken = () => setOpenSelectToken(true)

  return (
    <div className="exchange-box-x1">
      <div className="flex items-center justify-between mb-3">
        <p className="text-white text-sm">Choose a pool</p>
        <p className="text-shark-100 flex gap-3 text-sm items-center">
          {/* <span className="icon-wallet text-xs"></span>
          <span>Available: 0.00 ETH</span> */}
        </p>
      </div>
      <div className="flex flex-col xl:flex-row items-center gap-3">
        <div className="relative w-full">
          <div
            onClick={handlerSelectToken}
            className="cursor-pointer bg-shark-400 bg-opacity-40 rounded-lg text-white px-4 flex items-center justify-between h-[50px]"
          >
            {token == 'Select a Pool' ? (
              <>
                <span>{token}</span>
              </>
            ) : (
              <>
                <div className="w-full flex items-center gap-5">
                  <div className="flex items-center">
                    <Image
                      src={`/static/images/tokens/${token.token0Symbol}.png`}
                      alt="token"
                      className="rounded-full w-7 h-7"
                      width={20}
                      height={20}
                    />
                    <Image
                      src={`/static/images/tokens/${token.token1Symbol}.png`}
                      alt="token"
                      className="-ml-4 rounded-full w-7 h-7"
                      width={20}
                      height={20}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-white">
                      {token.token0Symbol} / {token.token1Symbol}
                    </p>
                  </div>
                  <div>
                    <span className="text-white py-1 px-3 text-xs rounded-lg border bg-shark-400 border-shark-400 ">
                      {!token.pair.hasOwnProperty('stable')
                        ? 'Concentrated Pool'
                        : token.pair.stable
                          ? 'Stable Pool'
                          : 'Volatile Pool'}
                    </span>
                  </div>
                </div>
              </>
            )}
            <span className="icon-chevron text-sm inline-block ml-2" />
          </div>
        </div>
      </div>
      <SelectPool openModal={openSelectToken} setOpenModal={setOpenSelectToken} setToken={setToken} />
    </div>
  )
}

export default ChoosePool
