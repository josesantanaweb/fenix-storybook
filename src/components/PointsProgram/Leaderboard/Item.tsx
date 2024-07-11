'use client'
import { RankingEntry } from '@/src/library/hooks/rings/useRingsPoints'
import { formatAmount, formatCurrency } from '@/src/library/utils/numbers'
import Image from 'next/image'
const Item = ({ data, isUser }: { data: RankingEntry; isUser: boolean }) => {
  return (
    <div
      className={`flex items-center w-full ${isUser ? 'bg-ranking-gradient border border-outrageous-orange-400' : 'bg-shark-400 border border-shark-300'} bg-opacity-40 py-6 rounded-md mb-4 px-3 xl:px-0 gap-3`}
    >
      <span className="text-white xl:w-36 text-center flex items-center justify-center">
        <div
          className={`bg-shark-400 bg-opacity-40 border ${isUser ? 'border-white' : 'border-shark-300'} w-10 rounded-md text-xs py-2`}
        >
          {data?.ranking}
        </div>
      </span>
      <span className="text-white w-full">
        <div className="flex items-center gap-4">
          <Image
            src="/static/images/points-program/orbit.svg"
            alt="user"
            width={40}
            height={40}
            className="w-10 h-10"
          />
          <p className="text-sm max-w-[100px] xl:max-w-auto truncate">{data.id}</p>
        </div>
      </span>
      <span className="text-white xl:w-36 text-center text-sm">
        {formatAmount(data.accumulated_rings_points, 6, true)}
      </span>
    </div>
  )
}

export default Item
