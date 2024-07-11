//@ts-nocheck
import Image from 'next/image'
import { Button } from '@/src/components/UI'
import { useState } from 'react'

import TokensSelector from '@/src/components/Liquidity/Common/TokensSelector'

const Classic = ({
  depositType,
}: {
  depositType: 'VOLATILE' | 'STABLE' | 'CONCENTRATED_AUTOMATIC' | 'CONCENTRATED_MANUAL'
  tokenSwap: { name: string; symbol: string }
  tokenFor: { name: string; symbol: string }
}) => {
  const [firstToken, setFirstToken] = useState({ name: 'Fenix', symbol: 'FNX' })
  const [firstValue, setFirstValue] = useState(0)
  const [secondToken, setSecondToken] = useState({ name: 'ethereum', symbol: 'ETH' })
  const [secondValue, setSecondValue] = useState(0)

  return (
    <>
      <div className="bg-shark-400 bg-opacity-40 py-[11px] px-[19px] flex items-center justify-between gap-2.5 border border-shark-950 rounded-[10px] mb-2.5 max-md:items-start">
        <div>
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="flex items-center flex-shrink-0">
              <Image
                src="/static/images/tokens/FNX.svg"
                alt="token"
                className="rounded-full max-md:w-5 max-md:h-5"
                width={30.5}
                height={30.5}
              />
              <Image
                src="/static/images/tokens/ETH.svg"
                alt="token"
                className="-ml-2.5 md:-ml-4 rounded-full max-md:w-5 max-md:h-5"
                width={30.5}
                height={30.5}
              />
            </div>
            <div className="flex flex-col gap-px">
              <h5 className="text-xs md:text-sm text-white leading-normal font-semibold">FNX / ETH</h5>
              <div className="flex items-center gap-[5px] max-md:flex-wrap">
                {'VOLATILE' === depositType ? (
                  <Button variant="tertiary" className="!py-1 h-[28px] max-md:!text-xs flex-shrink-0">
                    Volatile Pool
                  </Button>
                ) : 'CONCENTRATED_AUTOMATIC' === depositType || 'CONCENTRATED_MANUAL' === depositType ? (
                  <Button
                    variant="tertiary"
                    className="!py-1 hover:!border-none !bg-green-500 !border !border-solid !border-1 !border-green-400 !bg-opacity-40 h-[28px] max-md:!text-xs flex-shrink-0"
                  >
                    Concentrated
                  </Button>
                ) : 'STABLE' === depositType ? (
                  <Button variant="tertiary" className="!px-5 !py-0 h-[28px] max-md:!text-xs flex-shrink-0">
                    Stable Pool
                  </Button>
                ) : null}

                <Button
                  variant="tertiary"
                  className="!px-5 !py-0 h-[28px] !border-opacity-100 [&:not(:hover)]:border-shark-200 !bg-shark-300 !bg-opacity-40 max-md:!text-xs flex-shrink-0"
                >
                  0.3%
                </Button>
                <Button
                  variant="tertiary"
                  className="!p-0 h-[28px] w-[33px] !border-opacity-100 [&:not(:hover)]:border-shark-200 !bg-shark-300 !bg-opacity-40 max-md:!text-xs flex-shrink-0"
                >
                  <span className="icon-info"></span>
                </Button>
              </div>
            </div>
          </div>
          <div className="flex items-center text-xs leading-normal max-md:flex-wrap gap-[5px]">
            <div className="text-white">Liquidity</div>
            <div className="flex items-center gap-2.5">
              <p className="flex gap-[5px] items-center text-shark-100 flex-shrink-0">
                <Image
                  src="/static/images/tokens/FNX.svg"
                  alt="token"
                  className="w-5 h-5 rounded-full"
                  width={20}
                  height={20}
                />
                <span>2,313,873.46</span>
              </p>
              <p className="flex gap-[5px] items-center text-shark-100 flex-shrink-0">
                <Image
                  src="/static/images/tokens/ETH.svg"
                  alt="token"
                  className="w-5 h-5 rounded-full"
                  width={20}
                  height={20}
                />
                <span>225.38</span>
              </p>
            </div>
          </div>
        </div>

        <div className="text-xs leading-normal text-white">
          <div className="md:mb-[5px] text-right">APR</div>

          <p className="py-[5px] px-5 border border-solid bg-shark-400 rounded-[10px] bg-opacity-40 border-1 border-shark-300">
            0%
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1 mb-5 relative">
        <TokensSelector
          firstToken={firstToken}
          setFirstToken={setFirstToken}
          firstValue={firstValue}
          setFirstValue={setFirstValue}
          secondToken={secondToken}
          setSecondToken={setSecondToken}
          secondValue={secondValue}
          setSecondValue={setSecondValue}
        />
      </div>
    </>
  )
}

export default Classic
