import { LockElement } from '@/src/library/structures/lock/LockElement'
import formatDate from '@/src/library/utils/foramatDate'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

interface AboutFnxProps {
  lock: LockElement | undefined
}

const AboutFnx = ({ lock }: AboutFnxProps) => {
  const [lockInfo, setlockInfo] = useState<LockElement>()
  useEffect(() => {
    setlockInfo(lock)
  })
  return (
    <div className="flex flex-col bg-shark-400 p-8 bg-opacity-40 shadow-md rounded-2xl">
      <div className="flex flex-col justify-start">
        <div className="flex items-center gap-2">
          <Image alt="fenix-logo" src={'/static/images/vote/fenix-logo.svg'} height={30} width={30} />
          <div className="flex flex-col">
            <p className="text-shark-100 text-xs">Value</p>{' '}
            <p className="text-white text-sm">{(Number(lockInfo?.veNFTInfo.amount) / 10 ** 18).toFixed(2)} FNX</p>
          </div>
        </div>
        <Image
          className="mx-auto"
          src={'/static/images/lock/fenix-about.svg'}
          alt="logo fenix"
          height={425}
          width={425}
        />
      </div>
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <span className="icon-lock-off inline-block text-2xl text-transparent bg-gradient-to-r from-outrageous-orange-500 to-festival-500 bg-clip-text "></span>{' '}
          <div>
            <p className="text-xs text-shark-100">Unlocks</p>
            <p className="text-sm text-white">
              {lockInfo?.veNFTInfo.lockEnd ? formatDate(Number(lockInfo?.veNFTInfo.lockEnd)) : 'dd/mm/yy'}
            </p>
          </div>
        </div>
        <div>
          <p className="text-xs text-shark-100">Token ID</p>
          <p className="text-white text-sm text-right">{lockInfo?.veNFTInfo.id.toString()}</p>
        </div>
      </div>
    </div>
  )
}

export default AboutFnx
