import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { Address, formatUnits, maxUint256, zeroAddress } from 'viem'
import { computePoolAddress, Pool, Position, Price, priceToClosestTick, Token } from '@cryptoalgebra/integral-sdk'
import toast, { Toaster } from 'react-hot-toast'
import debounce from 'lodash/debounce'

// instances
import { publicClient } from '@/src/library/constants/viemClient'

// hooks
import { useNotificationAdderCallback } from '@/src/state/notifications/hooks'
import { useSetToken0, useSetToken1 } from '@/src/state/liquidity/hooks'
import useActiveConnectionDetails from '@/src/library/hooks/web3/useActiveConnectionDetails'
import { usePool } from '@/src/components/Trade/Swap/Panel/usePool'

// helpers
import { getTokenAllowance } from '@/src/library/hooks/liquidity/useClassic'
import { formatNumber } from '@/src/library/utils/numbers'
import { isSupportedChain } from '@/src/library/constants/chains'
import formatNumberToView from '@/src/library/helper/format-number-to-view'

// components
import Image from 'next/image'
import TokensSelector from '@/src/components/Liquidity/Common/TokensSelector'
import SetRange from './SetRange'
import { Button } from '@/src/components/UI'
import ApproveButtons from '@/src/components/Liquidity/Common/ApproveButtons'

// models
import { IToken } from '@/src/library/types'
import { NotificationDuration, NotificationType } from '@/src/state/notifications/types'

// constants
import {
  USDB_TOKEN_ADDRESS,
  WETH_TOKEN_ADDRESS,
  USDB_TOKEN_INITIAL_STATE,
  WETH_TOKEN_INITIAL_STATE,
} from '@/src/library/constants/common-constants'
import { CL_MANAGER_ABI, ERC20_ABI } from '@/src/library/constants/abi'
import { contractAddressList } from '@/src/library/constants/contactAddresses'
import { NATIVE_ETH_LOWERCASE } from '@/src/library/Constants'
import { blast } from 'viem/chains'
import BigNumber from 'bignumber.js'
import { postEvent } from '@/src/library/utils/events'
import LoadingData from '@/src/components/Modals/LoadingData'

