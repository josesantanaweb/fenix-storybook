/* eslint-disable max-len */
/* eslint-disable react/no-multi-comp */
import Image from 'next/image'
import { Button, Pagination, PaginationMobile, TableBody, TableCell, TableHead, TableRow, Tooltip } from '../../UI'
import { positions } from '../MyStrategies/Strategy'
import NoPositionFound from './NoPositionFound'
import { useEffect, useMemo, useState, useRef } from 'react'
import { formatAmount, formatCurrency, formatDollarAmount, toBN } from '@/src/library/utils/numbers'
import { IchiVault, useIchiVaultsData } from '@/src/library/hooks/web3/useIchi'
import { NotificationDuration, NotificationType } from '@/src/state/notifications/types'
import { Address, encodeFunctionData, maxUint128, zeroAddress } from 'viem'
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
import Loader from '../../UI/Icons/Loader'
import { useQuery } from '@tanstack/react-query'
import AprBox from '../../UI/Pools/AprBox'
// import cn from '@/src/library/utils/cn'

import BoostedPool from '@/src/library/types/pools/boosted-pool'
import extraPoints from '@/src/library/types/pools/extra-points'
import RingCampaignData from '@/src/library/types/pools/ring-campaign-data'
import useFDAOEmissionsAPR from '@/src/library/hooks/web3/useFDAOEmisionsAPR'
import { useRingsCampaigns } from '@/src/state/liquidity/hooks'
import { totalCampaigns, Campaign } from '@/src/library/utils/campaigns'
import { useRingsCampaignsBoostedPools } from '@/src/state/liquidity/hooks'
import TokenListItem from '@/src/library/types/token-list-item'

interface MyPositionssProps {
  activePagination?: boolean
  data: positions[]
  tokens: TokenListItem[]
  ringsCampaign: RingCampaignData
  showDust?: boolean
}

