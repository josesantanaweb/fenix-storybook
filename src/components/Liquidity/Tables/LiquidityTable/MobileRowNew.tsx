/* eslint-disable max-len */
import { Button } from '@/src/components/UI'
import Loader from '@/src/components/UI/Icons/Loader'
import { useIchiVault } from '@/src/library/hooks/web3/useIchi'
import { totalCampaigns, Campaign } from '@/src/library/utils/campaigns'
import { formatAmount, formatCurrency, formatDollarAmount, toBN } from '@/src/library/utils/numbers'
import { BasicPool, GammaVault, PoolData } from '@/src/state/liquidity/types'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { ichiVaults } from '../../Deposit/Panel/Concentrated/Automatic/ichiVaults'
import { SupportedDex, getLpApr } from '@ichidao/ichi-vaults-sdk'
import { getWeb3Provider } from '@/src/library/utils/web3'
import { useRingsPoolApr } from '@/src/library/hooks/rings/useRingsPoolApr'
import { adjustTokenOrder } from '@/src/library/utils/tokens'
import useFDAOEmissionsAPR from '@/src/library/hooks/web3/useFDAOEmisionsAPR'
import { useGammaVaults } from '@/src/state/liquidity/hooks'

interface RowDataProps {
  row: BasicPool
  titleHeader?: string
  titleHeader2?: string
  titleButton?: string
  titleButton2?: string
  activeRange?: boolean
}

