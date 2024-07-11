/* eslint-disable max-len */
/* eslint-disable react/no-multi-comp */
import Image from 'next/image'
import { Button, Pagination, PaginationMobile, TableBody, TableCell, TableHead, TableRow } from '../../UI'
import { positions } from '../MyStrategies/Strategy'
import NoPositionFound from './NoPositionFound'
import { useEffect, useMemo, useState, useRef } from 'react'
import { formatAmount, formatCurrency, formatDollarAmount, toBN } from '@/src/library/utils/numbers'
import { IchiVault, useIchiVaultsData } from '@/src/library/hooks/web3/useIchi'
import { NotificationDuration, NotificationType } from '@/src/state/notifications/types'
import { Address, encodeFunctionData, zeroAddress } from 'viem'
import { useAccount, useWriteContract } from 'wagmi'
import { publicClient } from '@/src/library/constants/viemClient'
import { CL_MANAGER_ABI } from '@/src/library/constants/abi'
import { contractAddressList } from '@/src/library/constants/contactAddresses'
import { useNotificationAdderCallback } from '@/src/state/notifications/hooks'
import { MAX_INT } from '@/src/library/constants/misc'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { setApr } from '@/src/state/apr/reducer'
import { getAlgebraPoolPrice } from '@/src/library/hooks/liquidity/useCL'
import { useQuery } from '@tanstack/react-query'
import Loader from '../../UI/Icons/Loader'
import BoostedPool from '@/src/library/types/pools/boosted-pool'
import extraPoints from '@/src/library/types/pools/extra-points'
import RingCampaignData from '@/src/library/types/pools/ring-campaign-data'
import AprBox from '../../UI/Pools/AprBox'
import { useRingsCampaigns } from '@/src/state/liquidity/hooks'
import { totalCampaigns, Campaign } from '@/src/library/utils/campaigns'
import { useRingsCampaignsBoostedPools } from '@/src/state/liquidity/hooks'
import TokenListItem from '@/src/library/types/token-list-item'

interface MyPositionsMobileProps {
  activePagination?: boolean
  data: positions[]
  tokens: TokenListItem[]
  ringsCampaign: RingCampaignData
  showDust?: boolean
}

