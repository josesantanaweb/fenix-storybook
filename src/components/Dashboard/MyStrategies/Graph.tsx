'use client'

import { useEffect, useState } from 'react'
import { Button, Switch } from '../../UI'
import { positions } from './Strategy'
import { formatAmount } from '@/src/library/utils/numbers'
import { getAlgebraPoolPrice } from '@/src/library/hooks/liquidity/useCL'
import cn from '@/src/library/utils/cn'

type GraphProps = {
  row: positions
  tickLower: {
    price0: string
    price1: string
  }
  tickUpper: {
    price0: string
    price1: string
  }
  token1Symbol: string
  token0Symbol: string
}

const Graph = ({ row, tickLower, tickUpper, token0Symbol, token1Symbol }: GraphProps) => {
  const [showtoken0, setshowtoken0] = useState(true)
  const handlerSwitch = () => {
    setshowtoken0(!showtoken0)
  }

  const sqrtPrice = Math.pow(1.0001, 887220 / 2)
  // return Math.pow(sqrtPrice, 2)
  //

  /* price0 / 1e(token1.decimals - token0.decimals) */

  /* price0 * 1e(token0.decimals - token1.decimals) */

  const minPrice = parseFloat(tickLower?.price0) * 10 ** (Number(row?.token0?.decimals) - Number(row?.token1?.decimals))
  const maxPrice = parseFloat(tickUpper?.price0) * 10 ** (Number(row?.token0?.decimals) - Number(row?.token1?.decimals))
  const minPriceIsZero = minPrice < 1e-5
  const maxPriceIsInfinity = maxPrice > 1e12
  const [poolGlobalState, setPoolGlobalState] = useState<{
    price: number
    currentTick: number
  }>({
    price: 0,
    currentTick: 0,
  })
  const getPoolCurrentState = async () => {
    const state = await getAlgebraPoolPrice(row?.token0?.id as `0x${string}`, row?.token1?.id as `0x${string}`)
    if (state) {
      setPoolGlobalState(state)
    }
  }
  useEffect(() => {
    getPoolCurrentState()
  }, [])

  const currentPoolPrice = Number(poolGlobalState?.price / 10 ** Number(row.token1.decimals)).toFixed(6)

  const isInRange = true

  return (
    <div className="flex flex-col w-full h-32 justify-endñ ">
      <div className="flex flex-col  relative ">
        <div className="flex w-full">
          {row.liquidity === 'ichi' ? (
            <>
              <p
                className="bg-shark-300 
               h-[50px]
               mx-auto
               w-full
               text-center
               justify-center
                 flex items-center
              bg-opacity-40 border border-shark-400 text-white text-xs px-3 py-2  rounded-sm  z-50"
              >
                Position Managed by ICHI
              </p>
            </>
          ) : row.liquidity === 'gamma' ? (
            <>
              <p
                className="bg-shark-300 
               h-[50px]
               mx-auto
               w-full
               text-center
               justify-center
                 flex items-center
              bg-opacity-40 border border-shark-400 text-white text-xs px-3 py-2  rounded-sm  z-50"
              >
                Position Managed by GAMMA
              </p>
            </>
          ) : (
            showtoken0 && (
              <div className="flex gap-2 w-full">
                <p
                  className="bg-shark-300 w-full bg-opacity-40 border 
                sm:h-[50px]
                border-shark-400 text-white text-xs z-[100] px-3 py-2  rounded-sm "
                >
                  Min. Price: {minPriceIsZero ? 0 : formatAmount(minPrice, 6)} {token0Symbol}/{token1Symbol}
                </p>

                <p
                  className="bg-shark-300 w-full bg-opacity-40 border border-shark-400 text-white text-xs z-[100]
                sm:h-[50px] px-3 py-2  rounded-sm "
                >
                  Max. Price: {maxPriceIsInfinity ? '∞' : formatAmount(maxPrice, 6)} {token0Symbol}/{token1Symbol}
                </p>
              </div>
            )
          )}
        </div>
        <div className="w-full flex relative pt-2">
          <p
            className="bg-shark-300 bg-opacity-40 border border-shark-400 
            
          text-white text-xs px-3 py-1 rounded-sm mx-auto mt-1"
          >
            0
          </p>
          <div className="flex items-start inset-0 justify-center w-full absolute top-[50%] bottom-[50%]">
            {Array.from({ length: 10 }).map((_, index) => (
              <span key={index} className="h-5 w-5 border-l border-shark-300 " />
            ))}
          </div>
          <div className="w-full flex items-center relative">
            {minPriceIsZero && maxPriceIsInfinity ? (
              <div className=" bg-gradient-to-b from-shark-400 w-full to-green-500 border-x-2 border-green-500 opacity-30 p-4"></div>
            ) : (
              <div
                className={cn(
                  'left-[40%] w-[20%] mx-auto p-4  border-x-2  opacity-30',
                  isInRange
                    ? 'border-green-500 bg-gradient-to-b from-shark-400 to-green-500'
                    : 'border-red-500 to-red-500 bg-gradient-to-b from-shark-400'
                )}
              ></div>
            )}
            {isInRange && <div className="left-[50%] bottom-0 right-[50%] absolute w-[1px] h-1/2 bg-white"></div>}
          </div>
          <p className="bg-shark-300 bg-opacity-40 border border-shark-400 text-white text-xs px-3 py-1 rounded-sm mx-auto mt-1">
            ∞
          </p>
        </div>
      </div>
      <div className="flex items-center w-full justify-center px-10 py-2 border-t-2 border-shark-400">
        <p className="text-white text-xs">
          {<span className="text-green-400">In range</span>}
          <span>
            {currentPoolPrice !== '0' && !isNaN(Number(currentPoolPrice)) && <span> ({currentPoolPrice})</span>}
          </span>
        </p>
      </div>
    </div>
  )
}

export default Graph
