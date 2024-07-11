'use client'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

// store
import { useAppSelector } from '@/src/state'
import { fetchGlobalStatistics } from '@/src/state/liquidity/thunks'

// helpers
import { fetchTokens } from '@/src/library/common/getAvailableTokens'
import { formatDollarAmount, toBN } from '@/src/library/utils/numbers'

// components
import { Button } from '@/src/components/UI'
import MainBox from '@/src/components/Common/Boxes/MainBox'
import InfoBox from '@/src/components/Common/InfoBox'

// constants
import { EXCHANGE_LIST } from '../data'

const LiquidityPools = () => {
  // common
  const { chainId } = useAccount()
  const liquidityTable = useAppSelector((state) => state.liquidity.v2Pairs.tableData)

  // states
  const [tokens, setTokens] = useState<Number>(0)
  const [globalStatistics, setGlobalStatistics] =
    useState<Omit<Awaited<ReturnType<typeof fetchGlobalStatistics>>, 'totalUsers'>>()

  // computed
  EXCHANGE_LIST[0].description = globalStatistics?.totalTVL ? formatDollarAmount(toBN(globalStatistics?.totalTVL)) : '-'
  EXCHANGE_LIST[1].description = globalStatistics?.totalFees
    ? formatDollarAmount(toBN(globalStatistics?.totalFees))
    : '-'
  EXCHANGE_LIST[2].description = globalStatistics?.totalVolume
    ? formatDollarAmount(toBN(globalStatistics?.totalVolume))
    : '-'

  // effects
  useEffect(() => {
    tokensData(liquidityTable)
    // fetchData()
  }, [chainId])

  useEffect(() => {
    const fetchAndSetStatistics = async () => {
      const statistics = await fetchGlobalStatistics()
      setGlobalStatistics({
        totalTVL: toBN(statistics?.totalTVL || 0).toNumber(),
        totalVolume: toBN(statistics?.totalVolume || 0).toNumber(),
        totalFees: toBN(statistics?.totalFees || 0).toNumber(),
        lastUpdate: new Date().toISOString(),
      })
      EXCHANGE_LIST[0].description = globalStatistics?.totalTVL
        ? formatDollarAmount(toBN(globalStatistics?.totalTVL))
        : '-'
      EXCHANGE_LIST[1].description = globalStatistics?.totalFees
        ? formatDollarAmount(toBN(globalStatistics?.totalFees))
        : '-'
      EXCHANGE_LIST[2].description = globalStatistics?.totalVolume
        ? formatDollarAmount(toBN(globalStatistics?.totalVolume))
        : '-'
    }
    fetchAndSetStatistics()
  }, [])

  // async helpers
  async function tokensData(liquidityTable: any): Promise<void> {
    setTokens((await fetchTokens(chainId || Number(process.env.NEXT_PUBLIC_CHAINID))).length)
  }

  return (
    <MainBox>
      <div
        className="flex flex-col items-center justify-between
       w-full xl:flex-row relative z-10 "
      >
        <div className="w-full xl:w-1/2 relative">
          <h1 className="mb-3 text-xl text-white">Liquidity Pools</h1>
          <p className="mb-4 text-xs text-shark-100">
            Liquidity Providers (LPs) make low-slippage swaps possible. Deposit and stake liquidity to earn rewards.
          </p>
          <div className="flex flex-col gap-2 mb-8 md:flex-row z-[3000]">
            <Button href="liquidity/deposit?type=CONCENTRATED_MANUAL&token0=0x4300000000000000000000000000000000000004&token1=0x4300000000000000000000000000000000000003">
              <div className="flex gap-2 text-xs">
                <span className="icon-send"></span>
                Create Position
              </div>
            </Button>
          </div>
          <p className="flex items-center gap-3 mb-4 text-shark-100 text-xs">
            <span className="inline-block  text-transparent icon-circles bg-gradient-to-r from-outrageous-orange-500 to-festival-500 bg-clip-text"></span>
            There are currently {tokens.toString()} tokens listed.
          </p>
        </div>
        <div className="relative flex flex-col w-full xl:w-[40%]">
          {EXCHANGE_LIST.map((exchange, index) => (
            <InfoBox key={index} data={exchange} hasTooltip={false} />
          ))}
          {/* <InfoBox
            data={{
              label: 'Total Value Locked',
              description: globalStatistics?.totalTVL.toFixed(2).toString(),
              icon: 'icon-lock',
            }}
            hasTooltip={false}
          /> */}
        </div>
      </div>
      <div className="hidden lg:block text-shark-100 rounded-2xl lg:rounded-none relative z-10">
        {/* <Link
          target="_blank"
          href="https://discord.com/invite/fenixfi"
          className="flex gap-3 justify-end cursor-pointer"
        >
          <span className="icon-discord"></span>
          <p className="me-10">Need some help?</p>
        </Link> */}
      </div>
    </MainBox>
  )
}

export default LiquidityPools
