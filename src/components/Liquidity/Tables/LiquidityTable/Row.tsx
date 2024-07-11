/* eslint-disable max-len */
'use client'

import { Button, TableCell, TableRow } from '@/src/components/UI'
import { BasicPool, GammaVault, PoolData, v3PoolData } from '@/src/state/liquidity/types'
import Image from 'next/image'
import MobileRow from './MobileRowNew'
import { useEffect, useState, useRef } from 'react'
import { formatAmount, formatCurrency, formatDollarAmount, formatPrice, toBN } from '@/src/library/utils/numbers'
import { totalCampaigns, Campaign } from '@/src/library/utils/campaigns'
import { useWindowSize, useHover } from 'usehooks-ts'
import { useIchiVault } from '@/src/library/hooks/web3/useIchi'
import { useQuery } from '@tanstack/react-query'
import { SupportedDex, VaultApr, getLpApr } from '@ichidao/ichi-vaults-sdk'
import { getWeb3Provider } from '@/src/library/utils/web3'
import { ichiVaults } from '../../Deposit/Panel/Concentrated/Automatic/ichiVaults'
import Loader from '@/src/components/UI/Icons/Loader'
import { useRingsPoolApr } from '@/src/library/hooks/rings/useRingsPoolApr'
import { adjustTokenOrder } from '@/src/library/utils/tokens'
import useFDAOEmissionsAPR from '@/src/library/hooks/web3/useFDAOEmisionsAPR'
import { useGammaVaults } from '@/src/state/liquidity/hooks'
import TokenListItem from '@/src/library/types/token-list-item';

interface RowDataProps {
  row: BasicPool
  tokensData: Promise<TokenListItem[]> | null
  titleHeader?: string
  titleHeader2?: string
  titleButton?: string
  titleButton2?: string
  activeRange?: boolean
}

