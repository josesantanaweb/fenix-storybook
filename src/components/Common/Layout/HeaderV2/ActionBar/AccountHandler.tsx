/* eslint-disable max-len */
'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

import useStore from '@/src/state/zustand'
import { usePathname } from 'next/navigation'
import { useAccountModal, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import useActiveConnectionDetails from '@/src/library/hooks/web3/useActiveConnectionDetails'
import { useAccount, useSwitchChain } from 'wagmi'
import { getPointsDistributionTargetTimestamps } from '@/src/library/utils/campaigns'
import cn from '@/src/library/utils/cn'
import { blast } from 'viem/chains'
import { isSupportedChain } from '@/src/library/constants/chains'
import Countdown from 'react-countdown'
import { useQuery } from '@tanstack/react-query'
import { UserBlastPointsData } from '@/src/app/api/blast-points/[address]/route'
import Loader from '@/src/components/UI/Icons/Loader'
import { formatAmount } from '@/src/library/utils/numbers'
import ConnectToWalletButton from '@/src/components/Common/Layout/HeaderV2/ConnectToWalletButton'

interface Points {
  userLiqPoints: number[]
  pendingSent: number[]
}

type AccountHandlerProps = {
  isMenuMobile?: boolean
  isMoreOption?: boolean
}
const AccountHandler = ({ isMenuMobile, isMoreOption = true }: AccountHandlerProps) => {
  const [openPoints, setOpenPoints] = useState<boolean>(false)
  const { isConnected, account } = useActiveConnectionDetails()

  const { setWalletSelectionModal } = useStore()

  const pathname = usePathname()
  const { openConnectModal } = useConnectModal()
  const { openAccountModal } = useAccountModal()
  const { openChainModal } = useChainModal()

  const handlerConnectWallet = () => {
    openConnectModal && openConnectModal()
  }
  const { chains, switchChain } = useSwitchChain()

  const [availablePoints, setAvailablePoints] = useState<Number>(0)
  const [distributed, setDistributed] = useState<Number>(0)
  const [data, setData] = useState<Points>({} as Points)
  const { address, chainId } = useAccount()
  const { switchChainAsync } = useSwitchChain()
  const wrongChain = !isSupportedChain(chainId)
  const [nextTargetTime, setNextTargetTime] = useState<number>()

  const { data: userBlastPoints, isLoading: isLoadingUserBlastPoints } = useQuery<UserBlastPointsData>({
    queryKey: ['blast-points', address],
    enabled: !!address,
    queryFn: async () => {
      const data = await fetch('/api/blast-points/' + address)
      return await data.json()
    },
  })
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
          <span className="flex items-center gap-2">
            <i className="icon-time text-white text-sm"></i>
            <p className="text-white text-xs">
              {hours}h {minutes}m {seconds}s
            </p>
          </span>
        </>
      )
    }
  }

  return (
    <div
      className={`flex   items-center  gap-2 xl:gap-3 w-full md:w-max-content xl:w-auto flex-row ${pathname !== '/' && 'xl:absolute  xl:right-[90px]'}`}
    >
      {isConnected && !wrongChain && (
        <div className="relative w-full">
          <div
            onMouseEnter={() => setOpenPoints(true)}
            onMouseLeave={() => setOpenPoints(false)}
            // className="px-2 xl:px-5 py-1 rounded-lg items-center gap-2 transition hover:bg-shark-400 border border-transparent hover:border-shark-200 hidden lg:flex"
            className="
            w-[40px]
            rounded-md gap-2 transition hover:bg-shark-400 border border-transparent hover:border-shark-200 "
          >
            <p className="text-xs text-white">
              {/* {data.userLiqPoints} <span className="hidden lg:inline">Points</span> */}
            </p>
            <Image
              src="/static/images/tokens/BLAST.svg"
              className="w-[30px] h-[30px] mx-auto "
              alt="logo"
              width={30}
              height={30}
            />
          </div>
          {openPoints && (
            <div className="absolute z-50 bg-shark-400 rounded-lg border border-shark-300 w-auto xl:w-[250px] top-14 p-5 left-0 xl:-left-12">
              <div className="flex items-center justify-between mb-3">
                <div className="flex flex-col justify-center items-center">
                  <p className="text-shark-100 text-xs mb-2 text-center text-balance">Phase 2 Blast Points</p>
                  <p className="text-white text-sm">
                    {isLoadingUserBlastPoints ? <Loader /> : userBlastPoints?.given_blast_poins}
                  </p>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <p className="text-shark-100 text-xs mb-2 text-center text-balance">Phase 2 Blast Gold</p>
                  <p className="text-white text-sm">
                    {isLoadingUserBlastPoints ? <Loader /> : formatAmount(userBlastPoints?.given_blast_gold_points)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center flex-col">
                <p className="text-xs text-shark-100 mb-2">Next Points Drop:</p>
                <Countdown
                  key={nextTargetTime}
                  date={nextTargetTime}
                  daysInHours={true}
                  autoStart={true}
                  renderer={renderer}
                />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 items-center w-full 2xl:w-auto justify-end">
        <div className="flex w-full 2xl:w-auto">
          {isConnected ? (
            <div
              onClick={() => {
                if (wrongChain) {
                  switchChain({ chainId: Number(process.env.NEXT_PUBLIC_CHAINID) || blast.id })
                } else {
                  openConnectModal && openConnectModal()
                  openAccountModal && openAccountModal()
                }
              }}
              className="flex
              w-full
              gap-2
              md:gap-5
              p-1
              border
              rounded-[5px]
              cursor-pointer bg-shark-900 border-shark-400 bg-opacity-40 hover:bg-opacity-10 group"
            >
              <div className="w-full flex items-center gap-2.5">
                <div className="relative flex items-center  justify-center w-8 xl:w-10 h-8 xl:h-10 rounded-[10px] bg-shark-400 bg-opacity-40">
                  {wrongChain ? (
                    <Image
                      src="/static/images/icons/warning.png"
                      className="bottom-0 right-0 w-6 h-6 xl:w-8 xl:h-8"
                      alt="logo"
                      width={32}
                      height={32}
                    />
                  ) : (
                    <>
                      <span className="text-[12px] xl:text-sm icon-wallet text-outrageous-orange-500"></span>
                      <Image
                        src="/static/images/wallets/metamask.png"
                        className="absolute bottom-0 right-0 w-3 h-3 xl:w-4 xl:h-4"
                        alt="logo"
                        width={24}
                        height={24}
                      />
                    </>
                  )}
                </div>
                <div className="">
                  <p className="hidden text-xs font-medium xl:block text-shark-100">
                    {wrongChain ? 'Wrong Chain' : 'Welcome'}
                  </p>
                  <p className="flex items-center text-xs text-white">
                    <span
                      className={cn('block w-2 h-2 mr-1.5 rounded-full', wrongChain ? 'bg-red-400' : 'bg-green-400')}
                    ></span>
                    <span className="truncate max-w-[70px] xl:max-w-[150px]">{account?.slice(0, 6)}...</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center flex-shrink-0 px-1  transition-colors border-l border-shark-300 group-hover:border-shark-300">
                <span className="text-base md:text-xl icon-cog text-shark-100 group-hover:text-outrageous-orange-500"></span>
              </div>
            </div>
          ) : (
            <ConnectToWalletButton
              onClick={handlerConnectWallet}
              className={`${pathname === '/' && !isMenuMobile ? 'w-fit whitespace-nowrap' : 'w-full xl:w-[290px]'} ${pathname === '/' && isMenuMobile ? '!justify-start' : ''}`}
            />
          )}
        </div>
        {isConnected && (
          <div className="p-2 cursor-pointer hidden 2xl:flex">
            {/* <span className="text-[26px] transition-all icon-logout text-shark-100 hover:text-outrageous-orange-400"></span> */}
          </div>
        )}
      </div>
    </div>
  )
}

export default AccountHandler
