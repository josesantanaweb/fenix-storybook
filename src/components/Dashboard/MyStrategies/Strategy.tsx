'use client'
import Image from 'next/image'
import { Button, Switch, Tooltip } from '@/src/components/UI'
import Graph from './Graph'
import ComponentVisible from '@/src/library/hooks/useVisible'
import { formatAmount, formatCurrency, formatDollarAmount, fromWei, toBN } from '@/src/library/utils/numbers'
import { fetchTokens } from '@/src/library/common/getAvailableTokens'
import { useEffect, useState } from 'react'
import { useIchiVaultsData } from '@/src/library/hooks/web3/useIchi'
import { IchiVault } from '@ichidao/ichi-vaults-sdk'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { publicClient } from '@/src/library/constants/viemClient'
import { CL_MANAGER_ABI } from '@/src/library/constants/abi'
import { contractAddressList } from '@/src/library/constants/contactAddresses'
import { Address, encodeFunctionData, zeroAddress } from 'viem'
import { useAccount, useWriteContract } from 'wagmi'
import { MAX_INT } from '@/src/library/constants/misc'
import { useNotificationAdderCallback } from '@/src/state/notifications/hooks'
import { NotificationDuration, NotificationType } from '@/src/state/notifications/types'
import { useDispatch } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { ichiVaults } from '../../Liquidity/Deposit/Panel/Concentrated/Automatic/ichiVaults'
import BoostedPool from '@/src/library/types/pools/boosted-pool'
import { setApr } from '@/src/state/apr/reducer'
import { useRingsCampaigns } from '@/src/state/liquidity/hooks'
import TokenListItem from '@/src/library/types/token-list-item';

type options = {
  value: string
  label: string
}
export interface Pool {
  id: string
  fee: string
  sqrtPrice: string
  liquidity: string
  tick: string
  tickSpacing: string
  totalValueLockedUSD: string
  volumeUSD: string
  feesUSD: string
  untrackedFeesUSD: string
  token0Price: string
  token1Price: string
  token0: Tokenp
  token1: Tokenp
  poolDayData: PoolDayData
}

export interface Tokenp {
  id: string
  symbol: string
  name: string
  decimals: string
  derivedMatic: string
}

export interface PoolDayData {
  __typename?: 'PoolDayData'
  feesUSD: any
}

export interface Tick {
  price0: string
  price1: string
  tickIdx: string
}

export interface positions {
  id: string
  liquidity: string
  owner: string
  depositedToken0: Number
  depositedToken1: Number
  withdrawnToken0: string
  withdrawnToken1: string
  pool: Pool
  tickLower: Tick
  tickUpper: Tick
  token0: Tokenp
  token1: Tokenp
  apr: any
  isNotDust?: any
  fees?: any
}

export type ichipositions = {
  userAmounts: string[]
  vaultAddress: string
  amount0: string
  amount1: string
}

interface StrategyProps {
  row: positions
  tokens: TokenListItem[]
  ichiTokens: any
  options: options[]
  setModalSelected: (modal: string) => void
  setOpenModal: (modal: boolean) => void
}