export default function MobileRowNew({
  row,
  titleHeader,
  titleHeader2,
  titleButton,
  titleButton2,
  activeRange,
}: RowDataProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [openInfo, setOpenInfo] = useState<boolean>(false)
  const [campaign, setCampaign] = useState<Campaign>()
  const [openTooltipGold, setOpenTooltipGold] = useState<boolean>(false)
  const [openTooltipFXS, setopenTooltipFXS] = useState<boolean>(false)

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
  const { loading: gammaVaultsLoading, data: gammaVaults } = useGammaVaults()
  const gammaVaultApr =
    gammaVaults?.find((vault: GammaVault) => vault?.poolAddress?.toLowerCase() === row?.id?.toLowerCase())?.returns
      ?.weekly?.feeApr || null
  const [adjustToken0, adjustToken1] = adjustTokenOrder(row.token0.symbol, row.token1.symbol)
  const fDAOEmisionsAPR = useFDAOEmissionsAPR(row)

  return (
    <>
      <div className={`border border-shark-950 px-3 py-2 rounded-[10px] bg-shark-400 bg-opacity-60 ${'lg:hidden'}`}>
        <div className="flex gap-[9px] items-center justify-around pb-2">
          <div className="relative flex items-center">
            <Image
              src={`/static/images/tokens/${adjustToken0}.svg`}
              alt="token"
              className="w-10 h-10 max-xxs:w-8 max-xxs:h-8 -mr-5 rounded-full"
              width={32}
              height={32}
            />
            <Image
              src={`/static/images/tokens/${adjustToken1}.svg`}
              alt="token"
              className="w-10 h-10 max-xxs:w-8 max-xxs:h-8 rounded-full"
              width={32}
              height={32}
            />
          </div>
          <div className="flex flex-col gap-1 w-[85%]">
            <div className="flex items-center gap-2 justify-between">
              <h5 className="text-sm font-semibold leading-normal mx-auto">
                {adjustToken0} / {adjustToken1}{' '}
              </h5>
              <div
                className={`border-solid bg-shark-400 rounded-lg bg-opacity-40 border-shark-300 text-xs font-normal border whitespace-nowrap !py-2 !h-[38px] w-[44.7%] text-center px-4 ${totalCampaigns.find((add) => add.pairAddress.toLowerCase() == row.id.toLowerCase())?.multiplier ? 'block' : 'hidden'}`}
              >
                {totalCampaigns.find((add) => add.pairAddress.toLowerCase() == row.id.toLowerCase())?.multiplier}
              </div>
            </div>
            <div className="flex items-center gap-2 w-[100%]">
              <span className="text-white py-2 px-6 text-xs rounded-lg flex justify-center button-primary w-[54.7%]">
                Concentrated
              </span>
              <div className="flex items-center gap-2 max-xs:gap-1 w-[45.3%]">
                <span className="!py-2 !h-[38px] px-4 text-xs font-400 w-[59.7%] text-white text-center border border-solid bg-shark-400 rounded-lg bg-opacity-40 border-shark-300">
                  {formatAmount(toBN(row.fee).div(10000), 3)}%
                </span>
                <Button
                  variant="tertiary"
                  className="!h-[38px] !text-xs border !border-shark-300 !rounded-lg w-[39.7%] !bg-shark-400 !bg-opacity-40 !px-4"
                >
                  <span className="icon-info text-lg"></span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        {activeRange && (
          <div className="flex justify-between border mt-[21px] items-center  mb-2.5 border-shark-300 p-4 rounded-lg">
            <h1 className="text-xs">Range</h1>
            <div className={`flex items-center justify-center`}>
              <div className="flex gap-2 items-center">
                <span className="bg-green-600 w-4 h-4 rounded-full border-4 border-black"></span>
                <div className="text-xs flex flex-col">
                  <p className="text-shark-100 text-xs">Min Price</p>
                  <span className="p-2  text-white border border-solid bg-shark-400 rounded-xl bg-opacity-40 border-1 border-shark-300 text-xs">
                    $0.00
                  </span>
                </div>
                <div className="text-xs flex flex-col">
                  <p className="text-shark-100 text-xs">Max Price</p>
                  <span className="p-2 text-xs text-white border border-solid bg-shark-400 rounded-xl bg-opacity-40 border-1 border-shark-300">
                    $0.00
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col gap-1  mb-2.5">
          <div className="flex items-center justify-between">
            <div
              className={`flex flex-col items-center ${campaign?.pointStack !== undefined && campaign?.pointStack?.length > 0 ? 'w-[25%]' : 'w-[40%]'} h-[70px] justify-between border border-shark-300 p-4 rounded-lg`}
            >
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium leading-normal">APR</span>
              </div>
              <div className=" relative flex gap-[7px]">
                <div className="ml-auto text-xs leading-normal flex gap-x-1">
                  {' '}
                  {rignsAprLoading ? (
                    <Loader />
                  ) : (
                    <>
                      {formatAmount((Number(row?.apr) || 0) + fDAOEmisionsAPR + (Number(ringsApr) || 0), 2)}%{' '}
                      <div
                        className="flex items-center gap-[5px] cursor-pointer
                    text-shark-100 hover:text-transparent hover:bg-gradient-to-r hover:from-outrageous-orange-500 hover:to-festival-500 hover:bg-clip-text"
                      >
                        <span
                          className="icon-info"
                          onMouseEnter={() => setOpenInfo(true)}
                          onMouseLeave={() => setOpenInfo(false)}
                        ></span>
                      </div>
                    </>
                  )}
                </div>

                {openInfo && (
                  <div className="absolute z-10 bg-shark-950 rounded-lg border border-shark-300 w-auto xl:w-[250px] top-9 px-5 py-3 left-0 xl:-left-12 gap-y-">
                    <div className="flex justify-between items-center gap-3">
                      <p className="text-sm">Fees APR</p>
                      <p className="text-sm text-chilean-fire-600">{formatAmount(Number(row?.apr) || 0, 2)}%</p>
                    </div>
                    {ringsApr !== null && !isNaN(Number(ringsApr)) && Number(ringsApr) !== 0 && (
                      <div className="flex justify-between items-center gap-3">
                        <p className="text-sm">Fenix Rings APR</p>
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
                        <p className="text-sm">Ichi</p>
                        <p className="text-sm text-chilean-fire-600">
                          {formatAmount(Number(ichiApr) < 0 ? 0 : Number(ichiApr) || 0, 2)}%
                        </p>
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
                    {!!fDAOEmisionsAPR && (
                      <div className="flex justify-between items-center gap-3">
                        <p className="text-sm">fDAO Emissions</p>
                        <p className="text-sm text-chilean-fire-600">{formatAmount(Number(fDAOEmisionsAPR), 2)}%</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div
              className={`flex flex-col items-center w-[34%] justify-between border border-shark-300 h-[70px] p-3 rounded-lg ${campaign?.pointStack !== undefined && campaign?.pointStack?.length > 0 ? 'block' : 'hidden'}`}
            >
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium leading-normal">Point Stack</span>
              </div>
              <div
                className={`flex justify-center items-center gap-2 ${totalCampaigns.find((add) => add.pairAddress.toLowerCase() == row.id.toLowerCase()) ? 'block' : 'hidden'}`}
              >
                <span className="flex flex-row justify-center gap-2">
                  {totalCampaigns.find((add) => add.pairAddress.toLowerCase() == row.id.toLowerCase()) && (
                    <>
                      {campaign?.pointStack?.map((stack, index) => (
                        <Image
                          key={index}
                          src={`/static/images/point-stack/${stack}.svg`}
                          alt="token"
                          className={`${stack === 'blast-gold' && 'rounded-full shadow-yellow-glow notification'}`}
                          width={20}
                          height={20}
                          onMouseEnter={() => {
                            if (openTooltipGold) {
                              setOpenTooltipGold(false)
                            }
                            if (openTooltipFXS) {
                              setopenTooltipFXS(false)
                            }
                          }}
                          onMouseLeave={() => setOpenTooltipGold(false)}
                        />
                      ))}
                    </>
                  )}
                  {openTooltipGold && (
                    <div className="absolute z-10 bg-shark-950 rounded-lg border border-shark-300 w-auto xl:w-[200px] top-9 px-5 py-3 left-0 xl:-left-12 gap-y-1">
                      <div className="flex justify-between items-center gap-3">
                        <p className="text-xs">This pool will receive 50.000 Blast Gold from 13th - 25th of June</p>
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
                </span>
              </div>
            </div>
            <div
              className={`flex flex-col items-center ${campaign?.pointStack !== undefined && campaign?.pointStack?.length > 0 ? 'w-[39%]' : 'w-[59%]'} h-[70px] justify-between border  border-shark-300 p-4 rounded-lg`}
            >
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium leading-normal">TVL</span>
              </div>
              <div className="flex flex-col">
                <div className="ml-auto text-xs leading-normal">
                  {/* TVL AQUI */}
                  {formatDollarAmount(Number(row.totalValueLockedUSD))}
                </div>
                <div className="flex gap-2.5 text-shark-100">
                  <div className="flex items-center gap-[5px]"></div>
                  <div className="flex items-center gap-[5px]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center w-[49.5%] justify-between border border-shark-300 p-4 rounded-lg">
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium leading-normal">
                  {titleHeader?.length === 0 ? 'Volume' : titleHeader}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-xs leading-normal">{formatDollarAmount(Number(row.volumeUSD))}</div>
                <div className="flex xs:gap-2.5 text-shark-100 max-xs:flex-col">
                  <div className="flex items-center gap-[5px]">
                    <Image
                      src={`/static/images/tokens/${row.token0.symbol}.svg`}
                      alt="token"
                      className="w-2.5 h-2.5 rounded-full"
                      width={10}
                      height={10}
                    />
                    <span className="text-xs leading-normal">
                      {formatCurrency(Number(row.volumeToken0) / 2, 2)} {row.token0.symbol}{' '}
                    </span>
                  </div>
                  <div className="flex items-center gap-[5px]">
                    <Image
                      src={`/static/images/tokens/${row.token1.symbol}.svg`}
                      alt="token"
                      className="w-2.5 h-2.5 rounded-full"
                      width={10}
                      height={10}
                    />
                    <span className="text-xs leading-normal">
                      {formatCurrency(Number(row.volumeToken1) / 2, 2)} {row.token1.symbol}{' '}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center w-[49.5%] justify-between border border-shark-300 p-4 rounded-lg">
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium leading-normal">
                  {titleHeader2 === '' ? 'Fees' : titleHeader2}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-xs leading-normal">{formatDollarAmount(row.feesUSD)}</div>
                <div className="flex xs:gap-2.5 text-shark-100 max-xs:flex-col">
                  <div className="flex items-center gap-[5px]">
                    <Image
                      src={`/static/images/tokens/${row.token0.symbol}.svg`}
                      alt="token"
                      className="w-2.5 h-2.5 rounded-full"
                      width={10}
                      height={10}
                    />
                    <span className="text-xs leading-normal">
                      {formatCurrency(toBN(row.feesToken0), 2)} {row.token0.symbol}
                    </span>
                  </div>
                  <div className="flex items-center gap-[5px]">
                    <Image
                      src={`/static/images/tokens/${row.token1.symbol}.svg`}
                      alt="token"
                      className="w-2.5 h-2.5 rounded-full"
                      width={10}
                      height={10}
                    />
                    <span className="text-xs leading-normal">
                      {' '}
                      {formatCurrency(toBN(row.feesToken1), 2)} {row.token1.symbol}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-center">
            {titleButton2 === '' ? (
              <Button
                variant="tertiary"
                className="flex items-center gap-2 w-full"
                href={`/liquidity/deposit?type=CONCENTRATED_MANUAL&token0=${row.token0.id}&token1=${row.token1.id}`}
              >
                <span className="icon-circles"></span>
                Deposit
              </Button>
            ) : (
              <Button variant="tertiary" className="flex items-center gap-2 w-full" href="/liquidity/deposit">
                <span className="icon-logout"></span>
                Manage
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
