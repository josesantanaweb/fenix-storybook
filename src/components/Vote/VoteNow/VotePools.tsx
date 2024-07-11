import React from 'react'
import Image from 'next/image'

const VotePools = ({ data, removePool }: any) => {
  return (
    <div className="flex justify-between items-center vote-box p-5 gap-5  w-auto ">
      <div className="flex relative z-50 items-center gap-2 ">
        <div className="flex items-center w-full">
          <Image
            src={`/static/images/tokens/${data.token0}.png`}
            alt="token"
            className="rounded-full w-7 h-7"
            width={20}
            height={20}
          />
          <Image
            src={`/static/images/tokens/${data.token1}.png`}
            alt="token"
            className="-ml-4 rounded-full w-7 h-7"
            width={20}
            height={20}
          />
        </div>
      </div>
      <div className="w-[6rem] flex relative z-50 items-center">
        <div className="flex flex-col justify-center">
          <h5 className="text-sm text-white">
            {data.token0} / {data.token1}
          </h5>
          <div className="flex justify-between items-center gap-2">
            {data.pair === 'Concentrated' && (
              <span className="text-xs py-1 rounded-lg text-white px-3  bg-green-500 border border-solid border-1 border-green-400 bg-opacity-40 ">
                Concentrated
              </span>
            )}
            {data.pair === 'Stable Pool' && (
              <span className="text-white py-1 px-3 text-xs rounded-lg border bg-shark-400 border-shark-400">
                Stable Pool
              </span>
            )}
            {data.pair === 'Volatile Pool' && (
              <span className="text-white py-1 px-3 text-xs rounded-lg border bg-shark-400 border-shark-400">
                Volatile Pool
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex  relative z-50 items-start">
        <span className="py-1 px-3  text-xs text-white border border-solid bg-shark-400 rounded-xl bg-opacity-40 border-1 border-shark-300">
          {data.percentage}%
        </span>
      </div>
      <div
        className="icon-x absolute z-50 p-2 right-0 top-0 text-shark-100 cursor-pointer"
        onClick={() => removePool(data.id)}
      ></div>
    </div>
  )
}

export default VotePools
