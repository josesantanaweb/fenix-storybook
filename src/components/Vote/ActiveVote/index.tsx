import { LockElement } from '@/src/library/structures/lock/LockElement'
import { formatNumber, fromWei } from '@/src/library/utils/numbers'
import { AppThunkDispatch, useAppSelector } from '@/src/state'
import { fetchNftsAsync } from '@/src/state/lock/reducer'
import { lockState } from '@/src/state/lock/types'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useAccount } from 'wagmi'

interface ActiveVoteProps {
  handlerChange?: () => void
  lock?: LockElement
}

const ActiveVote = ({ handlerChange, lock }: ActiveVoteProps) => {
  const [lockInfo, setlockInfo] = useState<LockElement>()
  const [nowTime, setnowTime] = useState<Number>(0)

  useEffect(() => {
    setlockInfo(lock)
    const now = new Date().getTime() / 1000
    setnowTime(now)
  })
  return (
    <div
      className={`flex flex-wrap  sm:flex-nowrap items-center gap-8 p-5 text-white border-solid border-1
       border-shark-400 bg-shark-400 bg-opacity-40 rounded-xl`}
    >
      <div className="flex justify-between w-full items-center cursor-pointer" onClick={handlerChange}>
        <div className="flex items-start gap-2 xl:gap-8 2xl:gap-2 justify-between sm:justify-start w-full">
          <div className="flex items-center gap-2  ">
            <Image
              alt="logo-fenix"
              src={'/static/images/tokens/FNX.png'}
              className="h-[32px] w-[32px]"
              width={61}
              height={61}
            />
            <div className="flex flex-col w-full">
              <div className="flex gap-2 items-center ">
                <p className="text-shark-100 text-xs line-clamp-1">Selected Position</p>
              </div>
              <div className="flex text-xs gap-2  ">
                <p>{lockInfo?.veNFTInfo.id.toString()}</p>
                {BigInt(nowTime.toFixed(0).toString()) < Number(lockInfo?.veNFTInfo.lockEnd) ? (
                  <p className="text-green-400 line-clamp-1">
                    <span>•</span> Active
                  </p>
                ) : (
                  <p className=" text-red-400 line-clamp-1">
                    <span>•</span> Expire
                  </p>
                )}
              </div>
            </div>
          </div>
          <span className="icon-chevron text-xs"></span>
        </div>
      </div>
      <div className="flex xl:justify-end gap-5 xl:gap-2 2xl:gap-4 w-full justify-center sm:justify-end   items-center">
        <div className="text-xs text-center  xl:w-auto">
          <p className="text-shark-100">Position</p>
          <p className="whitespace-nowrap">
            {formatNumber(Number(fromWei(Number(lockInfo?.veNFTInfo.amount))), 2).replace('NaN', '0')} FNX
          </p>
        </div>
        <div className="text-xs text-center xl:w-auto">
          <p className="text-shark-100 whitespace-nowrap">Voting Power</p>
          <p>{formatNumber(Number(fromWei(Number(lockInfo?.veNFTInfo.voting_amount))), 2).replace('NaN', '0')} veFNX</p>
        </div>
        {/* <div className="text-xs text-center xl:w-auto ">
          <p className="text-shark-100  ">Rewards</p>
          <p className="text-green-300 ">$0</p>
        </div> */}
      </div>
    </div>
  )
}

export default ActiveVote