const ConcentratedDepositLiquidityManual = ({
  defaultPairs,
  chartPrices,
  setChartValues,
  setLoading,
}: {
  defaultPairs: IToken[]
  chartPrices: string[]
  setChartValues: (arg0: any[]) => void
  setLoading: (loading: boolean) => void
}) => {
  // common
  const addNotification = useNotificationAdderCallback()
  const { isConnected, chainId } = useActiveConnectionDetails()
  const { writeContractAsync } = useWriteContract()
  const account = useAccount()

  // (tokens)
  const setToken0 = useSetToken0()
  const setToken1 = useSetToken1()

  // states
  const [timeout, setTimeoutID] = useState<[NodeJS.Timeout | undefined, NodeJS.Timeout | undefined]>([
    undefined,
    undefined,
  ])
  const [isFirstLoading, setIsFirstLoading] = useState(false)
  const [isSecondLoading, setIsSecondLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [buttonText, setButtonText] = useState('Create Position')
  const [balanceTrigger, setBalanceTrigger] = useState(false)

  // (tokens)
  const [firstToken, setFirstToken] = useState(USDB_TOKEN_INITIAL_STATE)
  const [firstValue, setFirstValue] = useState('')
  const token1Balance = useReadContract(getBalanceReqParams(firstToken.address || USDB_TOKEN_ADDRESS))

  const [secondToken, setSecondToken] = useState(WETH_TOKEN_INITIAL_STATE)
  const [secondValue, setSecondValue] = useState('')
  const token2Balance = useReadContract(getBalanceReqParams(secondToken.address || WETH_TOKEN_ADDRESS))

  const pool = usePool(getPoolAddress())
  const [isInverse, setIsInverse] = useState(
    parseInt(firstToken.address as string) > parseInt(secondToken.address as string)
  )

  // (allowance)
  const [allowanceFirst, setAllowanceFirst] = useState(0)
  const [allowanceSecond, setAllowanceSecond] = useState(0)

  // (range picker)
  const [rangePrice1, setRangePrice1] = useState(0)
  const [rangePrice2, setRangePrice2] = useState(0)
  const [rangePrice1Text, setRangePrice1Text] = useState('0')
  const [rangePrice2Text, setRangePrice2Text] = useState('0')
  const [lowerTick, setLowerTick] = useState(0)
  const [higherTick, setHigherTick] = useState(0)
  const [ncurrentPercentage, nsetCurrentPercentage] = useState([-5, 5])
  const [shownPercentage, setShownPercentage] = useState(['5', '5'])

  // (other)
  const [slippage, setSlippage] = useState(0.05)
  const [oneSide, setOneSide] = useState('BOTH')

  useEffect(() => {
    if (chartPrices.length != 2) return

    handleRangePrices(chartPrices)
  }, [chartPrices])

  useEffect(() => {
    if (pool[0] != 'EXISTS' || !pool[1]) return
    setChartValues([pool[1]?.token0Price, rangePrice1Text, rangePrice2Text, isInverse, getPoolAddress()])
  }, [pool, rangePrice1Text, rangePrice2Text, isInverse])

  // effects
  useEffect(() => {
    const poolAddress = getPoolAddress()

    if (
      (poolAddress.toLowerCase() == '0x1d74611f3ef04e7252f7651526711a937aa1f75e' && firstToken.symbol == 'USDB') ||
      (poolAddress.toLowerCase() == '0x86d1da56fc79accc0daf76ca75668a4d98cb90a7' && firstToken.symbol == 'axlUSDC') ||
      (poolAddress.toLowerCase() == '0xc5910a7f3b0119ac1a3ad7a268cce4a62d8c882d' && firstToken.symbol == 'USD+') ||
      (poolAddress.toLowerCase() == '0xCE274E4AE83BAaDd1d3b88e1Ed24886e05ACA345' && firstToken.symbol == 'DUSD')
    ) {
      swapTokens()
    }
  }, [pool])

  useEffect(() => {
    if (pool[0] == 'LOADING') {
      setButtonText('Loading')
    } else if (pool[0] == 'NOT_EXISTS') {
      setButtonText("Pool Doesn't Exist")
      setFirstValue('0')
      setSecondValue('0')
    } else if (rangePrice2 != -1 && rangePrice1 > rangePrice2) {
      setButtonText("Min price can't be higher than max price")
    } else if (lowerTick == higherTick) {
      setButtonText('The gap between min and max price is not enough')
    } else if (
      account &&
      isConnected &&
      (Number(firstValue) > Number(formatUnits((token1Balance?.data as bigint) || 0n, firstToken?.decimals)) ||
        Number(secondValue) > Number(formatUnits((token2Balance?.data as bigint) || 0n, secondToken?.decimals)))
    ) {
      setButtonText('Insufficient balance')
    } else if (Number(firstValue) === 0 && Number(secondValue) === 0) {
      setButtonText("Amount can't be 0")
    } else {
      setButtonText('Create Position')
    }
  }, [
    rangePrice1,
    rangePrice2,
    account,
    isConnected,
    firstValue,
    secondValue,
    token1Balance,
    token2Balance,
    firstToken,
    secondToken,
    pool,
  ])

  useEffect(() => {
    setRangePrice1Text(rangePrice1.toString())
    setRangePrice2Text(rangePrice2.toString())
  }, [rangePrice1, rangePrice2])

  useEffect(() => {
    setToken0(firstToken.address)
    setToken1(secondToken.address)
  }, [firstToken, secondToken])

  useEffect(() => {
    if (pool[0] != 'EXISTS' || !pool[1]) return
    if (firstValue == '') return

    if (lowerTick < pool[1]?.tickCurrent && higherTick < pool[1]?.tickCurrent) {
      setOneSide('SECOND')
      setFirstValue('0')
      setSecondValue('0')
    } else if (lowerTick > pool[1]?.tickCurrent && higherTick > pool[1]?.tickCurrent) {
      setOneSide('FIRST')
      setFirstValue('0')
      setSecondValue('0')
    } else {
      setOneSide('BOTH')
      setSecondValue(
        isInverse
          ? getFromAmount1(
              firstValue,
              isInverse ? firstToken.decimals : secondToken.decimals,
              isInverse ? secondToken.decimals : firstToken.decimals
            )
          : getFromAmount0(
              firstValue,
              isInverse ? firstToken.decimals : secondToken.decimals,
              isInverse ? secondToken.decimals : firstToken.decimals
            )
      )
    }
  }, [firstToken, secondToken, lowerTick, higherTick, pool[0]])

  useEffect(() => {
    if (defaultPairs.length == 2) {
      setFirstToken(defaultPairs[0])
      setSecondToken(defaultPairs[1])
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [defaultPairs])

  useEffect(() => {
    if (!firstToken.address || !secondToken.address) {
      return
    }

    setIsInverse(BigInt(firstToken.address as string) > BigInt(secondToken.address as string))

    const asyncGetAllowance = async () => {
      const _allowanceFirst: any = await getTokenAllowance(
        firstToken.address as Address,
        account.address as Address,
        contractAddressList.cl_manager as Address
      )
      const _allowanceSecond: any = await getTokenAllowance(
        secondToken.address as Address,
        account.address as Address,
        contractAddressList.cl_manager as Address
      )

      setAllowanceFirst(_allowanceFirst)
      setAllowanceSecond(_allowanceSecond)
      setLoading(false)
    }

    asyncGetAllowance()
  }, [firstToken, secondToken, account.address])

  useEffect(() => {
    const asyncFn = async () => {
      if (ncurrentPercentage[0] == -1 && ncurrentPercentage[1] == -1) {
        setRangePrice1(0)
        setRangePrice2(-1)
      } else {
        setRangePrice1(Number(pool[1]?.token0Price.toFixed(10)) * (1 + ncurrentPercentage[0] / 100))
        setRangePrice2(Number(pool[1]?.token0Price.toFixed(10)) * (1 + ncurrentPercentage[1] / 100))
      }
    }

    if (pool[0] == 'EXISTS') asyncFn()
  }, [pool])

  useEffect(() => {
    const asyncFn = async () => {
      if (!pool[1]) return
      if (ncurrentPercentage[0] == -1 && ncurrentPercentage[1] == -1) {
        setLowerTick(-887220)
        setHigherTick(887220)
        setRangePrice1(0)
        setRangePrice2(-1)
        setShownPercentage(['', ''])
        setRangePrice1Text('0')
        setRangePrice2Text('-1')
      } else {
        {
          let lowerPrice0l, lowerPrice0h, lowerPrice1, newPriceL, newPriceH

          if (isInverse) {
            //20
            lowerPrice0l = BigInt(
              Number(
                (
                  Number(pool[1].token1Price.toFixed(10)) *
                  (1 + ncurrentPercentage[0] / 100) *
                  10 ** secondToken.decimals
                ).toFixed(0)
              )
            ).toString()
            lowerPrice0h = BigInt(
              Number(
                (
                  Number(pool[1].token1Price.toFixed(10)) *
                  (1 + ncurrentPercentage[1] / 100) *
                  10 ** secondToken.decimals
                ).toFixed(0)
              )
            ).toString()
            lowerPrice1 = 10 ** firstToken.decimals

            newPriceH = new Price(pool[1].token0, pool[1].token1, lowerPrice0l, lowerPrice1)

            newPriceL = new Price(pool[1].token0, pool[1].token1, lowerPrice0h, lowerPrice1)
          } else {
            lowerPrice0l = BigInt(
              Number(
                (
                  Number(pool[1].token0Price.toFixed(18)) *
                  (1 + ncurrentPercentage[0] / 100) *
                  10 ** secondToken.decimals
                ).toFixed(0)
              )
            ).toString()
            lowerPrice0h = BigInt(
              Number(
                (
                  Number(pool[1].token0Price.toFixed(18)) *
                  (1 + ncurrentPercentage[1] / 100) *
                  10 ** secondToken.decimals
                ).toFixed(0)
              )
            ).toString()
            lowerPrice1 = 10 ** firstToken.decimals

            newPriceL = new Price(pool[1].token1, pool[1].token0, lowerPrice0l, lowerPrice1)

            newPriceH = new Price(pool[1].token1, pool[1].token0, lowerPrice0h, lowerPrice1)

            newPriceL = newPriceL.invert()
            newPriceH = newPriceH.invert()
          }

          const lTick = Number(newPriceL.toFixed(18)) == 0 ? -887220 : priceToClosestTick(newPriceL)
          const lTickRounded = parseInt((lTick / 60).toString()) * 60

          const hTick = Number(newPriceH.toFixed(18)) == 0 ? -887220 : priceToClosestTick(newPriceH)
          const hTickRounded = parseInt((hTick / 60).toString()) * 60

          const range1 = Number(newPriceL.toFixed(18))
          const range2 = Number(newPriceH.toFixed(18))

          setLowerTick(lTickRounded)
          setHigherTick(hTickRounded)

          setRangePrice1(range1)
          setRangePrice2(range2)

          setRangePrice1Text(range1.toString())
          setRangePrice2Text(range2.toString())
        }
      }
    }

    if (pool[0] != 'EXISTS') return
    asyncFn()
  }, [ncurrentPercentage, pool[0]])

  // helpers
  function getPoolAddress(): Address {
    const first = (
      firstToken.address?.toLowerCase() == NATIVE_ETH_LOWERCASE ? WETH_TOKEN_ADDRESS : firstToken.address
    ) as string
    const second = (
      secondToken.address?.toLowerCase() == NATIVE_ETH_LOWERCASE ? WETH_TOKEN_ADDRESS : secondToken.address
    ) as string

    if (first === second) {
      return zeroAddress
    }

    return computePoolAddress({
      tokenA: new Token(blast.id, first, 18),
      tokenB: new Token(blast.id, second, 18),
      poolDeployer: '0x5aCCAc55f692Ae2F065CEdDF5924C8f6B53cDaa8',
      initCodeHashManualOverride: '0xf45e886a0794c1d80aeae5ab5befecd4f0f2b77c0cf627f7c46ec92dc1fa00e4',
    }) as Address
  }

  function getBalanceReqParams(address: Address) {
    return {
      abi: ERC20_ABI,
      address,
      functionName: 'balanceOf',
      args: [account.address],
    }
  }

  function handleRangePrices(value: any[]): void {
    if (pool[0] !== 'EXISTS') return

    let currentPrice = Number(pool[1]?.token0Price.toFixed(10))
    if (isInverse) currentPrice = Number(pool[1]?.token1Price.toFixed(10))

    const pricePercentage0 = ((+value[0] - currentPrice) / currentPrice) * 100
    const pricePercentage1 = ((+value[1] - currentPrice) / currentPrice) * 100

    nsetCurrentPercentage([pricePercentage0, pricePercentage1])
  }

  function handleMinMaxInput(value: any, isFirst: boolean, multiplier: number, timeoutDur: number = 500): void {
    if (pool[0] !== 'EXISTS') return
    if (timeout) clearTimeout(timeout[0])

    if (isFirst) {
      setRangePrice2Text(value)
    } else {
      setRangePrice1Text(value)
    }

    const price = +value

    const newTimeout = setTimeout(() => {
      let currentPrice = Number(pool[1]?.token0Price.toFixed(10))
      if (isInverse) currentPrice = Number(pool[1]?.token1Price.toFixed(10))

      const pricePercentage = ((price - currentPrice) / currentPrice) * 100

      if (isFirst)
        if (!isInverse) {
          nsetCurrentPercentage([ncurrentPercentage[0], pricePercentage])
        } else {
          nsetCurrentPercentage([pricePercentage, ncurrentPercentage[1]])
        }
      else if (!isInverse) {
        nsetCurrentPercentage([pricePercentage, ncurrentPercentage[1]])
      } else {
        nsetCurrentPercentage([ncurrentPercentage[0], pricePercentage])
      }
    }, timeoutDur)

    setTimeoutID([newTimeout, timeout[1]])
  }

  function swapTokens(): void {
    setFirstToken(secondToken)
    setSecondToken(firstToken)
    setFirstValue('0')
    setSecondValue('0')
    // setLoading(false)
    // console.log('loading :>> ', loading);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSetFirstValue = useCallback(
    debounce((value: string) => {
      setFirstValue(formatNumberToView(value, firstToken.decimals))
    }, 1000),
    []
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSetSecondValue = useCallback(
    debounce((value: string) => {
      setSecondValue(formatNumberToView(value, secondToken.decimals))
    }, 1000),
    []
  )

  // async helpers
  async function handleCLAdd(): Promise<void> {
    setIsLoading(true)

    const _firstToken = isInverse ? secondToken : firstToken
    const _secondToken = isInverse ? firstToken : secondToken
    const _firstValue = isInverse ? secondValue : firstValue
    const _secondValue = isInverse ? firstValue : secondValue

    const _ethValue =
      _firstToken.address?.toLowerCase() == NATIVE_ETH_LOWERCASE
        ? BigInt(Math.floor(Number(formatNumber(Number(_firstValue))) * 1e18))
        : _secondToken.address?.toLowerCase() == NATIVE_ETH_LOWERCASE
          ? BigInt(Math.floor(Number(formatNumber(Number(_secondValue))) * 1e18))
          : BigInt(0)
    _firstToken.address =
      _firstToken.address?.toLowerCase() == NATIVE_ETH_LOWERCASE ? WETH_TOKEN_ADDRESS : _firstToken.address
    _secondToken.address =
      _secondToken.address?.toLocaleLowerCase() == NATIVE_ETH_LOWERCASE ? WETH_TOKEN_ADDRESS : _secondToken.address

    writeContractAsync(
      {
        abi: CL_MANAGER_ABI,
        address: contractAddressList.cl_manager as Address,
        functionName: 'mint',
        args: [
          [
            _firstToken.address as Address,
            _secondToken.address as Address,
            lowerTick,
            higherTick,
            new BigNumber(_firstValue).multipliedBy(new BigNumber('10').pow(_firstToken.decimals)).toFixed(0),
            new BigNumber(_secondValue).multipliedBy(new BigNumber('10').pow(_secondToken.decimals)).toFixed(0),
            new BigNumber(Number(_firstValue) * (1 - slippage))
              .multipliedBy(new BigNumber('10').pow(_firstToken.decimals))
              .toFixed(0),
            new BigNumber(Number(_secondValue) * (1 - slippage))
              .multipliedBy(new BigNumber('10').pow(_secondToken.decimals))
              .toFixed(0),
            account.address as Address,
            parseInt((+new Date() / 1000).toString()) + 60 * 60,
          ],
        ],
        value: _ethValue,
      },
      {
        onSuccess: async (x) => {
          const transaction = await publicClient.waitForTransactionReceipt({ hash: x })
          if (transaction.status == 'success') {
            // aquí enviar notificación al backend, con el usuario tb
            // toast(`Added LP successfully.`)

            addNotification({
              id: crypto.randomUUID(),
              createTime: new Date().toISOString(),
              message: `Added LP successfully.`,
              notificationType: NotificationType.SUCCESS,
              txHash: transaction.transactionHash,
              notificationDuration: NotificationDuration.DURATION_5000,
            })

            setFirstValue('0')
            setSecondValue('0')
            setBalanceTrigger(!balanceTrigger)
            const valueInDollars =
              parseFloat(firstValue) * firstToken?.price + parseFloat(secondValue) * secondToken?.price
            await postEvent({
              tx: transaction.transactionHash,
              user: account.address as Address,
              event_type: 'ADD_LIQUIDITY',
              value: valueInDollars,
            })
          } else {
            toast(`Added LP TX failed, hash: ${transaction.transactionHash}`)
            addNotification({
              id: crypto.randomUUID(),
              createTime: new Date().toISOString(),
              message: `Added LP TX failed, hash: ${transaction.transactionHash}`,
              notificationType: NotificationType.ERROR,
              txHash: transaction.transactionHash,
              notificationDuration: NotificationDuration.DURATION_5000,
            })
          }
          setIsLoading(false)
        },
        onError: (e) => {
          //
          // toast(`Added LP failed. `)
          addNotification({
            id: crypto.randomUUID(),
            createTime: new Date().toISOString(),
            message: `Added LP failed.`,
            notificationType: NotificationType.ERROR,
            txHash: '',
            notificationDuration: NotificationDuration.DURATION_5000,
          })
          setIsLoading(false)
        },
      }
    )
  }

  async function handleApprove(token: Address): Promise<void> {
    setIsLoading(true)
    if (token == firstToken.address) setIsFirstLoading(true)
    if (token == secondToken.address) setIsSecondLoading(true)

    writeContractAsync(
      {
        abi: ERC20_ABI,
        address: token,
        functionName: 'approve',
        args: [contractAddressList.cl_manager, maxUint256],
      },
      {
        onSuccess: async (x) => {
          const transaction = await publicClient.waitForTransactionReceipt({ hash: x })
          if (transaction.status == 'success') {
            // toast(`Approved Successfully`)
            addNotification({
              id: crypto.randomUUID(),
              createTime: new Date().toISOString(),
              message: `Approved Successfully.`,
              notificationType: NotificationType.SUCCESS,
              txHash: transaction.transactionHash,
              notificationDuration: NotificationDuration.DURATION_5000,
            })
          } else {
            // toast(`Approve TX failed, tx: ${transaction.transactionHash}`)
            addNotification({
              id: crypto.randomUUID(),
              createTime: new Date().toISOString(),
              message: `Approve TX failed, tx: ${transaction.transactionHash}`,
              notificationType: NotificationType.ERROR,
              txHash: transaction.transactionHash,
              notificationDuration: NotificationDuration.DURATION_5000,
            })
          }

          const _allowanceFirst: any = await getTokenAllowance(
            firstToken.address as Address,
            account.address as Address,
            contractAddressList.cl_manager as Address
          )
          const _allowanceSecond: any = await getTokenAllowance(
            secondToken.address as Address,
            account.address as Address,
            contractAddressList.cl_manager as Address
          )

          setAllowanceFirst(_allowanceFirst)
          setAllowanceSecond(_allowanceSecond)
          setIsLoading(false)
          setIsFirstLoading(false)
          setIsSecondLoading(false)
        },
        onError: (e) => {
          // toast(`Approve failed.`)
          addNotification({
            id: crypto.randomUUID(),
            createTime: new Date().toISOString(),
            message: `Approve failed.`,
            notificationType: NotificationType.ERROR,
            txHash: '',
            notificationDuration: NotificationDuration.DURATION_5000,
          })
          setIsLoading(false)
          setIsFirstLoading(false)
          setIsSecondLoading(false)
        },
      }
    )
  }

  const getFromAmount0 = (value: any, dec1: any, dec2: any) => {
    const x = Position.fromAmount0({
      pool: pool[1] as unknown as Pool,
      tickLower: lowerTick,
      tickUpper: higherTick,
      amount0: BigInt(Number((parseFloat(value) * 10 ** dec1).toFixed(0))).toString(),
      useFullPrecision: false,
    })
    return x.amount1.toFixed(parseInt(+dec1 < +dec2 ? dec1 : dec2))
  }

  function getFromAmount1(value: any, dec1: any, dec2: any): string {
    return Position.fromAmount1({
      pool: pool[1] as unknown as Pool,
      tickLower: lowerTick,
      tickUpper: higherTick,
      amount1: BigInt(Number((parseFloat(value) * 10 ** dec1).toFixed(0))).toString(),
    }).amount0.toFixed(parseInt(dec2))
  }

  async function handleOnTokenValueChange(input: string, token: IToken): Promise<void> {
    if (pool[0] != 'EXISTS') {
      return
    }
    const inputAmount = parseFloat(input)

    if (firstToken.address === token.address) {
      if (inputAmount) {
        setSecondValue((isInverse ? getFromAmount1 : getFromAmount0)(input, firstToken.decimals, secondToken.decimals))
      } else {
        setSecondValue('')
      }

      setFirstValue(input == '' ? '0' : input)
      debounceSetFirstValue(input)
    } else {
      if (inputAmount) {
        setFirstValue((isInverse ? getFromAmount0 : getFromAmount1)(input, secondToken.decimals, firstToken.decimals))
      } else {
        setFirstValue('')
      }

      setSecondValue(input == '' ? '0' : input)
      debounceSetSecondValue(input)
    }
  }

  return (
    <>
      <div>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
      <SetRange
        shownPercentage={shownPercentage}
        currentPercentage={ncurrentPercentage}
        setCurrentPercentage={nsetCurrentPercentage}
        price1={rangePrice1} //isInverse ? 1 / rangePrice1 : rangePrice1}
        price2={rangePrice2} //isInverse ? 1 / rangePrice2 : rangePrice2}
        token1={firstToken}
        token2={secondToken}
        multiplier={1}
        handleMinMaxInput={handleMinMaxInput}
        isInverse={isInverse}
        swapTokens={swapTokens}
        price1text={rangePrice1Text}
        price2text={rangePrice2Text}
      />
      <div className="bg-shark-400 bg-opacity-40 py-[11px] px-[19px] flex items-center justify-between gap-2.5 border border-shark-950 rounded-[10px] mb-2.5 max-md:items-start">
        <div>
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="flex items-center flex-shrink-0">
              <Image
                src={`/static/images/tokens/${firstToken.symbol}.svg`}
                alt="token"
                className="rounded-full max-md:w-5 max-md:h-5"
                width={30.5}
                height={30.5}
              />
              <Image
                src={`/static/images/tokens/${secondToken.symbol}.svg`}
                alt="token"
                className="-ml-2.5 md:-ml-4 rounded-full max-md:w-5 max-md:h-5"
                width={30.5}
                height={30.5}
              />
            </div>
            <div className="flex flex-col gap-px">
              <h5 className="text-xs md:text-sm text-white leading-normal font-medium">
                {firstToken.symbol} / {secondToken.symbol}
              </h5>
            </div>
          </div>
          <div className="flex items-center text-xs leading-normal max-md:flex-wrap gap-[5px]">
            <div className="text-white">Current Pool Price:</div>
            <div className="flex items-center gap-2.5">
              <p className="flex gap-[5px] items-center text-shark-100 flex-shrink-0">
                {/* <Image src={firstToken.img} alt="token" className="w-5 h-5 rounded-full" width={20} height={20} /> */}
                <span>
                  {isInverse ? Number(pool[1]?.token1Price.toFixed(6)) : Number(pool[1]?.token0Price.toFixed(6))}{' '}
                  {`${secondToken.symbol} per ${firstToken.symbol} ≈ `}
                  {!isInverse ? Number(pool[1]?.token1Price.toFixed(6)) : Number(pool[1]?.token0Price.toFixed(6))}{' '}
                  {`${firstToken.symbol} per ${secondToken.symbol}`}
                </span>
              </p>
              <p className="flex gap-[5px] items-center text-shark-100 flex-shrink-0"></p>
            </div>
          </div>
        </div>
      </div>

      <TokensSelector
        firstToken={firstToken}
        secondToken={secondToken}
        firstValue={firstValue}
        secondValue={secondValue}
        setFirstToken={(token) => setFirstToken(token)}
        setSecondToken={(token) => setSecondToken(token)}
        setFirstValue={(value) => setFirstValue(value)}
        setSecondValue={(value) => setSecondValue(value)}
        onTokenValueChange={handleOnTokenValueChange}
        balanceTrigger={balanceTrigger}
      />
      {!isConnected || !isSupportedChain(chainId) ? (
        <Button
          walletConfig={{
            needSupportedChain: true,
            needWalletConnected: true,
          }}
          className="w-full"
        >
          Connect Wallet
        </Button>
      ) : (
        <ApproveButtons
          shouldApproveFirst={Number(allowanceFirst) / 10 ** firstToken.decimals < Number(firstValue)}
          shouldApproveSecond={Number(allowanceSecond) / 10 ** secondToken.decimals < Number(secondValue)}
          token0={firstToken}
          token1={secondToken}
          handleApprove={handleApprove}
          mainFn={buttonText == 'Create Position' ? handleCLAdd : () => {}}
          mainText={buttonText}
          disabled={!(+firstValue && !isNaN(+firstValue) && +secondValue && !isNaN(+secondValue))}
          isLoading={buttonText == 'Loading' || isLoading}
          isFirstLoading={isFirstLoading}
          isSecondLoading={isSecondLoading}
        />
      )}
    </>
  )
}

export default ConcentratedDepositLiquidityManual
