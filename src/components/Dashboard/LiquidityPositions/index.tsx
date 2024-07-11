'use client'
import { useMemo, useState, useEffect } from 'react'

import { buildAprRingsMap } from '@/src/library/utils/build-apr-rings-map'

import { useRingsCampaignsBoostedPools, useV2PairsData } from '@/src/state/liquidity/hooks'

import { fromWei } from '@/src/library/utils/numbers'

import { Button, TableSkeleton } from '@/src/components/UI'
import HeaderRow from '@/src/components/Liquidity/Tables/HeaderRow'
import NotFoundLock from '@/src/components/Lock/NotFoundLock'

import { PROPS_CLASSIC_LIQUIDITY } from '@/src/components/Dashboard/types'
import { PoolData } from '@/src/state/liquidity/types'
import { useAccount } from 'wagmi'
import Spinner from '../../Common/Spinner'

const LiquidityPositions = ({ loading, setLoading } : { loading: boolean, setLoading:(loading: boolean) => void }) => {
  const { data: v2PairsData, loading: pairsLoading } = useV2PairsData()
  const { data: ringsList, loading: ringsLoading } = useRingsCampaignsBoostedPools()
  const { address } = useAccount()
  // const [loading, setLoading] = useState(false)
  const aprRingsMap = useMemo(() => (ringsLoading ? null : buildAprRingsMap(ringsList)), [ringsLoading, ringsList])
  const poolsDataClassic = useMemo(
    () =>
      (v2PairsData || [])
        .filter((pool) => pool.pairSymbol !== 'Concentrated pool')
        .filter((row) => Number(fromWei(row.pairInformationV2?.account_lp_balance.toString(), 18)) !== 0)
        .map((row) => ({ pairDetails: row })),
    [v2PairsData]
  )
  const poolsDataClassicRing = useMemo<PoolData[]>(
    () =>
      aprRingsMap
        ? poolsDataClassic.map((pool) => ({
            ...pool,
            ...(pool.pairDetails?.pairSymbol
              ? {
                  pairDetails: {
                    ...pool.pairDetails,
                    maxAPR:
                      +(aprRingsMap[`${pool.pairDetails.id}`.toLowerCase()] ?? 0) +
                      +(isNaN(pool.pairDetails.apr) ? 0 : pool.pairDetails.apr ?? 0),
                  },
                }
              : {}),
          }))
        : poolsDataClassic,
    [poolsDataClassic, aprRingsMap]
  )

  useEffect(() => {
    console.log('pairsLoading :>> ', pairsLoading);
    console.log('ringsLoading :>> ', ringsLoading);
    setLoading(pairsLoading || ringsLoading)
  }, [pairsLoading, ringsLoading])

  const renderContent = () => {
    if (loading && address) {
      return (
        <div className="flex flex-col  gap-3 w-full mb-10 mt-10 mx-auto items-center">
          <div className="text-white flex justify-start w-full max-w-[1127px]">
            <p className="flex justify-start text-lg ms-2 w-full">Classic Liquidity Positions</p>
          </div>

          <div className="box-referrals-short p-6 flex gap-8 justify-center ">
            <div className="relative z-50">
              <p className="text-white text-sm flex items-center gap-3">
                <Spinner /> Loading
              </p>
            </div>
          </div>
        </div>
      )
    }

    if (poolsDataClassicRing.length > 0 && address) {
      return (
        <>
          <div className="flex flex-col ">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white font-normal text-lg">Classic liquidity positions</h2>
              <Button variant="tertiary" className="!py-3 xl:me-5 !text-xs !lg:text-sm" href="/liquidity">
                <span className="icon-logout"></span>New deposit
              </Button>
            </div>
          </div>
          <div className={`${poolsDataClassicRing.length > 0 ? 'dashboard-box' : 'box-dashboard'}`}>
            <div className="rounded-lg z-10">
              <HeaderRow {...PROPS_CLASSIC_LIQUIDITY} poolData={poolsDataClassicRing} />
            </div>
          </div>
        </>
      )
    }

    if ((poolsDataClassicRing.length === 0 && !loading) || !address) {
      return (
        <div className="bg-shark-400 bg-opacity-40 p-6 rounded-xl">
          <NotFoundLock info={'No Positions Found.'} />
        </div>
      )
    }
  }

  return (
    <>
      <div className="mb-10 flex flex-col">{renderContent()}</div>
    </>
  )
}

export default LiquidityPositions
