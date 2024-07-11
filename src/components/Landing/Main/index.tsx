'use client'
/* eslint-disable react/no-multi-comp */
import React from 'react'
import { Button } from '@/src/components/UI'
import { Michroma } from 'next/font/google'
import Image from 'next/image'
import Decorator from '@/src/components/Common/Layout/BackgroundLanding'
import useStore from '@/src/state/zustand'
import Blast from '@/src/components/UI/Icons/Blast'
import { useState, useEffect } from 'react'
import { useAppSelector } from '@/src/state'
import { fetchGlobalStatistics } from '@/src/state/liquidity/thunks'
import { formatAmount, formatDollarAmount, toBN } from '@/src/library/utils/numbers'
import { fetchv3Factories } from '@/src/state/liquidity/reducer'

const michroma = Michroma({
  weight: ['400'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
})
// Función para saber el tamaño de la pantalla
function useMediaQuery(query: any) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)

    const listener = (e: any) => {
      setMatches(e.matches)
    }

    mediaQuery.addEventListener('change', listener)

    return () => {
      mediaQuery.removeEventListener('change', listener)
    }
  }, [query])

  return matches
}
const Box = ({ text, value }: { text: string; value: string }) => {
  return (
    <div className="flex w-[100%] flex-col items-center justify-center mt-[120px]">
      <div className="text-gradient2 text-lg max-sm:text-base leading-normal tracking-[4.86px] font-semibold mb-[5px] mt-[-120px]">
        {value}
      </div>
      <div className="text-base font-light text-shark-100 max-sm:text-sm">{text}</div>
    </div>
  )
}

const Main = () => {
  const isTablet = useMediaQuery('(min-width: 768px)')
  const isConnected = useStore((state) => state.isConnected)
  const { setWalletSelectionModal } = useStore()
  const [isHover, setIsHover] = useState(false)

  // const handleIsHoverActive = () => setIsHover(true)
  // const handleIsHoverInactive = () => setIsHover(false)

  const handlerConnectWallet = () => setWalletSelectionModal(true)

  const [globalStatistics, setGlobalStatistics] = useState<Awaited<ReturnType<typeof fetchGlobalStatistics>>>()
  useEffect(() => {
    const fetchAndSetStatistics = async () => {
      try {
        const statistics = await fetchGlobalStatistics()
        setGlobalStatistics({
          totalTVL: toBN(statistics?.totalTVL).toNumber(),
          totalVolume: toBN(statistics?.totalVolume).toNumber(),
          totalFees: toBN(statistics?.totalFees).toNumber(),
          lastUpdate: new Date().toISOString(),
          totalUsers: statistics?.totalUsers,
        })
      } catch (error) {
        setGlobalStatistics({
          totalTVL: 0,
          totalVolume: 0,
          totalFees: 0,
          lastUpdate: new Date().toISOString(),
          totalUsers: 0,
        })
      }
    }
    fetchAndSetStatistics()
  }, [])
  // const liquidityTable = useAppSelector((state) => state.liquidity.v2Pairs.tableData)
  //
  //
  // const tvl = '$ ' + liquidityTable.reduce((total: any, pair: any) => total + Number(pair.tvl), 0).toFixed(0)
  // const fee =
  //   '$ ' +
  //   liquidityTable
  //     .reduce((total: any, pair: any) => total + Number(pair.volumeUSD) * (Number(pair.fee) / 100), 0)
  //     .toFixed(0)
  // const volume = '$ ' + liquidityTable.reduce((total: any, pair: any) => total + Number(pair.volumeUSD), 0).toFixed(0)

  return (
    <div className="h-[500px] xl:h-[600px] xl:pb-20 2xl:pb-0 flex flex-col items-center justify-center">
      <div className="shooting-stars bottom-[6000px]"></div>
      <div className="shooting-stars bottom-[5200px]"></div>
      <div className="shooting-stars xl:bottom-[6650px]"></div>
      <div className="shooting-stars bottom-[2500px]"></div>
      <div className="shooting-stars bottom-[1100px]"></div>
      <div className="shooting-stars bottom-[20px]"></div>
      <div className="relative overflow-hidden">
        <div className="container relative">
          <div className="flex flex-col ">
            <div className="max-w-[345px] md:max-w-[800px] mx-auto text-center shrink-0">
              <Image
                src="/static/images/landing/main/fenix.svg"
                width={90}
                height={90}
                alt="Fenix"
                className="mx-auto mb-3"
              />
              <h1 className="text-base md:text-xl text-shark-100 leading-normal mb-2">Welcome to Fenix Finance</h1>
              <h3 className={`text-white  md:text-[32px] leading-[139%] mb-[21px] w-full  ${michroma.className}`}>
                THE UNIFIED TRADING AND <span className="text-gradient2">LIQUIDITY MARKETPLACE </span>
                <span className="flex items-center justify-center xl:items-center gap-3">
                  FOR
                  <span className="svgcontainer pt-2 ">
                    <Blast />
                  </span>
                </span>
              </h3>

              {!isConnected && (
                <Button
                  className="w-[112px] h-[44px] md:w-[322px] md:h-[41px] !text-sm !py-2.5 !px-0 mx-auto"
                  href="/trade/swap"
                >
                  <span>Launch App</span>
                </Button>
              )}
            </div>
            <div className=" flex pt-10 flex-col gap-2 items-center md:hidden">
              <p className="text-xs  animate-color-change ">Swipe</p>
              <span className="icon-scroll text-white animate-color-change animate-bounce"></span>
            </div>
          </div>
        </div>
      </div>
      <div className="relative 2xl:bottom-[-18rem] max-2xl:bottom-[-35rem]  w-[100%]">
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[70%] max-sm:w-[100%]">
          <div
            className={`grid 2xl:grid-cols-4 max-2xl:grid-cols-2 max-md:grid-cols-1
             justify-center items-center px-5 mx-auto ${isTablet ? 'info-box' : 'mobile-info-box'}`}
          >
            <Box text="Total Value Locked" value={formatDollarAmount(globalStatistics?.totalTVL?.toString()) || '-'} />
            <Box text="Total Volume" value={formatDollarAmount(globalStatistics?.totalVolume?.toString()) || '-'} />
            <Box text="Total Fees" value={formatDollarAmount(globalStatistics?.totalFees?.toString()) || '-'} />
            <Box text="Active Users" value={formatAmount(globalStatistics?.totalUsers?.toString()) || '-'} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Main