const Strategy = ({ row, tokens, ichiTokens: ichitokens, options, setModalSelected, setOpenModal }: StrategyProps) => {
  console.log(row, 'rowtokens')
  const dispatch = useDispatch()
  const { ref, isVisible, setIsVisible } = ComponentVisible(false)
  const { writeContractAsync } = useWriteContract()
  const { address } = useAccount()
  const router = useRouter()

  const addNotification = useNotificationAdderCallback()

  const handlerOpenModal = (option: string) => {
    setOpenModal(true)
    setModalSelected(option)
  }

  console.log(row)
  const [showtoken0, setshowtoken0] = useState(true)

  const handlerSwitch = () => {
    setshowtoken0(!showtoken0)
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
  const { data: ringsCampaign } = useRingsCampaigns()

  const ichiVaultData = ichiVaults.find((e) => e.id.toLowerCase() === row?.id.toLowerCase())
  const fenixRingApr =
    ringsCampaign?.boostedPools.find((pool: BoostedPool) => {
      return row.liquidity === 'ichi'
        ? pool?.id?.toLowerCase() === ichiVaultData?.pool.toLowerCase()
        : pool?.id?.toLowerCase() === row?.pool.id.toLowerCase()
    })?.apr || 0
  return Number(row?.depositedToken0) *
    Number(
      tokens.find(
        (e) =>
          e.tokenAddress.toLowerCase() ===
          (row.liquidity === 'ichi' ? ichitokens?.tokenA.toLowerCase() : row?.token0?.id.toLowerCase())
      )?.priceUSD
    ) +
    Number(row?.depositedToken1) *
      Number(
        tokens.find(
          (e) =>
            e.tokenAddress.toLowerCase() ===
            (row.liquidity === 'ichi' ? ichitokens?.tokenB.toLowerCase() : row?.token1?.id.toLowerCase())
        )?.priceUSD
      ) >
    0.1 ? (
    <div className="steps-box-dashboard w-auto xl:min-w-[350px]">
      <div className="relative z-10">
        <div className="relative text-white flex flex-col">
          <div className="flex justify-between items-center box-strategies">
            <div className="flex gap-4 items-center">
              <div className="flex items-center">
                <Image
                  src={
                    row.liquidity === 'ichi'
                      ? `/static/images/tokens/${tokens.find((e) => e.tokenAddress.toLowerCase() === ichitokens?.tokenA.toLowerCase())?.basetoken.symbol}.svg`
                      : row.liquidity === 'gamma'
                        ? `/static/images/tokens/${tokens.find((e) => e.tokenAddress.toLowerCase() === row.token0.id.toLowerCase())?.basetoken.symbol}.svg`
                        : `/static/images/tokens/${row?.token0?.symbol}.svg`
                  }
                  alt="token"
                  className="rounded-full "
                  width={32}
                  height={32}
                />
                <Image
                  src={
                    row.liquidity === 'ichi'
                      ? `/static/images/tokens/${tokens.find((e) => e.tokenAddress.toLowerCase() === ichitokens?.tokenB.toLowerCase())?.basetoken.symbol}.svg`
                      : row.liquidity === 'gamma'
                        ? `/static/images/tokens/${tokens.find((e) => e.tokenAddress.toLowerCase() === row.token1.id.toLowerCase())?.basetoken.symbol}.svg`
                        : `/static/images/tokens/${row?.token1?.symbol}.svg`
                  }
                  alt="token"
                  className="-ml-4 rounded-full"
                  width={32}
                  height={32}
                />
              </div>
              <div className="flex flex-col">
                <p>
                  {row.liquidity === 'ichi'
                    ? `${tokens.find((e) => e.tokenAddress.toLowerCase() === ichitokens?.tokenA.toLowerCase())?.basetoken.symbol} / ${tokens.find((e) => e.tokenAddress.toLowerCase() === ichitokens?.tokenB.toLowerCase())?.basetoken.symbol}`
                    : row.liquidity === 'gamma'
                      ? `${tokens.find((e) => e.tokenAddress.toLowerCase() === row.token0.id.toLowerCase())?.basetoken.symbol} / ${tokens.find((e) => e.tokenAddress.toLowerCase() === row.token1.id.toLowerCase())?.basetoken.symbol}`
                      : `${row?.token0?.symbol} / ${row?.token1?.symbol}`}
                </p>

                <p className="text-xs">
                  {row.liquidity === 'ichi'
                    ? 'Ichi Position'
                    : row.liquidity === 'gamma'
                      ? 'Gamma Postion'
                      : 'ID: ' + row?.id}
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 my-2">
            <div className="flex flex-col gap-2 w-1/2 h-full items-center bg-shark-400 bg-opacity-40 p-4  rounded-lg">
              <p className="text-white flex items-center gap-x-1 relative">
                APR
                <span
                  className="icon-info text-xs"
                  onMouseEnter={() => setIsVisible(true)}
                  onMouseLeave={() => setIsVisible(false)}
                ></span>
                <Tooltip
                  className="absolute z-10 bg-shark-950 rounded-lg border border-shark-300 w-auto xl:w-[200px] top-7 px-5 py-3 left-0 xl:-left-12"
                  show={isVisible}
                  setShow={setIsVisible}
                >
                  <div className="flex justify-between items-center gap-3">
                    <p className="text-sm pb-1">{row.liquidity === 'ichi' ? 'Ichi' : 'Gamma'} APR</p>
                    <p className="text-sm pb-1 text-chilean-fire-600">
                      {parseFloat(row?.apr) < 0 ? 0 : parseFloat(row?.apr).toFixed(3)} %
                    </p>
                  </div>
                  {fenixRingApr > 0 && (
                    <div className="flex justify-between items-center gap-3">
                      <p className="text-sm pb-1">Rings APR</p>
                      <p className="text-sm pb-1 text-chilean-fire-600">{formatAmount(fenixRingApr, 2)}%</p>
                    </div>
                  )}
                </Tooltip>
              </p>
              <h2 className="text-green-400 text-2xl">{formatAmount(parseFloat(row?.apr) + fenixRingApr, 2)}%</h2>
            </div>
            <div className="bg-shark-400 bg-opacity-40 flex flex-col gap-2 w-1/2 items-center p-4  rounded-lg">
              <p className="text-white">
                Liquidity
                {/* <span className="icon-info text-xs"></span> */}
              </p>
              <h2 className="text-white text-2xl">
                {row.liquidity === 'ichi'
                  ? 'ICHI'
                  : row.liquidity === 'gamma'
                    ? 'GAMMA'
                    : formatCurrency(fromWei(row?.liquidity))}{' '}
                LP
              </h2>
            </div>
          </div>
        </div>
        <div className="bg-shark-400 bg-opacity-40 rounded-lg">
          <div className="relative text-white flex items-center justify-center border-b border-shark-400">
            <div className="flex items-start flex-col p-4 w-1/2">
              <h4 className="text-sm text-white-400">
                {row.liquidity === 'ichi'
                  ? `${tokens.find((e) => e.tokenAddress.toLowerCase() === ichitokens?.tokenA.toLowerCase())?.basetoken.symbol}`
                  : row.liquidity === 'gamma'
                    ? `${tokens.find((e) => e.tokenAddress.toLowerCase() === row.token0.id.toLowerCase())?.basetoken.symbol}`
                    : `${row?.token0?.symbol}`}
              </h4>
              <h4 className="text-sm text-white">
                {formatCurrency(formatAmount(toBN(Number(row?.depositedToken0)), 6))}{' '}
                {row.liquidity === 'ichi'
                  ? `${tokens.find((e) => e.tokenAddress.toLowerCase() === ichitokens?.tokenA.toLowerCase())?.basetoken.symbol}`
                  : row.liquidity === 'gamma'
                    ? `${tokens.find((e) => e.tokenAddress.toLowerCase() === row.token0.id.toLowerCase())?.basetoken.symbol}`
                    : `${row?.token0?.symbol}`}
              </h4>
              <p className="text-xs text-white">
                {formatDollarAmount(
                  Number(row?.depositedToken0) *
                    Number(
                      tokens.find(
                        (e) =>
                          e.tokenAddress.toLowerCase() ===
                          (row.liquidity === 'ichi' ? ichitokens?.tokenA.toLowerCase() : row?.token0?.id.toLowerCase())
                      )?.priceUSD
                    )
                )}
              </p>
            </div>

            <div className="flex items-start flex-col p-4 w-1/2 border-l border-shark-400">
              <h4 className="text-sm text-white-500">
                {row.liquidity === 'ichi'
                  ? `${tokens.find((e) => e.tokenAddress.toLowerCase() === ichitokens?.tokenB.toLowerCase())?.basetoken.symbol}`
                  : row.liquidity === 'gamma'
                    ? `${tokens.find((e) => e.tokenAddress.toLowerCase() === row.token1.id.toLowerCase())?.basetoken.symbol}`
                    : `${row?.token1?.symbol}`}
              </h4>
              <h4 className="text-sm text-white">
                {formatCurrency(formatAmount(toBN(Number(row?.depositedToken1)), 6))}{' '}
                {row.liquidity === 'ichi'
                  ? `${tokens.find((e) => e.tokenAddress.toLowerCase() === ichitokens?.tokenB.toLowerCase())?.basetoken.symbol}`
                  : row.liquidity === 'gamma'
                    ? `${tokens.find((e) => e.tokenAddress.toLowerCase() === row.token1.id.toLowerCase())?.basetoken.symbol}`
                    : `${row?.token1?.symbol}`}
              </h4>
              <p className="text-xs text-white">
                {formatDollarAmount(
                  Number(row?.depositedToken1) *
                    Number(
                      tokens.find(
                        (e) =>
                          e.tokenAddress.toLowerCase() ===
                          (row.liquidity === 'ichi' ? ichitokens?.tokenB.toLowerCase() : row?.token1?.id.toLowerCase())
                      )?.priceUSD
                    )
                )}
              </p>
            </div>
          </div>

          <Graph
            row={row}
            tickLower={row?.tickLower}
            tickUpper={row?.tickUpper}
            token0Symbol={row?.token0?.symbol}
            token1Symbol={row?.token1?.symbol}
          />
        </div>
        <div className="flex flex-row gap-5 items-center justify-center p-3">
          {/* <Button variant="tertiary" className="h-[38px] w-[90px] bg-opacity-40 items-center justify-center">
            <span className="text-l">Deposits</span>
          </Button>
          <Button variant="tertiary" className="h-[38px] w-[90px] bg-opacity-40 items-center justify-center">
            <span className="text-l">Stake</span>
          </Button> */}
          <Button
            variant="tertiary"
            className="h-[38px] w-[90px] bg-opacity-40 items-center justify-center"
            onClick={() => {
              if (row.liquidity == 'ichi') {
                router.push(
                  `liquidity/deposit?type=CONCENTRATED_AUTOMATIC&token0=${row?.token0?.id}&token1=${row?.token1?.id}`
                )
              } else if (row.liquidity == 'gamma') {
                router.push(
                  `liquidity/deposit?provider=2&type=CONCENTRATED_AUTOMATIC&token0=${row?.token0?.id}&token1=${row?.token1?.id}`
                )
              } else {
                dispatch(setApr(row?.apr))
                router.push(`/liquidity/manage?id=${row?.id}`)
                router.refresh()
              }
              // router.refresh()
            }}
          >
            <span className="text-l">Manage</span>
          </Button>
          {row.liquidity !== 'ichi' || 'gamma' ? (
            <>
              <Button
                variant="tertiary"
                className="h-[38px] w-[90px] bg-opacity-40 items-center justify-center"
                onClick={() => {
                  if (row.liquidity !== 'ichi') {
                    handleClaim(row?.id)
                  }
                }}
              >
                <span className="text-l">Claim</span>
              </Button>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  ) : (
    <></>
  )
}

export default Strategy
