'use client'

import Image from 'next/image'
import { Button, Tooltip } from '@/src/components/UI'
import { formatAmount, formatCurrency } from '@/src/library/utils/numbers'
import Countdown from 'react-countdown'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { log } from 'console'
import { useRingsPointsLeaderboard } from '@/src/library/hooks/rings/useRingsPoints'
import Loader from '../../UI/Icons/Loader'
import useActiveConnectionDetails from '@/src/library/hooks/web3/useActiveConnectionDetails'
import { getPointsDistributionTargetTimestamps } from '@/src/library/utils/campaigns'
import { useReadContract } from 'wagmi'
import { erc20Abi, zeroAddress } from 'viem'

const PointSummary = ({ userData }: any) => {
  //

  const { data, isLoading } = useRingsPointsLeaderboard()
  const [nextTargetTime, setNextTargetTime] = useState<number>()

  // const targetHoursUTC = [17, 1, 9]
  const targetHoursUTC = getPointsDistributionTargetTimestamps()
  const calculateNextTargetTime = () => {
    const nowUTC = new Date(new Date().toISOString().substring(0, 19) + 'Z')

    const nextTimes = targetHoursUTC.map((hour) => {
      const nextTime = new Date(hour)
      nextTime.setUTCFullYear(nowUTC.getUTCFullYear(), nowUTC.getUTCMonth(), nowUTC.getUTCDate())

      if (nextTime <= nowUTC) {
        nextTime.setUTCDate(nextTime.getUTCDate() + 1)
      }

      return nextTime.getTime()
    })

    const nextTime = Math.min(...nextTimes)
    setNextTargetTime(nextTime)
  }

  useEffect(() => {
    calculateNextTargetTime()
    const interval = setInterval(calculateNextTargetTime, 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const renderer = ({
    hours,
    minutes,
    seconds,
    completed,
  }: {
    hours: number
    minutes: number
    seconds: number
    completed: boolean
  }) => {
    if (completed) {
      calculateNextTargetTime()
    } else {
      return (
        <>
          <div className="flex items-center justify-between px-4">
            <div className="flex flex-col">
              <span className="text-white text-xs bg-shark-400 bg-opacity-40 px-2 py-1 rounded-lg text-center">
                {hours}
              </span>
              <span className="text-shark-100 text-xs text-center">Hours</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white text-xs bg-shark-400 bg-opacity-40 px-2 py-1 rounded-lg text-center">
                {minutes}
              </span>
              <span className="text-shark-100 text-xs text-center">Minutes</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white text-xs bg-shark-400 bg-opacity-40 px-2 py-1 rounded-lg text-center">
                {seconds}
              </span>
              <span className="text-shark-100 text-xs text-center">Seconds</span>
            </div>
          </div>
        </>
      )
    }
  }

  const { account } = useActiveConnectionDetails()
  const userPoints = useMemo(() => {
    if (!data || !account) {
      return 0
    }
    return data.find((entry) => entry.id.toLowerCase() === account.toLowerCase())?.accumulated_rings_points
  }, [data, account])
  const userRank = useMemo(() => {
    if (!data || !account) {
      return '-'
    }
    return data.findIndex((entry) => entry.id.toLowerCase() === account.toLowerCase()) + 1
  }, [data, account])
  const [showNTFBoostInfo, setShowNTFBoostInfo] = useState(false)
  const { data: nftBoost } = useReadContract({
    address: '0x1c4b87badfa5d512aaeb1dd3f348ef2aa98b869a', // nft address
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [account || zeroAddress],
  })
  const MAX_NFT_BOOST = 20
  return (
    <section className="your-point-box">
      <div className="flex flex-col xl:flex-row items-start w-full justify-between mb-8 xl:items-center relative z-10">
        <h2 className="text-white text-lg mb-3 font-medium">Your point summary</h2>
        <Button className="w-full xl:w-auto" href="/liquidity">
          Provide Liquidity
        </Button>
      </div>
      <div className="flex flex-col xl:flex-row items-center justify-between gap-5 xl:gap-20 relative z-20">
        <div className="point-summary-box" onMouseLeave={() => setShowNTFBoostInfo(false)}>
          <p
            className="text-base mb-2 text-white flex items-center w-full gap-2 text-left relative cursor-pointer"
            onClick={() => setShowNTFBoostInfo(true)}
          >
            Rings{' '}
            <span className="text-xs flex items-center bg-shark-400 border border-shark-100 gap-2 text-white font-normal px-5 py-1 rounded-md">
              <Image
                src="/static/images/tokens/blackFNX.svg"
                alt="Black FNX"
                width={10}
                height={10}
                className="w-[1.25rem]  h-[1.25rem] ml-[-4px]"
              ></Image>
              {nftBoost ? Math.min(Number(nftBoost), MAX_NFT_BOOST).toString() : '0'}% NFT Boost
              {/* <span className="icon-info ml-1"></span> */}
            </span>
            <div
              className={`box-fenix-goldies cursor-default absolute left-[-60px] max-lg:left-1/2 max-lg:-translate-x-1/2 top-8 px-4 py-2
               text-white text-xs w-[360px] flex flex-col items-center ${showNTFBoostInfo ? 'block' : 'hidden'}`}
            >
              <div className="flex items-center flex-col mx-auto gap-2 mt-4 justify-center z-[500]">
                <Image
                  src={'/static/images/tokens/FNX.svg'}
                  alt="FNX"
                  className="w-10 z-[10]"
                  width={10}
                  height={10}
                ></Image>
                <h3 className="text-xl font-normal leading-none z-[10]">Fenix Goldies NFT</h3>
                <h3 className="text-base font-bold leading-none z-[10]">Boost up to 20%!</h3>
              </div>
              <div className="text-xs font-normal flex flex-col gap-1 z-[500] relative w-[80%]">
                <div className="z-[10] text-shark-100 mt-4 mb-2 w-[100%]">
                  For every NFT you have you get a 1% Boost, up to a maximum of 20 NFTs (20%).
                </div>
                <div className="z-[10] text-shark-100 flex items-center justify-start gap-2">
                  <Image src={'/static/images/landing/Build/polygon.svg'} height={10} width={10} alt="polygon" />1 NFT =
                  1% Boost
                </div>
                <div className="z-[10] text-shark-100 flex items-center justify-start gap-2">
                  <Image src={'/static/images/landing/Build/polygon.svg'} height={10} width={10} alt="polygon" />2 NFTs
                  = 2% Boost
                </div>
                <div className="z-[10] text-shark-100 flex items-center justify-start gap-2">
                  <Image src={'/static/images/landing/Build/polygon.svg'} height={10} width={10} alt="polygon" />
                  20 NFTs = 20% Boost
                </div>
                <Button
                  variant="primary"
                  className="mx-auto mt-3 w-[70%] !py-1"
                  onClick={() => {
                    window.open('https://blastr.xyz/fenix-goldies', '_blank')
                  }}
                >
                  Fenix Goldies NFTs
                </Button>
              </div>
              {/* <ul className="list-disc  pl-4 space-y-1">
                <li className="list-item">100% of Blast Gold will be distributed to holders.</li>
                <li className="list-item">Fully refundable after 21 days</li>
                <li className="list-item">Early Access to our District One Sprint Launch</li>
                <li className="list-item">
                  For every NFT you own, you get a 1% boost, up to a maximum of 20 NFTs (20%)
                </li>
              </ul> */}
            </div>
          </p>
          <div className="flex items-center gap-4 w-full">
            <div className="flex flex-col items-center h-12 justify-center gap-y-1 mt-1">
              <Image
                src="/static/images/points-program/orbit.svg"
                alt="token"
                width={20}
                height={20}
                // className="w-8 h-8"
              />
              <p className="text-xs text-white">Fenix Rings</p>
            </div>
            <div className="h-12 flex flex-col justify-between">
              <h3 className="text-3xl font-medium text-white">
                {isLoading ? <Loader size={'20px'} /> : userPoints ? formatAmount(userPoints, 6, true) : '-'}
              </h3>
              {/* <p className="text-xs text-transparent bg-gradient-to-r from-outrageous-orange-500 to-festival-500 bg-clip-text">
                Your Total points
              </p> */}
            </div>
          </div>
        </div>
        <div className="point-summary-box relative">
          <p className="text-base mb-2 text-white w-full">Leaderboard Position</p>
          <div className="flex items-center gap-3 w-full">
            <div className="flex items-center justify-center w-12 h-12 border border-solid rounded-lg bg-shark-400 border-shark-400">
              <span className="text-lg text-transparent icon-circles bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text"></span>
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-3xl font-medium text-white"> {isLoading ? <Loader size={'20px'} /> : userRank}</h3>
              <div className="">
                <p className="text-white text-xs">RANK</p>
              </div>
            </div>
          </div>
          <span className="absolute top-0 -left-[40px] z-0 rotate-90 hidden xl:block">
            <Image src="/static/images/components/line.svg" alt="line" className="w-1 h-20" width={1} height={35} />
          </span>
          <span className="absolute top-0 -right-[40px] z-0 rotate-90 hidden xl:block">
            <Image src="/static/images/components/line.svg" alt="line" className="w-1 h-20" width={1} height={35} />
          </span>
        </div>
        <div className="point-summary-box">
          <p className="text-base text-white w-full mb-4">
            Next Points Drop
            {/* Next Points Drop <span className="text-xs mb-4 text-green-400 w-full ml-1">14 Feb, 2PM UTC</span> */}
          </p>
          <div className="w-full">
            <Countdown
              key={nextTargetTime}
              date={nextTargetTime}
              daysInHours={true}
              autoStart={true}
              renderer={renderer}
            />
          </div>

          {/* --- */}
        </div>
      </div>
    </section>
  )
}

export default PointSummary