const PositionTableMobile = ({
  activePagination = true,
  data,
  tokens,
  ringsCampaign,
  showDust,
}: MyPositionsMobileProps) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { writeContractAsync } = useWriteContract()
  const { address } = useAccount()
  const addNotification = useNotificationAdderCallback()
  const [itemsPerPage, setItemPerPage] = useState<number>(10)
  const [activePage, setActivePage] = useState<number>(1)
  const [isInRange, setIsInRange] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [openId, setOpenId] = useState<string>('')
  const [tvlPosition, setTvlPosition] = useState<any>([])
  const [nonZeroData, setNonZeroData] = useState<positions[]>([])
  const [isInRangeAll, setIsInRangeAll] = useState<{ [key: string]: boolean }>({})

  const { data: ringsCampaignsData } = useRingsCampaignsBoostedPools()

  function paginate(items: any, currentPage: number, itemsPerPage: number) {
    // Calculate total pages
    const totalPages = Math.ceil(items.length / itemsPerPage)

    // Ensure current page isn't out of range
    currentPage = Math.max(1, Math.min(currentPage, totalPages))

    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    const paginatedItems = items.slice(start, end)

    return paginatedItems
  }

  const TvlTotalValue = (data: any) => {
    const tvl =
      Number(data?.depositedToken0) *
        Number(tokens.find((e) => e.tokenAddress.toLowerCase() === data?.token0?.id.toLowerCase())?.priceUSD) +
      Number(data?.depositedToken1) *
        Number(tokens.find((e) => e.tokenAddress.toLowerCase() === data?.token1?.id.toLowerCase())?.priceUSD)

    tvlPosition[data.id] = tvl
    return tvl
  }

  useEffect(() => {
    setNonZeroData(
      showDust
        ? data
        : data.filter((i) => {
            return Number(tvlPosition[i.id] ? tvlPosition[i.id] : TvlTotalValue(i)) > 0.1
          })
    )
  }, [data, showDust, tvlPosition, tokens])

  const pagination = paginate(nonZeroData, activePage, itemsPerPage)

  type priceClacualtionProps = {
    token0: {
      decimals: string
      id: string
      symbol: string
      __typename?: string
    }
    token1: {
      decimals: string
      id: string
      symbol: string
      __typename?: string
    }
    tickLower: {
      price0: string
      price1: string
    }
    tickUpper: {
      price0: string
      price1: string
    }
    isMobile: boolean
  }
  const PriceCalculation = ({ token0, token1, tickLower, tickUpper, isMobile }: priceClacualtionProps) => {
    let swapPrices
    if ((token0.symbol == 'USDB' && token1.symbol == 'WETH') || (token0.symbol == 'DUSD' && token1.symbol == 'DETH')) {
      swapPrices = true
    }

    const minPrice = swapPrices
      ? parseFloat(tickUpper?.price1) * 10 ** (Number(token1?.decimals) - Number(token0?.decimals))
      : parseFloat(tickLower?.price0) * 10 ** (Number(token0?.decimals) - Number(token1?.decimals))
    const maxPrice = swapPrices
      ? parseFloat(tickLower?.price1) * 10 ** (Number(token1?.decimals) - Number(token0?.decimals))
      : parseFloat(tickUpper?.price0) * 10 ** (Number(token0?.decimals) - Number(token1?.decimals))

    const minPriceIsZero = minPrice < 1e-5
    const maxPriceIsInfinity = maxPrice > 1e12
    return (
      <>
        {isMobile ? (
          <div className="m-2 flex flex-col sm:flex-row gap-2 justify-between items-center">
            <div className="px-2 py-2 text-xs whitespace-nowrap text-white border border-solid bg-shark-400 rounded-xl bg-opacity-40 border-1 border-shark-300">
              {/* Min: {minPriceIsZero ? 0 : formatAmount(minPrice, 6)} {token0.symbol} per {token1.symbol} */}
              Min: {minPriceIsZero ? 0 : formatAmount(minPrice, 6)} - Max:{' '}
              {maxPriceIsInfinity ? '∞' : formatAmount(maxPrice, 6)}
            </div>
          </div>
        ) : (
          <>
            <div className="px-2 py-2 text-xs whitespace-nowrap text-white border border-solid bg-shark-400 rounded-xl bg-opacity-40 border-1 border-shark-300">
              {/* Min: {minPriceIsZero ? 0 : formatAmount(minPrice, 6)} {token0.symbol} per {token1.symbol} */}
              Min: {minPriceIsZero ? 0 : formatAmount(minPrice, 6)} - Max:{' '}
              {maxPriceIsInfinity ? '∞' : formatAmount(maxPrice, 6)}
            </div>
          </>
        )}
      </>
    )
  }

  type setStatusprops = {
    token0: {
      decimals: string
      id: string
      symbol: string
      __typename?: string
    }
    token1: {
      decimals: string
      id: string
      symbol: string
      __typename?: string
    }
    tickLower: {
      price0: string
      price1: string
    }
    tickUpper: {
      price0: string
      price1: string
    }
    liquidity: string
    setIsInRange: any
    id: any
  }
  const SetStatus = ({ token0, token1, tickLower, tickUpper, liquidity, setIsInRange, id }: setStatusprops) => {
    let swapPrices
    if ((token0.symbol == 'USDB' && token1.symbol == 'WETH') || (token0.symbol == 'DUSD' && token1.symbol == 'DETH')) {
      swapPrices = true
    }

    const minPrice = useMemo(() => {
      return parseFloat(tickLower?.price0) * 10 ** (Number(token0?.decimals) - Number(token1?.decimals))
    }, [tickLower, token0?.decimals, token1?.decimals])
    const maxPrice = useMemo(() => {
      return parseFloat(tickUpper?.price0) * 10 ** (Number(token0?.decimals) - Number(token1?.decimals))
    }, [tickUpper, token0?.decimals, token1?.decimals])

    const { data: poolPriceData, isLoading: isPoolPriceDataLoading } = useQuery({
      queryKey: ['algebraPoolPrice', token0?.id, token1?.id],
      staleTime: 1000 * 60 * 30,
      queryFn: async () => {
        const state = await getAlgebraPoolPrice(token0?.id as `0x${string}`, token1?.id as `0x${string}`)
        return state
      },
      enabled: !!token0?.id && !!token1?.id,
    })
    const currentPoolPrice = poolPriceData
      ? Number(poolPriceData?.price / 10 ** Number(token1.decimals)).toFixed(6)
      : '0'
    const isInRangeAux = useMemo(() => {
      return (minPrice < Number(currentPoolPrice) && maxPrice >= Number(currentPoolPrice)) || liquidity === 'ichi'
    }, [minPrice, maxPrice, currentPoolPrice, liquidity])
    useEffect(() => {
      setIsInRangeAll((prevState) => {
        if (prevState[id] !== isInRangeAux) {
          return { ...prevState, [id]: isInRangeAux }
        }
        return prevState
      })
    }, [isInRangeAux, id, setIsInRangeAll])
    if (isPoolPriceDataLoading) {
      return <Loader />
    }

    const minPriceIsZero = minPrice < 1e-5
    const maxPriceIsInfinity = maxPrice > 1e12

    return (
      <div className="flex items-center gap-2 justify-start">
        <div
          className={`relative cursor-default rounded-full w-2 h-2 ${isInRangeAux ? 'bg-sucess-100' : 'bg-error-100'} mr-1`}
          // onMouseOver={() => setIsOverRange(true)}
          // onMouseLeave={() => setIsOverRange(false)}
        >
          {/* <div
            className={`absolute top-[-20px] ${isInRangeAux ? 'right-[-65px]' : 'right-[-90px]'} px-2 py-1 text-white text-xs whitespace-nowrap border bg-shark-400 rounded-lg border-shark-300 ${isOverRange ? 'block' : 'hidden'}`}
          >
            {' '}
            {isInRangeAux ? 'In range' : 'Out of range'}{' '}
          </div> */}
        </div>
        <div className="flex flex-col items-start">
          <div className="text-shark-100 text-xs font-normal">Min Price</div>
          <span className="!py-1 px-4 text-xs text-white whitespace-nowrap border border-solid bg-shark-400 hover:bg-button-primary cursor-default rounded-lg bg-opacity-40 border-shark-300">
            {minPriceIsZero ? 0 : formatAmount(minPrice, 6)}
            {/* {formatCurrency(minPrice, 2)}$ */}
          </span>
        </div>
        <div className="flex flex-col items-start">
          <div className="text-shark-100 text-xs font-normal">Max Price</div>
          <span className="!py-1 px-4 text-xs text-white whitespace-nowrap border border-solid bg-shark-400 hover:bg-button-primary cursor-default rounded-lg bg-opacity-40 border-shark-300">
            {maxPriceIsInfinity ? '∞' : formatAmount(maxPrice, 6)}
            {/* {formatCurrency(maxPrice, 2)}$ */}
          </span>
        </div>
      </div>
    )
  }

  const TvlTotal = ({ data }: any) => {
    return (
      <>
        <p className="text-xs text-white mb-1">
          {tvlPosition[data.id] ? formatDollarAmount(tvlPosition[data.id]) : formatDollarAmount(TvlTotalValue(data))}
        </p>
      </>
    )
  }

  const handleClaim = (id: string) => {
    const multi = [
      encodeFunctionData({
        abi: CL_MANAGER_ABI,
        functionName: 'collect',
        args: [[id, address, MAX_INT, MAX_INT]],
      }),
    ]

    writeContractAsync(
      {
        abi: CL_MANAGER_ABI,
        address: contractAddressList.cl_manager as Address,
        functionName: 'multicall',
        args: [multi],
      },

      {
        onSuccess: async (x) => {
          const transaction = await publicClient.waitForTransactionReceipt({ hash: x })
          if (transaction.status == 'success') {
            // toast(`Fees Claimed successfully.`)
            addNotification({
              id: crypto.randomUUID(),
              createTime: new Date().toISOString(),
              message: `Fees Claimed successfully.`,
              notificationType: NotificationType.SUCCESS,
              txHash: transaction.transactionHash,
              notificationDuration: NotificationDuration.DURATION_5000,
            })
          } else {
            // toast(`Fees Claimed Tx failed`)
            addNotification({
              id: crypto.randomUUID(),
              createTime: new Date().toISOString(),
              message: `Fees Claimed Tx failed`,
              notificationType: NotificationType.ERROR,
              txHash: transaction.transactionHash,
              notificationDuration: NotificationDuration.DURATION_5000,
            })
          }
        },
        onError: (e) => {
          // toast(`Fees Claimed Tx failed.`)
          addNotification({
            id: crypto.randomUUID(),
            createTime: new Date().toISOString(),
            message: `Fees Claimed Tx failed`,
            notificationType: NotificationType.ERROR,
            txHash: '',
            notificationDuration: NotificationDuration.DURATION_5000,
          })
        },
      }
    )
  }
  const ichitokens = useIchiVaultsData(pagination.liquidity === 'ichi' ? pagination?.id : zeroAddress)
  return (
    <>
      {pagination.length > 0 ? (
        <>
          {pagination.map((position: positions) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks

            const fenixRingApr =
              ringsCampaign?.boostedPools.find((pool) => {
                return pool.id.toLowerCase() === position.pool.id.toLowerCase()
              })?.apr || 0

            const extraAprs =
              ringsCampaignsData.find((pool: BoostedPool) => {
                return pool.id.toLowerCase() === position.pool.id.toLowerCase()
              })?.extraPoints || []
            const extraAprNumber = extraAprs.reduce((acc: number, curr: extraPoints) => {
              return acc + curr.apr
            }, 0)
            const campaign = totalCampaigns.find(
              (add) => add.pairAddress.toLowerCase() === position.pool.id.toLowerCase()
            )
            return (
              <>
                <div
                  className={`border border-shark-950 px-3 py-2 rounded-[10px] bg-shark-400 my-2 ${
                    isOpen ? 'bg-opacity-60' : 'bg-opacity-20'
                  } ${'xl:hidden'}`}
                >
                  <div className="flex gap-[9px] items-center">
                    <div className="flex items-center w-full gap-2">
                      {position.liquidity === 'gamma' || position.liquidity === 'ichi' ? (
                        <>
                          <div className="flex items-center w-[40px] max-2xl:w-[50px]">
                            <Image
                              src={
                                position.liquidity === 'gamma'
                                  ? `/static/images/tokens/${tokens.find((e) => e.tokenAddress.toLowerCase() === position.token0.id.toLowerCase())?.basetoken.symbol}.svg`
                                  : `/static/images/tokens/${position?.token0?.symbol}.svg`
                              }
                              alt="token"
                              className="rounded-full w-7 h-7 hover:z-20 z-10 transition-all hover:scale-[1.10]"
                              width={30}
                              height={30}
                            />
                            <Image
                              src={
                                position.liquidity === 'gamma'
                                  ? `/static/images/tokens/${tokens.find((e) => e.tokenAddress.toLowerCase() === position.token1.id.toLowerCase())?.basetoken.symbol}.svg`
                                  : `/static/images/tokens/${position?.token1?.symbol}.svg`
                              }
                              alt="token"
                              className="-ml-4 rounded-full w-7 h-7 hover:z-20 z-10 transition-all hover:scale-[1.10]"
                              width={30}
                              height={30}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center w-[40px] max-2xl:w-[50px]">
                            <Image
                              src={`/static/images/tokens/${position.token0.symbol}.svg`}
                              alt="token"
                              className="rounded-full w-7 h-7 hover:z-20 z-10 transition-all hover:scale-[1.10]"
                              width={30}
                              height={30}
                            />
                            <Image
                              src={`/static/images/tokens/${position.token1.symbol}.svg`}
                              alt="token"
                              className="-ml-4 rounded-full w-7 h-7 hover:z-20 z-10 transition-all hover:scale-[1.10]"
                              width={30}
                              height={30}
                            />
                          </div>
                        </>
                      )}

                      <div className="flex max-xs:flex-col  flex-wrap xs:items-center max-xs:items-start gap-1 max-2xl:max-w-[85%] 2xl:max-w-full">
                        <h5 className="text-sm text-white font-semibold max-xs:leading-none flex items-center justify-center">
                          {position.liquidity === 'gamma'
                            ? `${tokens.find((e) => e.tokenAddress.toLowerCase() === position.token0.id.toLowerCase())?.basetoken.symbol} / ${tokens.find((e) => e.tokenAddress.toLowerCase() === position.token1.id.toLowerCase())?.basetoken.symbol}`
                            : `${position?.token0?.symbol} / ${position?.token1?.symbol}`}
                        </h5>
                        <div className="flex items-center gap-1 h-[26px]">
                          <span className="py-1 px-2 flex flex-col justify-center text-xs button-primary rounded-lg">
                            Concentrated
                          </span>
                          {/* <span className="!py-1 px-3  flex flex-col justify-center text-xs text-white border border-solid bg-shark-400 hover:bg-button-primary cursor-default rounded-lg bg-opacity-40 border-shark-300">
                            {formatAmount(toBN(position.pool.fee).div(10000), 3)}%
                          </span>
                          <span className="!py-0 px-3 text-base text-white border border-solid bg-shark-400 hover:bg-button-primary cursor-default rounded-lg bg-opacity-40 border-shark-300">
                            <span className="icon-info"></span>
                          </span> */}
                        </div>
                        <span
                          className={`!py-1 px-3 flex flex-col max-xs:w-[100%] xs:w-[315px] lg:w-[165px] justify-center items-center text-xs text-white border border-solid bg-shark-400 hover:bg-button-primary cursor-default rounded-lg bg-opacity-40 border-shark-300 ${totalCampaigns.find((add) => add.pairAddress.toLowerCase() == position.pool.id.toLowerCase())?.multiplier ? 'block' : 'hidden'}`}
                        >
                          {
                            totalCampaigns.find(
                              (add) => add.pairAddress.toLowerCase() == position.pool.id.toLowerCase()
                            )?.multiplier
                          }
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-auto">
                      <button
                        type="button"
                        onClick={() => {
                          isOpen && openId === position.id ? setIsOpen(false) : setIsOpen(true)
                          setOpenId(position.id)
                        }}
                      >
                        <span
                          className={`text-white icon-chevron text-xs leading-[0] block ${isOpen && openId === position.id ? 'rotate-180' : ''}`}
                        ></span>
                      </button>
                    </div>
                  </div>
                  {isOpen && openId === position.id && (
                    <>
                      <div className="flex flex-col gap-2">
                        {/* <div>
                          {position.liquidity === 'ichi' ? (
                            <div>
                              <span className="text-gray-600 flex justify-center items-center">
                                Managed By{' '}
                                <Image
                                  src={`/static/images/providers/ichi.svg`}
                                  alt="token"
                                  className="mx-2 w-10 h-10"
                                  width={30}
                                  height={30}
                                />
                              </span>
                            </div>
                          ) : (
                            <PriceCalculation
                              token0={position.token0}
                              token1={position.token1}
                              tickLower={position.tickLower}
                              tickUpper={position.tickUpper}
                              isMobile={true}
                            />
                          )}
                        </div> */}
                        {/* <div className="flex justify-between items-center mt-3">
                          <span className="text-white text-sm">Point Stack</span>
                          <div className="flex  justify-center items-center gap-2 ">
                            {
                              <span className="flex gap-2">
                                <span
                                  // ref={hoverRef}
                                  className={`flex items-center relative ${openTooltipGold ? 'z-[100]' : 'z-0'}`}
                                >
                                  {totalCampaigns.find(
                                    (add) => add.pairAddress.toLowerCase() == position.pool.id.toLowerCase()
                                  ) && (
                                    <div className="relative flex items-center">
                                      {campaign?.pointStack?.map((stack, index) => (
                                        <Image
                                          key={index}
                                          src={`/static/images/point-stack/${stack}.svg`}
                                          alt="token"
                                          className={`${stack === 'blast-gold' && 'rounded-full shadow-yellow-glow motion-safe:animate-notification'} ${openTooltipGold || openTooltipEigenLayer || openTooltipKelpMiles || openTooltipTurtleClub ? 'z-[100]' : 'z-0'}`}
                                          width={25}
                                          height={25}
                                          onMouseEnter={() => {
                                            if (stack === 'blast-gold') {
                                              setId(position.id)
                                              setOpenTooltipGold(true)
                                            }
                                            if (stack === 'eigen-layer') {
                                              setId(position.id)
                                              setOpenTooltipEigenLayer(true)
                                            }
                                            if (stack === 'kelp-miles') {
                                              setId(position.id)
                                              setOpenTooltipKelpMiles(true)
                                            }
                                            if (stack === 'turtle-club') {
                                              setId(position.id)
                                              setOpenTooltipTurtleClub(true)
                                            }
                                          }}
                                          onMouseLeave={() => {
                                            if (openTooltipGold) {
                                              setId('')
                                              setOpenTooltipGold(false)
                                            }
                                            if (openTooltipEigenLayer) {
                                              setId('')
                                              setOpenTooltipEigenLayer(false)
                                            }
                                            if (openTooltipKelpMiles) {
                                              setId('')
                                              setOpenTooltipKelpMiles(false)
                                            }
                                            if (openTooltipTurtleClub) {
                                              setId('')
                                              setOpenTooltipTurtleClub(false)
                                            }
                                          }}
                                        />
                                      ))}
                                      {openTooltipGold && position.id === id && (
                                        <div className="absolute left-[-25px] xl:left-auto max-xl:top-[5px] xl:top-0 z-50">
                                          <div className="relative z-[1000] bg-shark-950 rounded-lg border border-shark-300 w-[150px] xl:w-[200px] top-9 px-5 py-3 left-0 xl:-left-12 gap-y-1">
                                            <p className="text-xs text-white">
                                              This pool will receive {campaign?.blastGoldAmount} of Blast Gold till the
                                              25th June
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                      {openTooltipEigenLayer && position.id === id && (
                                        <div className="absolute left-[-25px] xl:left-auto max-xl:top-[5px] xl:top-0 z-50">
                                          <div className="relative z-[1000] bg-shark-950 rounded-lg border border-shark-300 w-[150px] xl:w-[200px] top-9 px-5 py-3 left-0 xl:-left-12 gap-y-1">
                                            <p className="text-xs text-white">
                                              Eigenlayer points will be distributed to liquidity providers in this pool
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                      {openTooltipKelpMiles && position.id === id && (
                                        <div className="absolute left-[-25px] xl:left-auto max-xl:top-[5px] xl:top-0 z-50">
                                          <div className="relative z-[1000] bg-shark-950 rounded-lg border border-shark-300 w-[150px] xl:w-[200px] top-9 px-5 py-3 left-0 xl:-left-12 gap-y-1">
                                            <p className="text-xs text-white">
                                              wrsETH liquidity providers will earn 1x Kelp Miles from this pool
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                      {openTooltipTurtleClub && position.id === id && (
                                        <div className="absolute left-[-25px] xl:left-auto max-xl:top-[5px] xl:top-0 z-50">
                                          <div className="relative z-[1000] bg-shark-950 rounded-lg border border-shark-300 w-[150px] xl:w-[200px] top-9 px-5 py-3 left-0 xl:-left-12 gap-y-1">
                                            <p className="text-xs text-white">
                                              Deposit liquidity to receive a 25% Turtle Points boost from Fenix Rings
                                              earned
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
                        </div> */}
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-white text-sm">Range</span>
                          {position.liquidity === 'ichi' ? (
                            <div className="flex justify-start items-center">
                              <Image src={'/static/images/ichi.svg'} alt="ichi" height={48} width={150} />
                            </div>
                          ) : position.liquidity === 'gamma' ? (
                            <div className=" flex justify-start items-center">
                              <Image src={'/static/images/gamma.svg'} alt="ichi" height={48} width={150} />
                            </div>
                          ) : (
                            <>
                              <SetStatus
                                token0={position.token0}
                                token1={position.token1}
                                tickLower={position.tickLower}
                                tickUpper={position.tickUpper}
                                liquidity={position.liquidity}
                                setIsInRange={setIsInRangeAll}
                                id={position.id}
                              />
                            </>
                          )}
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-white text-sm">APR</span>
                          {position.liquidity === 'gamma' || position.liquidity === 'ichi' ? (
                            <AprBox
                              apr={parseFloat(position?.apr) + fenixRingApr + extraAprNumber}
                              tooltip={
                                <div>
                                  <div className="flex justify-between items-center gap-3">
                                    <p className="text-sm pb-1">Fees APR</p>
                                    <p className="text-sm pb-1 text-chilean-fire-600">
                                      {Number(position.apr).toFixed(2)}%
                                    </p>
                                  </div>
                                  {fenixRingApr > 0 && (
                                    <div className="flex justify-between items-center gap-3">
                                      <p className="text-sm pb-1">Rings APR</p>
                                      <p className="text-sm pb-1 text-chilean-fire-600">
                                        {formatAmount(fenixRingApr, 2)}%
                                      </p>
                                    </div>
                                  )}
                                  {extraAprs &&
                                    extraAprs.length > 0 &&
                                    extraAprs.map((extraApr: extraPoints) => {
                                      return (
                                        <div key={extraApr.name} className="flex justify-between items-center gap-3">
                                          <p className="text-sm pb-1">{extraApr.name}</p>
                                          <p className="text-sm pb-1 text-chilean-fire-600">
                                            {formatAmount(extraApr.apr, 2)}%
                                          </p>
                                        </div>
                                      )
                                    })}
                                </div>
                              }
                            />
                          ) : (
                            <AprBox
                              apr={
                                isInRangeAll[position.id]
                                  ? parseFloat(position?.apr) + fenixRingApr + extraAprNumber
                                  : 0
                              }
                              tooltip={
                                <div>
                                  <div className="flex justify-between items-center gap-3">
                                    <p className="text-sm pb-1">Fees APR</p>
                                    <p className="text-sm pb-1 text-chilean-fire-600">
                                      {isInRangeAll[position.id] ? position?.apr : '0%'}
                                    </p>
                                  </div>
                                  {fenixRingApr > 0 && isInRangeAll[position.id] && (
                                    <div className="flex justify-between items-center gap-3">
                                      <p className="text-sm pb-1">Rings APR</p>
                                      <p className="text-sm pb-1 text-chilean-fire-600">
                                        {formatAmount(fenixRingApr, 2)}%
                                      </p>
                                    </div>
                                  )}
                                  {extraAprs &&
                                    extraAprs.length > 0 &&
                                    extraAprs.map((extraApr: extraPoints) => {
                                      return (
                                        <div key={extraApr.name} className="flex justify-between items-center gap-3">
                                          <p className="text-sm pb-1">{extraApr.name}</p>
                                          <p className="text-sm pb-1 text-chilean-fire-600">
                                            {formatAmount(extraApr.apr, 2)}%
                                          </p>
                                        </div>
                                      )
                                    })}
                                </div>
                              }
                            />
                          )}
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          {/* <span className="text-white text-sm">TVL</span> */}
                          {/* <div className="flex flex-col justify-center items-end">
                            <TvlTotal data={position} />
                            <span className="flex justify-center items-center gap-2">
                              <p className="flex gap-2 items-center">
                                <span className="text-xs text-shark-100">
                                  {formatCurrency(formatAmount(toBN(Number(position.depositedToken0)), 6))}{' '}
                                  {position.token0.symbol}
                                </span>
                              </p>
                              <p className="flex gap-2 items-center">
                                <span className="text-xs text-shark-100">
                                  {formatCurrency(formatAmount(toBN(Number(position.depositedToken1)), 6))}{' '}
                                  {position.token1.symbol}
                                </span>
                              </p>
                            </span>
                          </div> */}
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-white text-sm">Position Tvl</span>
                          <div className="flex flex-col justify-center items-end">
                            <TvlTotal data={position} />
                            <span className="flex justify-center items-center gap-2">
                              <p className="flex gap-2 items-center">
                                <span className="text-xs text-shark-100">
                                  {formatCurrency(formatAmount(toBN(Number(position.depositedToken0)), 6))}{' '}
                                  {position.token0.symbol}
                                </span>
                              </p>
                              <p className="flex gap-2 items-center">
                                <span className="text-xs text-shark-100">
                                  {formatCurrency(formatAmount(toBN(Number(position.depositedToken1)), 6))}{' '}
                                  {position.token1.symbol}
                                </span>
                              </p>
                            </span>
                          </div>
                        </div>
                        {/* <div className="flex justify-between items-center mt-2">
                          <span className="text-white text-sm">Available to Claim</span>
                          <div className="flex flex-col justify-center items-end">
                            <TvlTotal data={position} />
                            <span className="flex justify-center items-center gap-2">
                              <p className="flex gap-2 items-center">
                                <span className="text-xs text-shark-100">
                                  {formatCurrency(formatAmount(toBN(Number(position.depositedToken0)), 6))}{' '}
                                  {position.token0.symbol}
                                </span>
                              </p>
                              <p className="flex gap-2 items-center">
                                <span className="text-xs text-shark-100">
                                  {formatCurrency(formatAmount(toBN(Number(position.depositedToken1)), 6))}{' '}
                                  {position.token1.symbol}
                                </span>
                              </p>
                            </span>
                          </div>
                        </div> */}
                        <div className="flex max-xs:flex-col max-xs:gap-1 xs:justify-between items-start xs:items-center mt-2 max-xs:mt-1">
                          <span className="text-white text-sm">Action</span>
                          <div className="flex items-center gap-2 max-xs:w-full">
                            <Button
                              variant="tertiary"
                              className="h-[38px] w-[80px] max-xs:w-[50%] bg-opacity-40 items-center flex gap-1 justify-center"
                              onClick={() => {
                                if (position.liquidity == 'ichi') {
                                  router.push(
                                    `liquidity/deposit?type=CONCENTRATED_AUTOMATIC&token0=${position?.token0?.id}&token1=${position?.token1?.id}`
                                  )
                                } else if (position.liquidity == 'gamma') {
                                  router.push(
                                    `liquidity/deposit?provider=2&type=CONCENTRATED_AUTOMATIC&token0=${position?.token0?.id}&token1=${position?.token1?.id}`
                                  )
                                } else {
                                  dispatch(setApr(position?.apr))
                                  router.push(`/liquidity/manage?id=${position?.id}`)
                                  router.refresh()
                                }
                              }}
                            >
                              <span className="icon-manage"></span>
                              <span className="text-xs">Manage</span>
                            </Button>
                            {position.liquidity !== 'ichi' ? (
                              <>
                                <Button
                                  variant="tertiary"
                                  className="h-[38px] w-[80px] max-xs:w-[50%] bg-opacity-40 items-center flex gap-1 justify-center"
                                  onClick={() => {
                                    if (position.liquidity !== 'ichi') {
                                      handleClaim(position.id)
                                    }
                                  }}
                                >
                                  <span className="icon-coin"></span>
                                  <span className="text-xs">Claim</span>
                                </Button>
                              </>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )
          })}
          {activePagination && (
            <div className="items-center xl:hidden">
              {/* <Pagination
                className="mx-auto hidden"
                numberPages={Math.ceil(data.length / itemsPerPage)}
                activePage={activePage}
                itemsPerPage={itemsPerPage}
                setActivePage={setActivePage}
                setItemPerPage={setItemPerPage}
              /> */}
              <div className="mx-auto">
                <PaginationMobile
                  count={nonZeroData.length}
                  itemsPerPage={itemsPerPage}
                  setItemPerPage={setItemPerPage}
                  activePage={activePage}
                  setActivePage={setActivePage}
                  className="mx-auto"
                  numberPages={Math.ceil(nonZeroData.length / itemsPerPage)}
                />
              </div>
            </div>
          )}
        </>
      ) : (
        <NoPositionFound />
      )}
    </>
  )
}

export default PositionTableMobile