const PositionTable = ({ activePagination = true, data, tokens, ringsCampaign, showDust }: MyPositionssProps) => {
  const router = useRouter()

  const dispatch = useDispatch()
  const { writeContractAsync } = useWriteContract()
  const { address } = useAccount()
  const addNotification = useNotificationAdderCallback()
  const [itemsPerPage, setItemPerPage] = useState<number>(6)
  const [activePage, setActivePage] = useState<number>(1)
  const [isMinHover, setIsMinHover] = useState<boolean>(false)
  const [isMaxHover, setIsMaxHover] = useState<boolean>(false)
  const [tvlPosition, setTvlPosition] = useState<any>([])
  const [nonZeroData, setNonZeroData] = useState<positions[]>([])
  const [burnedPositions, setBurnedPositions] = useState<any[]>([])
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
    const modifiedData = data.filter((i) => {
      return !burnedPositions.includes(i.id)
    }).map(obj => {
      return { ...obj, isNotDust: (Number(tvlPosition[obj.id] ? tvlPosition[obj.id] : TvlTotalValue(obj)) > 0.1) };
    })

    setNonZeroData(showDust ? modifiedData : modifiedData.filter((i) => {
      return i.isNotDust
    }))
  }, [data, showDust, tvlPosition, tokens, burnedPositions])

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
          <div className="flex gap-2 justify-between">
            <div className="px-2 py-1 text-[.625rem] leading-4  whitespace-nowrap text-white border border-solid bg-shark-400 rounded-xl bg-opacity-40 border-1 border-shark-300">
              Min: {minPriceIsZero ? 0 : formatAmount(minPrice, 6)} Max:{' '}
              {maxPriceIsInfinity ? '∞' : formatAmount(maxPrice, 6)}
              {/* Min: {minPriceIsZero ? 0 : formatAmount(minPrice, 6)} {token0.symbol} per {token1.symbol} */}
            </div>
            {/* <div className="px-2 py-2 text-xs whitespace-nowrap text-white border border-solid bg-shark-400 rounded-xl bg-opacity-40 border-1 border-shark-300">
              Max: {maxPriceIsInfinity ? '∞' : formatAmount(maxPrice, 6)}
              Max: {maxPriceIsInfinity ? '∞' : formatAmount(maxPrice, 6)} {token0.symbol} per {token1.symbol}
            </div> */}
          </div>
        ) : (
          <>
            <div className="relative px-2 py-1 text-[.625rem] leading-4  whitespace-nowrap text-ellipsis overflow-hidden text-white border border-solid bg-shark-400 rounded-xl bg-opacity-40 border-1 border-shark-300">
              {/* Min: {minPriceIsZero ? 0 : formatAmount(minPrice, 6)} {token0.symbol} per {token1.symbol} */}
              Min: {minPriceIsZero ? 0 : formatAmount(minPrice, 6)} - Max:{' '}
              {maxPriceIsInfinity ? '∞' : formatAmount(maxPrice, 6)}
            </div>
            {/* <div
              className="relative px-2 py-2 text-xs whitespace-nowrap text-ellipsis overflow-hidden text-white border border-solid bg-shark-400 rounded-xl bg-opacity-40 border-1 border-shark-300"

            > */}
            {/* Max: {maxPriceIsInfinity ? '∞' : formatAmount(maxPrice, 6)} {token0.symbol} per {token1.symbol} */}
            {/* Max: {maxPriceIsInfinity ? '∞' : formatAmount(maxPrice, 6)}  */}
            {/* </div> */}
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
      <div className="flex items-center gap-2 max-2xl:gap-1 justify-start">
        <div
          className={`relative cursor-default rounded-full w-2 h-2 ${isInRangeAux ? 'bg-sucess-100' : 'bg-error-100'} mr-1`}
          // onMouseOver={() => setIsOverRange(true)}
          // onMouseLeave={() => setIsOverRange(false)}
        >
          {/* <div
            className={`absolute top-[-20px] ${isInRangeAux ? 'right-[-65px]' : 'right-[-90px]'} px-2 py-1 text-white text-xs whitespace-nowrap border bg-shark-400 rounded-lg border-shark-300 `}
          >
            {' '}
            {isInRangeAux ? 'In range' : 'Out of range'}{' '}
          </div> */}
        </div>
        <div className="flex flex-col items-start">
          <div className="text-shark-100 text-xs font-normal  -mt-[15px]">Min Price</div>
          <span
            className="!py-1 px-4 text-xs text-white whitespace-nowrap border border-solid bg-shark-400 hover:bg-button-primary
            flex items-center max-h-[28px] min-h-[28px]
            cursor-default rounded-lg bg-opacity-40 border-shark-300

          "
          >
            {minPriceIsZero ? 0 : formatAmount(minPrice, 6)}
          </span>
        </div>
        <div className="flex flex-col items-start">
          <div className="text-shark-100 text-xs font-normal  -mt-[15px]">Max Price</div>
          <span
            className="!py-1 px-4 text-xs text-white whitespace-nowrap border border-solid bg-shark-400 hover:bg-button-primary
          flex items-center cursor-default rounded-lg bg-opacity-40 border-shark-300
          max-h-[28px] min-h-[28px]
          "
          >
            <span className={`${maxPriceIsInfinity && 'mt-[2px]'}`}>
              {maxPriceIsInfinity ? '∞' : formatAmount(maxPrice, 6)}
            </span>
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
  const EmissionsTotal = ({ data }: any) => {
    const ichitokens = useIchiVaultsData(data.liquidity === 'ichi' ? data?.id : zeroAddress)

    return (
      <>
        <p className="text-xs text-white -mt-[3px]">
          {formatDollarAmount(
            Number(data?.depositedToken0) *
              Number(
                tokens.find(
                  (e) =>
                    e.tokenAddress.toLowerCase() ===
                    (data.liquidity === 'ichi' ? ichitokens.tokenA.toLowerCase() : data?.token0?.id.toLowerCase())
                )?.priceUSD
              ) +
              Number(data?.depositedToken1) *
                Number(
                  tokens.find(
                    (e) =>
                      e.tokenAddress.toLowerCase() ===
                      (data.liquidity === 'ichi' ? ichitokens.tokenB.toLowerCase() : data?.token1?.id.toLowerCase())
                  )?.priceUSD
                )
          )}
        </p>
      </>
    )
  }

  const TokenIchiGamma = ({ data }: any) => {
    return <></>
  }

  const handleBurnAndCollect = async (id: any, lpValue: any, firstToken: any, secondToken: any) => {
    const multi = []

    if(lpValue > 0) {
      multi.push(
        encodeFunctionData({
          abi: CL_MANAGER_ABI,
          functionName: 'decreaseLiquidity',
          args: [
            [
              id,
              lpValue,
              0,
              0,
              parseInt((+new Date() / 1000).toString()) + 60 * 60,
            ],
          ],
        })
      )
    }

    multi.push(
      encodeFunctionData({
        abi: CL_MANAGER_ABI,
        functionName: 'collect',
        args: [
          [
            id,
            '0x0000000000000000000000000000000000000000',
            maxUint128,
            maxUint128,
          ],
        ],
      })
    )

    multi.push(
      encodeFunctionData({
        abi: CL_MANAGER_ABI,
        functionName: 'burn',
        args: [
          id
        ],
      })
    )

    multi.push(
      encodeFunctionData({
        abi: CL_MANAGER_ABI,
        functionName: 'sweepToken',
        args: [
          firstToken,
          0,
          address,
        ],
      })
    )

    multi.push(
      encodeFunctionData({
        abi: CL_MANAGER_ABI,
        functionName: 'sweepToken',
        args: [
          secondToken,
          0,
          address,
        ],
      })
    )

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
            // toast(`Removed successfully.`)
            addNotification({
              id: crypto.randomUUID(),
              createTime: new Date().toISOString(),
              message: `Removed successfully.`,
              notificationType: NotificationType.SUCCESS,
              txHash: transaction.transactionHash,
              notificationDuration: NotificationDuration.DURATION_5000,
            })

            setBurnedPositions(prevPositions => [...prevPositions, id]);
          } else {
            // toast(`Remove LP TX failed, hash: ${transaction.transactionHash}`)
            addNotification({
              id: crypto.randomUUID(),
              createTime: new Date().toISOString(),
              message: `Remove LP TX failed, hash: ${transaction.transactionHash}`,
              notificationType: NotificationType.ERROR,
              txHash: transaction.transactionHash,
              notificationDuration: NotificationDuration.DURATION_5000,
            })
          }

          //updatePositionData(positionData.id)
        },
        onError: (e) => {
          // toast(`Remove LP failed. ${e}`)
          addNotification({
            id: crypto.randomUUID(),
            createTime: new Date().toISOString(),
            message: `Add LP failed. ${e}`,
            notificationType: NotificationType.ERROR,
            txHash: '',
            notificationDuration: NotificationDuration.DURATION_5000,
          })
        },
      }
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
  // console.log('pagination >> ', pagination)
  const ichitokens = useIchiVaultsData(pagination.liquidity === 'ichi' ? pagination?.id : zeroAddress)
  // console.log(tokens.find((e) => e.tokenAddress.toLowerCase() === ichitokens?.tokenA.toLowerCase())?.basetoken.symbol)
  return (
    <>
      <div className="relative hidden xl:block z-10 xl:mb-5 w-full">
        <div className="w-full">
          <TableHead
            items={[
              { text: 'Your Positions', className: 'text-left w-[20%] text-xs', sortable: false },
              // { text: 'Point Stack', className: 'text-left w-[10%] text-xs', sortable: false },
              // { text: 'Status', className: 'text-left w-[15%]', sortable: false },
              { text: 'Range', className: 'text-left w-[30%] text-xs', sortable: false },
              { text: 'APR', className: 'text-right w-[20%] text-xs', sortable: false },
              // { text: 'TVL', className: 'text-right w-[8%]', sortable: false },
              { text: 'Position TVL', className: 'text-right w-[10%] text-xs', sortable: false },
              // {
              //   text: 'Claim Fees',
              //   className: 'text-right w-[10%] text-xs whitespace-nowrap',
              //   sortable: false,
              // },
              { text: 'Action', className: 'text-right w-[20%] text-xs ', sortable: false },
            ]}
            setSort={() => {}}
            setSortIndex={() => {}}
            sort={'normal'}
            sortIndex={1}
          />

          {nonZeroData && nonZeroData?.length > 0 ? (
            <>
              <TableBody className="whitespace-nowrap">
                {pagination.map((position: positions) => {
                  // eslint-disable-next-line react-hooks/rules-of-hooks
                  //const [isInRange, setIsInRange] = useState<boolean>(false)
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
                      <TableRow key={position.id}>
                        <TableCell className="flex w-[20%]">
                          <div className="flex items-center w-full gap-2 py-4 -mb-[15px]">
                            {position.liquidity === 'gamma' || position.liquidity === 'ichi' ? (
                              <>
                                <div className="flex items-center min-w-[38px] max-2xl:w-[50px] -mt-[15px]">
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
                                <div className="flex flex-col gap-2 max-2xl:max-w-[85%] 2xl:max-w-full">
                                  <h5 className="text-sm text-white font-semibold leading-none">
                                    {position.liquidity === 'gamma'
                                      ? `${tokens.find((e) => e.tokenAddress.toLowerCase() === position.token0.id.toLowerCase())?.basetoken.symbol} / ${tokens.find((e) => e.tokenAddress.toLowerCase() === position.token1.id.toLowerCase())?.basetoken.symbol}`
                                      : `${position?.token0?.symbol} / ${position?.token1?.symbol}`}
                                  </h5>
                                  <div className="flex items-center gap-2 h-[26px]">
                                    <span className="py-1 px-2 h-[1.875rem] max-w-[95%] flex flex-col justify-center text-xs button-primary rounded-lg">
                                      <span className="truncate">Concentrated</span>
                                    </span>
                                    {/* <span className="!py-1 px-3  h-[1.875rem] flex flex-col justify-center text-xs text-white border border-solid bg-shark-400 hover:bg-button-primary cursor-default rounded-lg bg-opacity-40 border-shark-300">
                                      {formatAmount(toBN(position.pool.fee).div(10000), 3)}%
                                    </span> */}
                                    {/* <span className="!py-0 px-3 h-[1.875rem] text-lg text-white border border-solid bg-shark-400 hover:bg-button-primary cursor-default rounded-lg bg-opacity-40 border-shark-300">
                                      <span className="icon-info"></span>
                                    </span> */}
                                  </div>
                                  <span
                                    className={`!py-1 px-3 h-[1.875rem] flex flex-col justify-center items-center text-xs text-white border border-solid bg-shark-400 hover:bg-button-primary cursor-default rounded-lg bg-opacity-40 border-shark-300 ${totalCampaigns.find((add) => add.pairAddress.toLowerCase() == position.pool.id.toLowerCase())?.multiplier ? 'block' : 'hidden'}`}
                                  >
                                    {
                                      totalCampaigns.find(
                                        (add) => add.pairAddress.toLowerCase() == position.pool.id.toLowerCase()
                                      )?.multiplier
                                    }
                                  </span>
                                  <span
                                    className={`

                                      !py-1 px-3 h-[1.875rem]
                                      ${totalCampaigns.find((add) => add.pairAddress.toLowerCase() == position.pool.id.toLowerCase())?.multiplier ? 'hidden' : 'block'}`}
                                  ></span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex items-center min-w-[38px] max-2xl:w-[50px]  -mt-[15px]">
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
                                <div className="flex flex-col gap-2 max-2xl:max-w-[85%] 2xl:max-w-full">
                                  <h5 className="text-sm text-white font-semibold leading-none">
                                    {position.token0.symbol} / {position.token1.symbol}
                                  </h5>
                                  <div className="flex items-center gap-2 h-[26px]">
                                    <span className="py-1 px-2 h-[1.875rem] max-w-[95%] flex flex-col justify-center text-xs button-primary rounded-lg">
                                      <span className="truncate">Concentrated</span>
                                    </span>
                                    <span className="!py-1 px-3  h-[1.875rem] flex flex-col justify-center text-xs text-white border border-solid bg-shark-400 hover:bg-button-primary cursor-default rounded-lg bg-opacity-40 border-shark-300">
                                      {formatAmount(toBN(position.pool.fee).div(10000), 3)}%
                                    </span>
                                    {/* <span className="!py-0 px-3 h-[1.875rem] text-lg text-white border border-solid bg-shark-400 hover:bg-button-primary cursor-default rounded-lg bg-opacity-40 border-shark-300">
                                      <span className="icon-info"></span>
                                    </span> */}
                                  </div>
                                  <span
                                    className={`!py-1 px-3 h-[1.875rem] flex flex-col justify-center items-center text-xs text-white border border-solid bg-shark-400 hover:bg-button-primary cursor-default rounded-lg bg-opacity-40 border-shark-300 ${totalCampaigns.find((add) => add.pairAddress.toLowerCase() == position.pool.id.toLowerCase())?.multiplier ? 'block' : 'hidden'}`}
                                  >
                                    {
                                      totalCampaigns.find(
                                        (add) => add.pairAddress.toLowerCase() == position.pool.id.toLowerCase()
                                      )?.multiplier
                                    }
                                  </span>
                                  <span
                                    className={`

                                      !py-1 px-3 h-[1.875rem]
                                      ${totalCampaigns.find((add) => add.pairAddress.toLowerCase() == position.pool.id.toLowerCase())?.multiplier ? 'hidden' : 'block'}`}
                                  ></span>
                                </div>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="w-[30%]">
                          {/* Range */}

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
                        </TableCell>
                        <TableCell className="w-[20%] flex justify-end">
                          {/* APR */}
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
                        </TableCell>
                        {/* <TableCell className="w-[8%] flex justify-end">
                          <div className="flex flex-col justify-center items-end">
                            <TvlTotal data={position} />

                            <span className="flex items-center justify-end text-right gap-2 font-normal text-xs text-shark-100">
                              {formatCurrency(formatAmount(toBN(Number(position.depositedToken0)), 6))}{' '}
                              {position.token0.symbol}
                            </span>

                            <span className="flex items-center justify-end text-right gap-2 font-normal text-xs text-shark-100">
                              {formatCurrency(formatAmount(toBN(Number(position.depositedToken1)), 6))}{' '}
                              {position.token1.symbol}
                            </span>
                          </div>
                        </TableCell> */}
                        <TableCell className="w-[10%] flex justify-end">
                          {/* In Wallet */}
                          <div className="flex flex-col justify-center items-end">
                            <EmissionsTotal data={position} />

                            <span className="flex items-center justify-end text-right gap-2 font-normal text-xs text-shark-100 mt-[14px]">
                              {formatCurrency(formatAmount(toBN(Number(position.depositedToken0)), 6))}{' '}
                              {position.token0.symbol}
                            </span>

                            <span className="flex items-center justify-end text-right gap-2 font-normal text-xs text-shark-100">
                              {formatCurrency(formatAmount(toBN(Number(position.depositedToken1)), 6))}{' '}
                              {position.token1.symbol}
                            </span>
                          </div>
                        </TableCell>
                        {/* <TableCell className="w-[10%] flex justify-end">

                          <div className="flex flex-col justify-center items-end ">


                            {position.liquidity !== 'ichi' && position.liquidity !== 'gamma' ? (
                              <>
                                <p className="text-xs text-white -mt-[3px]">
                                  {formatDollarAmount(
                                    (position && position.fees && position.fees.length > 0
                                      ? Number(position.fees[0]) / 10 ** Number(position.token0.decimals)
                                      : 0) *
                                      Number(
                                        tokens.find(
                                          (e) => e.tokenAddress.toLowerCase() === position?.token0?.id.toLowerCase()
                                        )?.priceUSD
                                      ) +
                                      (position && position.fees && position.fees.length > 0
                                        ? Number(position.fees[1]) / 10 ** Number(position.token1.decimals)
                                        : 0) *
                                        Number(
                                          tokens.find(
                                            (e) => e.tokenAddress.toLowerCase() === position?.token1?.id.toLowerCase()
                                          )?.priceUSD
                                        )
                                  )}
                                </p>
                                <span className="flex items-center justify-end text-right gap-2 font-normal text-xs text-shark-100 ">
                                  {position && position.fees && position.fees.length > 0
                                    ? formatCurrency(
                                        formatAmount(
                                          toBN(Number(position.fees[0]) / 10 ** Number(position.token0.decimals)),
                                          6
                                        )
                                      )
                                    : 0}{' '}
                                  {position.token0.symbol}
                                </span>

                                <span className="flex items-center justify-end text-right gap-2 font-normal text-xs text-shark-100">
                                  {position && position.fees && position.fees.length > 0
                                    ? formatCurrency(
                                        formatAmount(
                                          toBN(Number(position.fees[1]) / 10 ** Number(position.token1.decimals)),
                                          6
                                        )
                                      )
                                    : 0}{' '}
                                  {position.token1.symbol}
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="flex items-center justify-end text-right gap-2 font-normal text-xs text-shark-100">
                                  Autcompounded
                                </span>
                                <span className="flex items-center justify-end text-right gap-2 font-normal text-xs text-shark-100">
                                  to Position
                                </span>
                              </>
                            )}
                          </div>
                        </TableCell>*/}
                        <TableCell className="w-[20%] flex justify-end">
                          {/* Action */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="tertiary"
                              className="h-[38px] w-[80px] bg-opacity-40 flex items-center gap-1 justify-center"
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
                              <span className="icon-manage" />
                              <span className="text-xs">Manage</span>
                            </Button>
                            {position.liquidity !== 'ichi' && position.liquidity !== 'gamma' ? (
                              <>
                                <Button
                                  variant="tertiary"
                                  className="h-[38px] w-[80px] bg-opacity-40 flex items-center gap-1 justify-center"
                                  onClick={() => {
                                    if (position.liquidity !== 'ichi') {
                                      handleClaim(position.id)
                                    }
                                  }}
                                >
                                  <span className="icon-coin" />
                                  <span className="text-xs">Claim</span>
                                </Button>
                              </>
                            ) : (
                              <></>
                            )}
                            {position.isNotDust ?
                            (
                              <></>
                            ) : (
                              <>
                                <Button
                                  variant="tertiary"
                                  className="h-[38px] w-[80px] bg-opacity-40 items-center justify-center"
                                  onClick={() => {
                                    if (position.liquidity !== 'ichi') {
                                      handleBurnAndCollect(position.id, position.liquidity, position.token0.id, position.token1.id)
                                    }
                                  }}
                                >
                                  <span className="text-xs">Burn</span>
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    </>
                  )
                })}
              </TableBody>
              {activePagination && (
                <div className="items-center hidden xl:flex">
                  <Pagination
                    className="mx-auto"
                    numberPages={Math.ceil(nonZeroData.length / itemsPerPage)}
                    activePage={activePage}
                    itemsPerPage={itemsPerPage}
                    setActivePage={setActivePage}
                    setItemPerPage={setItemPerPage}
                  />
                  <div className=" hidden">
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
        </div>
      </div>
    </>
  )
}

export default PositionTable