const RowData = ({
  row,
  tokensData,
  titleButton2,
  titleButton,
  titleHeader,
  titleHeader2,
  activeRange,
}: RowDataProps) => {
  const { width } = useWindowSize()

  const hoverRef = useRef(null)
  const isHover = useHover(hoverRef)

  const [openInfo, setOpenInfo] = useState<boolean>(false)
  const [openTooltipGold, setOpenTooltipGold] = useState<boolean>(false)
  const [openTooltipEigenLayer, setOpenTooltipEigenLayer] = useState<boolean>(false)
  const [openTooltipKelpMiles, setOpenTooltipKelpMiles] = useState<boolean>(false)
  const [openTooltipTurtleClub, setOpenTooltipTurtleClub] = useState<boolean>(false)
  const [openTooltipFXS, setOpenTooltipFXS] = useState<boolean>(false)
  const [openTooltipEtherFi, setOpenTooltipEtherFi] = useState<boolean>(false)
  const [campaign, setCampaign] = useState<Campaign>()

  const aprIchi = useIchiVault(row.token0.id, row.token1.id)
  let aprdisplayIchi
  if (aprIchi && aprIchi?.length > 0 && aprIchi[0]) {
    if (aprIchi[0].hasOwnProperty('apr')) aprdisplayIchi = aprIchi[0]?.apr[1]?.apr?.toFixed(0)
  }
  const { data: ichiApr, isLoading: ichiAprLoading } = useQuery({
    queryKey: ['ichiApr', row?.id],
    staleTime: 1000 * 60 * 20,
    queryFn: async () => {
      const allIchiVaults = ichiVaults.filter((vault) => {
        return vault?.pool?.toLowerCase() === row?.id?.toLowerCase()
      })
      if (ichiVaults.length === 0) return 0
      const reducer = await Promise.all(
        allIchiVaults.map(async (vault) => {
          const response = await getLpApr(vault?.id, getWeb3Provider(), SupportedDex.Fenix, [7])
          return response[0]?.apr || 0
        })
      )
      const totalApr = reducer.reduce((acc, curr) => acc + curr, 0)
      const averageApr = totalApr / reducer.length // Se calcula la media dividiendo la suma total por la cantidad de APRs
      return isNaN(averageApr) ? 0 : averageApr
    },
  })

  const { data: ringsApr, isLoading: rignsAprLoading } = useRingsPoolApr(row)

  useEffect(() => {
    const campaign_ = totalCampaigns.find((add) => add.pairAddress.toLowerCase() === row.id.toLowerCase())
    if (campaign_) {
      setCampaign({ ...campaign_ })
    }
  }, [row])

  function getAverageApr(...aprs: number[]): string {
    const values = aprs.filter((apr) => apr !== 0)
    const sum = values.reduce((acc, curr) => acc + curr, 0)
    const average = sum / values.length
    return formatAmount(average.toString(), 2)
  }
  //
  const [adjustToken0, adjustToken1] = adjustTokenOrder(row.token0.symbol, row.token1.symbol)
  const fDAOEmisionsAPR = useFDAOEmissionsAPR(row)
  const { loading: gammaVaultsLoading, data: gammaVaults } = useGammaVaults()
  const gammaVaultApr =
    gammaVaults?.find((vault: GammaVault) => vault?.poolAddress?.toLowerCase() === row?.id?.toLowerCase())?.returns
      ?.weekly?.feeApr || null

  // console.log('row >> ', row)

  return (
    <>
      <TableRow className="hidden lg:flex">
        <TableCell className={`${activeRange ? 'w-[20%]' : 'w-[20%]'}`}>
          <div
            className={`flex justify-center items-center gap-2 ${totalCampaigns.find((add) => add.pairAddress.toLowerCase() == row.id.toLowerCase())?.multiplier ? '' : 'mb-[28px]'}`}
          >
            <div
              className={`flex items-center w-[40px] ${totalCampaigns.find((add) => add.pairAddress.toLowerCase() == row.id.toLowerCase())?.multiplier ? '' : 'mt-[28px]'}`}
            >
              <Image
                src={`/static/images/tokens/${adjustToken0}.svg`}
                alt="token"
                className="rounded-full w-7 h-7 hover:z-20 z-10 transition-all hover:scale-[1.10]"
                width={20}
                height={20}
              />
              <Image
                src={`/static/images/tokens/${adjustToken1}.svg`}
                alt="token"
                className="-ml-[0.9rem] rounded-full w-7 h-7 hover:z-20 transition-all hover:scale-[1.10]"
                width={20}
                height={20}
              />
            </div>
            <div className="flex flex-col gap-1">
              <h5 className={`text-xs text-white h-[26px] flex items-center`}>
                <div>
                  {adjustToken0} / {adjustToken1}
                </div>
              </h5>
              <div className="flex items-center gap-1 h-[26px]">
                {row.poolType === 'concentrated' && (
                  <span className="py-1 px-2  text-xs button-primary rounded-lg">Concentrated</span>
                )}
                {row.poolType === 'volatile' ? (
                  <span className="py-1 px-2  text-xs button-tertiary rounded-lg">Volatile</span>
                ) : row.poolType === 'stable' ? (
                  <span className="py-1 px-2  text-xs button-tertiary rounded-lg">Stable</span>
                ) : null}
                <span className="!py-1 px-3  text-xs text-white border border-solid bg-shark-400 hover:bg-button-primary cursor-default rounded-lg bg-opacity-40 border-shark-300">
                  {/* FEES */}
                  {formatAmount(toBN(row.fee).div(10000), 3)}%
                </span>
              </div>
              <span
                className={`!py-1 h-[26px] px-3  text-xs text-white border border-solid bg-shark-400 hover:bg-button-primary cursor-default rounded-lg bg-opacity-40 border-shark-300 flex justify-center ${totalCampaigns.find((add) => add.pairAddress.toLowerCase() == row.id.toLowerCase())?.multiplier ? 'block' : 'hidden'}`}
              >
                {totalCampaigns.find((add) => add.pairAddress.toLowerCase() == row.id.toLowerCase())?.multiplier}
                {/* <p className="text-xs">TVL {formatDollarAmount(Number(row.totalValueLockedUSD))}</p> */}
              </span>
            </div>
          </div>
        </TableCell>
        <TableCell className={`${activeRange ? 'w-[8%]' : 'w-[15%]'} flex justify-end items-center`}>
          <div className="flex  justify-center items-center gap-2 ">
            {
              <span ref={hoverRef} className="flex gap-2">
                <span ref={hoverRef} className={`flex items-center relative ${openTooltipGold || openTooltipEigenLayer || openTooltipKelpMiles || openTooltipTurtleClub || openTooltipFXS || openTooltipEtherFi ? 'z-[100]' : 'z-0'}`}>
                  {totalCampaigns.find((add) => add.pairAddress.toLowerCase() == row.id.toLowerCase()) && (
                    <div className="relative flex items-center">
                      {campaign?.pointStack?.map((stack, index) => (
                        <Image
                          key={index}
                          src={`/static/images/point-stack/${stack}.svg`}
                          alt="token"
                          className={`${stack === 'blast-gold' && 'rounded-full shadow-yellow-glow motion-safe:animate-notification'} ${openTooltipGold || openTooltipEigenLayer || openTooltipKelpMiles || openTooltipTurtleClub || openTooltipFXS || openTooltipEtherFi ? 'z-[100]' : 'z-0'}`}
                          width={20}
                          height={20}
                          onMouseEnter={() => {
                            if (stack === 'blast-gold') {
                              setOpenTooltipGold(true)
                            }
                            if (stack === 'eigen-layer') {
                              setOpenTooltipEigenLayer(true)
                            }
                            if (stack === 'kelp-miles') {
                              setOpenTooltipKelpMiles(true)
                            }
                            if (stack === 'turtle-club') {
                              setOpenTooltipTurtleClub(true)
                            }
                            if (stack === 'fxs') {
                              setOpenTooltipFXS(true)
                            }
                            if (stack === 'ether-fi') {
                              setOpenTooltipEtherFi(true)
                            }
                          }}
                          onMouseLeave={() => {
                            if (openTooltipGold) {
                              setOpenTooltipGold(false)
                            }
                            if (openTooltipEigenLayer) {
                              setOpenTooltipEigenLayer(false)
                            }
                            if (openTooltipKelpMiles) {
                              setOpenTooltipKelpMiles(false)
                            }
                            if (openTooltipTurtleClub) {
                              setOpenTooltipTurtleClub(false)
                            }
                            if (openTooltipFXS) {
                              setOpenTooltipFXS(false)
                            }
                            if (openTooltipEtherFi) {
                              setOpenTooltipEtherFi(false)
                            }
                          }}
                        />
                      ))}
                      {openTooltipGold && (
                        <div className="absolute left-[-25px] xl:left-auto max-xl:top-[5px] xl:top-0 z-50">
                          <div className="relative z-[1000] bg-shark-950 rounded-lg border border-shark-300 w-[150px] xl:w-[200px] top-9 px-5 py-3 left-0 xl:-left-12 gap-y-1">
                            <p className="text-xs">
                              This pool will receive {campaign?.blastGoldAmount} of Blast Gold till the 25th June
                            </p>
                          </div>
                        </div>
                      )}
                      {openTooltipEigenLayer && (
                        <div className="absolute left-[-25px] xl:left-auto max-xl:top-[5px] xl:top-0 z-50">
                          <div className="relative z-[1000] bg-shark-950 rounded-lg border border-shark-300 w-[150px] xl:w-[200px] top-9 px-5 py-3 left-0 xl:-left-12 gap-y-1">
                            <p className="text-xs">
                              Earn Eigenlayer points from this pool
                            </p>
                          </div>
                        </div>
                      )}
                      {openTooltipKelpMiles && (
                        <div className="absolute left-[-25px] xl:left-auto max-xl:top-[5px] xl:top-0 z-50">
                          <div className="relative z-[1000] bg-shark-950 rounded-lg border border-shark-300 w-[150px] xl:w-[200px] top-9 px-5 py-3 left-0 xl:-left-12 gap-y-1">
                            <p className="text-xs">Earn 1x Kelp Miles from this pool</p>
                          </div>
                        </div>
                      )}
                      {openTooltipFXS && (
                        <div className="absolute left-[-25px] xl:left-auto max-xl:top-[5px] xl:top-0 z-50">
                          <div className="relative z-[1000] bg-shark-950 rounded-lg border border-shark-300 w-[150px] xl:w-[200px] top-9 px-5 py-3 left-0 xl:-left-12 gap-y-1">
                            <p className="text-xs">
                              sfrxETH & sFRAX is getting $500 USD each in FXS tokens from 20th to 27th
                            </p>
                          </div>
                        </div>
                      )}
                      {openTooltipTurtleClub && (
                        <div className="absolute left-[-25px] xl:left-auto max-xl:top-[5px] xl:top-0 z-50">
                          <div className="relative z-[1000] bg-shark-950 rounded-lg border border-shark-300 w-[150px] xl:w-[200px] top-9 px-5 py-3 left-0 xl:-left-12 gap-y-1">
                            <p className="text-xs">
                              Deposit liquidity to receive a 25% Turtle Points boost from Fenix Rings earned
                            </p>
                          </div>
                        </div>
                      )}
                      {openTooltipFXS && (
                        <div className="absolute left-[-25px] xl:left-auto max-xl:top-[5px] xl:top-0 z-50">
                          <div className="relative z-[1000] bg-shark-950 rounded-lg border border-shark-300 w-[150px] xl:w-[200px] top-9 px-5 py-3 left-0 xl:-left-12 gap-y-1">
                            <p className="text-xs">
                              This pool is getting $500 worth of $FXS tokens from the 20th to the 26th
                            </p>
                          </div>
                        </div>
                      )}
                      {openTooltipEtherFi && (
                        <div className="absolute left-[-25px] xl:left-auto max-xl:top-[5px] xl:top-0 z-50">
                          <div className="relative z-[1000] bg-shark-950 rounded-lg border border-shark-300 w-[150px] xl:w-[200px] top-9 px-5 py-3 left-0 xl:-left-12 gap-y-1">
                            <p className="text-xs">
                              Earn 2x EtherFi points from this pool
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </span>
              </span>
            }
          </div>
        </TableCell>
        <TableCell className={`${activeRange ? 'w-[8%]' : 'w-[13%]'} flex justify-end items-center`}>
          <div className="relative flex justify-center items-center gap-2 ">
            <p className="px-2 py-2 text-xs whitespace-nowrap text-white border border-solid bg-shark-400 rounded-xl bg-opacity-40 border-1 border-shark-300">
              {/* TVL */}
              {formatDollarAmount(Number(row.totalValueLockedUSD)).replace('NaN', '0')}
            </p>
          </div>
        </TableCell>
        <TableCell className={`${activeRange ? 'w-[8%]' : 'w-[13%]'} flex justify-end items-center`}>
          <div className="relative flex justify-center items-center gap-2 ">
            <p className="px-2 py-2 text-xs whitespace-nowrap text-white border border-solid bg-shark-400 rounded-xl bg-opacity-40 border-1 border-shark-300">
              {/* APR */}
              {rignsAprLoading ? (
                <Loader />
              ) : (
                <>
                  {formatAmount((Number(row?.apr) || 0) + fDAOEmisionsAPR + (Number(ringsApr) || 0), 2)}%{' '}
                  <span
                    className="icon-info"
                    onMouseEnter={() => setOpenInfo(true)}
                    onMouseLeave={() => setOpenInfo(false)}
                  ></span>
                </>
              )}
            </p>
            {openInfo && (
              <div className="absolute z-10 bg-shark-950 rounded-lg border border-shark-300 w-auto lg:w-[200px] top-9 px-5 py-3 transform left-1/2 -translate-x-1/2 gap-y-1">
                <div className="flex justify-between items-center gap-3">
                  <p className="text-sm">Fees APR</p>
                  <p className="text-sm text-chilean-fire-600">{formatAmount(Number(row?.apr) || 0, 2)}%</p>
                </div>
                {ringsApr !== null && !isNaN(Number(ringsApr)) && Number(ringsApr) !== 0 && (
                  <div className="flex justify-between items-center gap-3">
                    <p className="text-sm">Rings APR</p>
                    <p className="text-sm text-chilean-fire-600">{formatAmount(Number(ringsApr) || 0, 2)}%</p>
                  </div>
                )}
                {ichiAprLoading && (
                  <div className="flex justify-between items-center gap-3">
                    <p className="text-sm">Ichi</p>
                    <Loader />
                  </div>
                )}

                {!ichiAprLoading && ichiApr !== null && !isNaN(Number(ichiApr)) && Number(ichiApr) !== 0 && (
                  <div className="flex justify-between items-center gap-3">
                    <p className="text-sm">Ichi Strategy</p>
                    <p className="text-sm text-chilean-fire-600">
                      {formatAmount(Number(ichiApr) < 0 ? 0 : Number(ichiApr) || 0, 2)}%
                    </p>
                  </div>
                )}
                {!!fDAOEmisionsAPR && (
                  <div className="flex justify-between items-center gap-3">
                    <p className="text-sm">fDAO Emissions</p>
                    <p className="text-sm text-chilean-fire-600">{formatAmount(Number(fDAOEmisionsAPR), 2)}%</p>
                  </div>
                )}
                {gammaVaultApr && (
                  <div className="flex justify-between items-center gap-3">
                    <p className="text-sm">Gamma</p>
                    <p className="text-sm text-chilean-fire-600">
                      {formatAmount(gammaVaultApr < 0 || isNaN(gammaVaultApr) ? 0 : Number(gammaVaultApr), 2)}%
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </TableCell>

        <TableCell className="w-[13%]">
          <div className="flex flex-col items-end justify-center w-full px-3">
            {/* VOLUME */}
            <p className="mb-1 text-xs text-white">{formatDollarAmount(Number(row.volumeUSD)).replace('NaN', '0')}</p>
            <div className="flex flex-col gap-1">
              <p className="flex items-center justify-end text-right gap-2 font-normal text-xs text-shark-100 ">
                {/* <Image
                  src={`/static/images/tokens/${row.token0.symbol}.svg`}
                  alt="token"
                  className="w-5 h-5 rounded-full"
                  width={20}
                  height={20}
                /> */}
                {formatCurrency(Number(row.volumeToken0) / 2, 2)} {row.token0.symbol}
              </p>
              <p className="flex items-center justify-end text-right gap-2 text-xs text-shark-100 font-normal ">
                {/* <Image
                  src={`/static/images/tokens/${row.token1.symbol}.svg`}
                  alt="token"
                  className="w-5 h-5 rounded-full"
                  width={20}
                  height={20}
                /> */}
                {formatCurrency(Number(row.volumeToken1) / 2, 2)} {row.token1.symbol}
              </p>
            </div>
          </div>
        </TableCell>

        <TableCell className="w-[13%]">
          <div className="flex flex-col items-end justify-center w-full px-3">
            {/* FEES */}
            <p className="mb-1 text-xs text-white">{formatDollarAmount(row.feesUSD).replace('NaN', '0')}</p>
            <div className="flex flex-col  gap-1">
              <p className="flex  items-center justify-end text-right gap-2 text-xs text-shark-100">
                {/* <Image
                  src={`/static/images/tokens/${row.token0.symbol}.svg`}
                  alt="token"
                  className="w-5 h-5 rounded-full"
                  width={20}
                  height={20}
                /> */}
                {formatCurrency(toBN(row.feesToken0), 2)} {row.token0.symbol}
              </p>
              <p className="flex items-center justify-end text-right gap-2 text-xs text-shark-100">
                {/* <Image
                  src={`/static/images/tokens/${row.token1.symbol}.svg`}
                  alt="token"
                  className="w-5 h-5 rounded-full"
                  width={20}
                  height={20}
                /> */}
                {formatCurrency(toBN(row.feesToken1), 2)} {row.token1.symbol}
              </p>
            </div>
          </div>
        </TableCell>

        <TableCell className="flex  items-center justify-end w-[13%]">
          <div className="flex gap-2 w-full justify-end">
            {titleButton === '' ? (
              <></>
            ) : (
              <Button variant="tertiary" className="flex items-center gap-2 w-24 h-9 !text-xs">
                <span className="icon-coin"></span>
                Claim
              </Button>
            )}

            {titleButton2 === '' ? (
              <Button
                variant="tertiary"
                className="flex items-center gap-2  w-24 h-9 !text-xs"
                href={
                  row.poolType === 'concentrated'
                    ? `/liquidity/deposit?type=CONCENTRATED_MANUAL&token0=${row.token0.id}&token1=${row.token1.id}`
                    : row.poolType === 'volatile'
                      ? `/liquidity/deposit?type=VOLATILE&token0=${row.token0.id}&token1=${row.token1.id}`
                      : `/liquidity/deposit?type=STABLE&token0=${row.token0.id}&token1=${row.token1.id}`
                }
              >
                <span className="icon-circles"></span>
                Deposit
              </Button>
            ) : (
              <Button
                variant="tertiary"
                className="flex items-center gap-2 w-24 h-9 !text-xs "
                href="/liquidity/deposit"
              >
                <span className="icon-logout"></span>
                Manage
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>
      <MobileRow
        row={row}
        titleHeader={titleHeader}
        titleButton={titleButton}
        titleButton2={titleButton2}
        titleHeader2={titleHeader2}
        activeRange={activeRange}
      />
    </>
  )
}

export default RowData
