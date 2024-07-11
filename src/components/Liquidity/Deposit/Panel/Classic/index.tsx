import { useCallback, useEffect, useState } from 'react'
import { Address, formatUnits, parseUnits, zeroAddress } from 'viem'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Toaster } from 'react-hot-toast'
import debounce from 'lodash/debounce';

// instances
import { publicClient } from '@/src/library/constants/viemClient'

// store
import { useDispatch } from 'react-redux'
import { AppThunkDispatch, useAppSelector } from '@/src/state'
import { getLiquidityTableElements } from '@/src/state/liquidity/thunks'

// hooks
import {
  getLiquidityRemoveQuote,
  getPair,
  getTokenAllowance,
  getTokenReserve,
} from '@/src/library/hooks/liquidity/useClassic'
import { useNotificationAdderCallback } from '@/src/state/notifications/hooks'
import useActiveConnectionDetails from '@/src/library/hooks/web3/useActiveConnectionDetails'

// helpers
import { formatDollarAmount, toBN } from '@/src/library/utils/numbers'
import { fetchTokens } from '@/src/library/common/getAvailableTokens'
import { postEvent } from '@/src/library/utils/events';

// components
import Image from 'next/image'
import { Button } from '@/src/components/UI'
import Loader from '@/src/components/UI/Icons/Loader'
import TokensSelector from '@/src/components/Liquidity/Common/TokensSelector'
import ExchangeBox from '@/src/components/Liquidity/Common/ExchangeBox'
import Separator from '@/src/components/Trade/Common/Separator'
import ApproveButtonClassic from '../../../Common/ApproveButtonsClassic'
import formatNumberToView from '@/src/library/helper/format-number-to-view';

// models
import { NotificationDuration, NotificationType } from '@/src/state/notifications/types'
import { IToken } from '@/src/library/types'

// constants
import {
  USDB_TOKEN_ADDRESS,
  USDB_TOKEN_INITIAL_STATE, WETH_TOKEN_ADDRESS,
  WETH_TOKEN_INITIAL_STATE
} from '@/src/library/constants/common-constants';
import { ERC20_ABI, ROUTERV2_ABI } from '@/src/library/constants/abi'
import { contractAddressList } from '@/src/library/constants/contactAddresses'

const Classic = ({
  depositType,
  defaultPairs,
  setLoading
}: {
  depositType: 'VOLATILE' | 'STABLE' | 'CONCENTRATED_AUTOMATIC' | 'CONCENTRATED_MANUAL'
  defaultPairs: IToken[]
  setLoading: (loading: boolean) => void
}) => {
  // common
  const router = useRouter()
  const pathname = usePathname()
  const account = useAccount()
  const searchParams = useSearchParams()
  const addNotification = useNotificationAdderCallback()
  const { writeContractAsync } = useWriteContract()
  const { isConnected } = useActiveConnectionDetails()

  // (store)
  const dispatch = useDispatch<AppThunkDispatch>()
  const pairs = useAppSelector((state) => state.liquidity.v2Pairs.tableData)

  // state
  const [optionActive, setOptionActive] = useState<'ADD' | 'WITHDRAW' | 'STAKE' | 'UNSTAKE'>('ADD')
  const [openSelectToken, setOpenSelectToken] = useState<boolean>(false)
  const [buttonText, setButtonText] = useState('Add Liquidity')
  const [timeout, setTimeoutID] = useState<NodeJS.Timeout | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)

  // (tokens)
  const [firstToken, setFirstToken] = useState(USDB_TOKEN_INITIAL_STATE)
  const [firstValue, setFirstValue] = useState('')
  const [secondToken, setSecondToken] = useState(WETH_TOKEN_INITIAL_STATE)
  const [secondValue, setSecondValue] = useState('')
  const [firstReserve, setFirstReserve] = useState(0)
  const [secondReserve, setSecondReserve] = useState(0)
  const [pairAddress, setPairAddress] = useState(zeroAddress)
  const token1Balance = useReadContract(getBalanceReqParams(firstToken.address || USDB_TOKEN_ADDRESS))
  const token2Balance = useReadContract(getBalanceReqParams(secondToken.address || WETH_TOKEN_ADDRESS))

  // (lp and allowance)
  const [lpValue, setLpValue] = useState('')
  const [allowanceFirst, setallowanceFirst] = useState('')
  const [allowanceSecond, setallowanceSecond] = useState('')
  const [allowanceLp, setallowanceLp] = useState('')
  const [lpBalance, setlpBalance] = useState(0n)
  const [shouldApproveFirst, setShouldApproveFirst] = useState(true)
  const [shouldApproveSecond, setShouldApproveSecond] = useState(true)
  const [shouldApprovePair, setShouldApprovePair] = useState(true)
  const lpTokenBalance = useReadContract({ ...getBalanceReqParams(pairAddress), query: { refetchInterval: 1500 } })

  // effects
  const updateTokenPrice = useCallback((data: any[], symbol: string) => {
    const foundToken = data.find((token) => token.basetoken.symbol === symbol)
    return foundToken ? foundToken.priceUSD : null
  }, [])
  useEffect(() => {
    const fetchTokenPrices = async () => {
      try {
        if (account.chainId) {
          const data = await fetchTokens(account.chainId)

          const token0price = updateTokenPrice(data, 'USDB')
          if (token0price !== null && firstToken?.symbol === 'USDB')
            setFirstToken((prev) => ({ ...prev, price: token0price }))

          const token1price = updateTokenPrice(data, 'WETH')
          if (token1price !== null && secondToken?.symbol === 'WETH')
            setSecondToken((prev) => ({ ...prev, price: token1price }))
        }
      } catch (error) {
        console.error('Failed to fetch token prices:', error)
      }
    }

    fetchTokenPrices()
  }, [updateTokenPrice, account.chainId])

  useEffect(() => {
    if (account.chainId && account.address) dispatch(getLiquidityTableElements({ address: account.address, chainId: account.chainId }))
    const params = new URLSearchParams(searchParams.toString())
    params.set('token0', firstToken.address as string)
    params.set('token1', secondToken.address as string)
    router.push(pathname + '?' + params.toString(), { scroll: false })
  }, [firstToken.address, secondToken.address])

  useEffect(() => {
    setlpBalance((lpTokenBalance?.data as bigint) || 0n)
  }, [lpTokenBalance])

  useEffect(() => {
    if (defaultPairs?.length == 2) {
      setFirstToken(defaultPairs[0])
      setSecondToken(defaultPairs[1])
      setIsLoading(false)
    }

    if (
      account &&
      isConnected &&
      (Number(firstValue) > Number(formatUnits((token1Balance?.data as bigint) || 0n, firstToken?.decimals)) ||
        Number(secondValue) > Number(formatUnits((token2Balance?.data as bigint) || 0n, secondToken?.decimals)))
    ) {
      setButtonText('Insufficient balance')
    } else if(Number(firstValue) === 0 && Number(secondValue) === 0) {
      setButtonText("Amount can't be 0")
    } else {
      setButtonText('Create Position')
    }
  }, [defaultPairs, firstValue, secondValue, firstToken, secondToken, account.address, isConnected])


  useEffect(() => {
    const asyncGetReserve = async () => {
      const reserve: any = await getTokenReserve(
        firstToken.address as Address,
        secondToken.address as Address,
        depositType === 'STABLE'
      )

      if (reserve[0] == 0 || reserve[1] == 0) {
        setFirstReserve(1)
        setSecondReserve(1)
      } else {
        setFirstReserve(reserve[0])
        setSecondReserve(reserve[1])
      }
    }

    const asyncGetPair = async () => {
      const pair: any = await getPair(
        firstToken.address as Address,
        secondToken.address as Address,
        depositType === 'STABLE'
      )

      if (pair != '0x0') setPairAddress(pair)
      else setPairAddress(zeroAddress)
    }

    asyncGetReserve()
    asyncGetPair()
  }, [firstToken, secondToken, depositType, pairAddress])

  useEffect(() => {
    const asyncGetAllowance = async () => {
      const allowanceFirst: string = await getTokenAllowance(
        firstToken.address as Address,
        account.address as Address,
        contractAddressList.v2router as Address
      )
      const allowanceSecond: string = await getTokenAllowance(
        secondToken.address as Address,
        account.address as Address,
        contractAddressList.v2router as Address
      )
      const allowanceLp: string =
        pairAddress != zeroAddress
          ? await getTokenAllowance(
            pairAddress as Address,
            account.address as Address,
            contractAddressList.v2router as Address
          )
          : '0'

      setallowanceFirst(allowanceFirst.toString())
      setallowanceSecond(allowanceSecond.toString())
      setallowanceLp(allowanceLp.toString())
      setShouldApproveFirst(allowanceFirst == '0')
      setShouldApproveSecond(allowanceSecond == '0')
      setShouldApprovePair(allowanceLp == '0')
      setLoading(false)
    }

    asyncGetAllowance()
  }, [firstToken, secondToken, account.address, pairAddress])


  // helpers
  function handlerOption(option: 'ADD' | 'WITHDRAW' | 'STAKE' | 'UNSTAKE'): void {
    setOptionActive(option)
    setFirstValue('')
    setSecondValue('')
  }

  function getBalanceReqParams(address: Address) {
    return {
      abi: ERC20_ABI,
      address,
      functionName: 'balanceOf',
      args: [account.address],
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSetFirstValue = useCallback(debounce((value: string) => {
    setFirstValue(formatNumberToView(value, firstToken.decimals))
  }, 1000), [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSetSecondValue = useCallback(debounce((value: string) => {
    setSecondValue(formatNumberToView(value, secondToken.decimals))
  }, 1000), [])

  function handleOnTokenValueChange(input: string, token: IToken): void {
    if (optionActive == 'ADD') {
      // TODO: handle if pair is not created

      const inputAmount = parseFloat(input)

      if (firstToken.address === token.address) {
        if (inputAmount) {
          setSecondValue(
            (
              (inputAmount * Number(secondReserve === 0 ? 1 : secondReserve)) /
              Number(firstReserve === 0 ? 1 : firstReserve)
            ).toString()
          )
        }
        else {
          setSecondValue('')
        }

        setFirstValue(input == '' ? '0' : input)
        debounceSetFirstValue(input)
      } else {
        if (inputAmount)
          setFirstValue(
            (
              (inputAmount * Number(firstReserve === 0 ? 1 : firstReserve)) /
              Number(secondReserve === 0 ? 1 : secondReserve)
            ).toString()
          )
        else {
          setFirstValue('')
        }

        setSecondValue(input == '' ? '0' : input)
        debounceSetSecondValue(input)
      }
    }
  }

  function handleOnLPTokenValueChange(input: string, token: IToken): void {
    // console.log('inn2', input, parseFloat(input) != 0 ? parseFloat(input).toString() : input, parseUnits(input, 18))
    setLpValue(input)

    if (optionActive == 'WITHDRAW') {
      const asyncGetWithdrawTokens = async () => {
        const tokens: any = await getLiquidityRemoveQuote(
          Number(input),
          firstToken.address as Address,
          secondToken.address as Address,
          depositType === 'STABLE'
        )
        setFirstValue((Number(tokens[0]) / 1e18).toFixed(18).toString())
        setSecondValue((Number(tokens[1]) / 1e18).toString())
      }

      asyncGetWithdrawTokens()
    }
  }

  async function handleAddLiquidity(): Promise<void> {
    setIsLoading(true)
    await writeContractAsync(
      {
        abi: ROUTERV2_ABI,
        address: contractAddressList.v2router as Address,
        functionName: 'addLiquidity',
        args: [
          firstToken.address as Address,
          secondToken.address as Address,
          depositType === 'STABLE',
          parseUnits(firstValue, firstToken?.decimals),
          parseUnits(secondValue, secondToken?.decimals),
          0,
          0,
          account.address as Address,
          parseInt((+new Date() / 1000).toString()) + 60 * 60,
        ],
      },

      {
        onSuccess: async (x) => {
          setIsLoading(true)
          const transaction = await publicClient.waitForTransactionReceipt({ hash: x })

          addNotification({
            id: crypto.randomUUID(),
            createTime: new Date().toISOString(),
            message: `Added LP successfully.`,
            notificationType: NotificationType.SUCCESS,
            txHash: transaction.transactionHash,
            notificationDuration: NotificationDuration.DURATION_5000,
          })

          setIsLoading(false)
          await postEvent({
            tx: transaction.transactionHash,
            user: account.address as string,
            event_type: 'ADD_LIQUIDITY',
            value:
              toBN(firstValue).multipliedBy(firstToken?.price).toNumber() +
              toBN(secondValue).multipliedBy(secondToken?.price).toNumber(),
          })
        },
        onError: (e) => {
          // toast(`Add LP failed. ${e}`)
          addNotification({
            id: crypto.randomUUID(),
            createTime: new Date().toISOString(),
            message: `Add LP failed. ${e}`,
            notificationType: NotificationType.ERROR,
            txHash: '',
            notificationDuration: NotificationDuration.DURATION_5000,
          })
          setIsLoading(false)
        },
      }
    )
  }

  async function handleRemoveLiquidity(): Promise<void> {
    setIsLoading(true)

    writeContractAsync(
      {
        abi: ROUTERV2_ABI,
        address: contractAddressList.v2router as Address,
        functionName: 'removeLiquidity',
        args: [
          firstToken.address as Address,
          secondToken.address as Address,
          depositType === 'STABLE',
          parseUnits(lpValue.toString(), 18),
          0,
          0,
          account.address as Address,
          parseInt((+new Date() / 1000).toString()) + 60 * 60,
        ],
      },

      {
        onSuccess: async (x) => {
          setIsLoading(true)
          const transaction = await publicClient.waitForTransactionReceipt({ hash: x })

          addNotification({
            id: crypto.randomUUID(),
            createTime: new Date().toISOString(),
            message: `Added successfully.`,
            notificationType: NotificationType.SUCCESS,
            txHash: transaction.transactionHash,
            notificationDuration: NotificationDuration.DURATION_5000,
          })
          setIsLoading(false)
        },
        onError: (e) => {
          setIsLoading(false)
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

  async function handleApprove(token: Address, amount: string): Promise<void> {
    setIsLoading(true)
    writeContractAsync(
      {
        abi: ERC20_ABI,
        address: token,
        functionName: 'approve',
        args: [contractAddressList.v2router, amount],
      },
      {
        onSuccess: async (x) => {
          setIsLoading(true)
          const transaction = await publicClient.waitForTransactionReceipt({ hash: x })
          if (transaction.status == 'success') {
            // toast(`Approved Successfully`)
            addNotification({
              id: crypto.randomUUID(),
              createTime: new Date().toISOString(),
              message: `Approved Successfully`,
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

          const allowanceFirst: any = await getTokenAllowance(
            firstToken.address as Address,
            account.address as Address,
            contractAddressList.v2router as Address
          )
          const allowanceSecond: any = await getTokenAllowance(
            secondToken.address as Address,
            account.address as Address,
            contractAddressList.v2router as Address
          )
          const allowanceLp: any =
            pairAddress != zeroAddress
              ? await getTokenAllowance(
                  pairAddress as Address,
                  account.address as Address,
                  contractAddressList.v2router as Address
                )
              : {}
          setallowanceFirst(allowanceFirst.toString())
          setallowanceSecond(allowanceSecond.toString())
          setallowanceLp(allowanceLp.toString())
          setShouldApproveFirst(allowanceFirst == '0')
          setShouldApproveSecond(allowanceSecond == '0')
          setShouldApprovePair(allowanceLp == '0')
          setIsLoading(false)
        },
        onError: (e) => {
          // toast(`Approve failed. ${e}`)
          addNotification({
            id: crypto.randomUUID(),
            createTime: new Date().toISOString(),
            message: `Approve failed. ${e}`,
            notificationType: NotificationType.ERROR,
            txHash: '',
            notificationDuration: NotificationDuration.DURATION_5000,
          })
          setIsLoading(false)
        },
      }
    )
  }

  return (
    <>
      <div>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
      <div className="mb-2.5 flex items-center justify-between gap-1.5 rounded-[10px] border border-shark-950 bg-shark-400 bg-opacity-40 px-[10px] py-[11px] max-md:items-start sm:gap-2.5 sm:px-[19px]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex flex-shrink-0 items-center">
              <Image
                src={`/static/images/tokens/${firstToken.symbol}.svg`}
                alt="token"
                className="rounded-full max-md:h-5 max-md:w-5"
                width={30.5}
                height={30.5}
              />
              <Image
                src={`/static/images/tokens/${secondToken.symbol}.svg`}
                alt="token"
                className="-ml-2.5 rounded-full max-md:h-5 max-md:w-5 md:-ml-4"
                width={30.5}
                height={30.5}
              />
            </div>
            <div className="flex flex-col gap-px">
              <h5 className="text-xs font-medium leading-normal text-white md:text-sm">
                {firstToken.symbol} / {secondToken.symbol}
              </h5>
              <div className="flex items-center gap-[5px] max-md:flex-wrap">
                {/* {'VOLATILE' === depositType ? (
                  <Button variant="tertiary" className="h-[28px] flex-shrink-0 !px-1 !py-1 max-md:!text-xs">
                    Volatile Pool
                  </Button>
                ) : 'CONCENTRATED_AUTOMATIC' === depositType || 'CONCENTRATED_MANUAL' === depositType ? (
                  <Button
                    variant="tertiary"
                    className="!border-1 h-[28px] flex-shrink-0 !border !border-solid !border-green-400 !bg-green-500 !bg-opacity-40 !py-1 hover:!border-none max-md:!text-xs"
                  >
                    Concentrated
                  </Button>
                ) : 'STABLE' === depositType ? (
                  <Button variant="tertiary" className="h-[28px] flex-shrink-0 !px-5 !py-0 max-md:!text-xs">
                    Stable Pool
                  </Button>
                ) : null} */}

                {/* <Button
                  variant="tertiary"
                  className="h-[28px] flex-shrink-0 !border-opacity-100 !bg-shark-300 !bg-opacity-40 !px-5 !py-0 max-md:!text-xs [&:not(:hover)]:border-shark-200"
                >
                  {
                    pairs?.find(
                      (pair: LiquidityTableElement) => pair?.pairAddress?.toLowerCase() === pairAddress.toLowerCase()
                    )?.fee
                  }{' '}
                  %
                </Button> */}
                {/* <Button
                  variant="tertiary"
                  className="!p-0 h-[28px] w-[33px] !border-opacity-100 [&:not(:hover)]:border-shark-200 !bg-shark-300 !bg-opacity-40 max-md:!text-xs flex-shrink-0"
                >
                  <span className="icon-info"></span>
                </Button> */}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-[5px] text-xs leading-normal">
            {/* <div className="flex items-center text-xs leading-normal max-md:flex-wrap gap-[5px]"> */}
            {/* <div className="text-white">Liquidity</div>
            <div className="flex items-center gap-2.5">
              <p className="flex flex-shrink-0 items-center gap-[5px] text-shark-100">
                <Image
                  src={`/static/images/tokens/${firstToken.symbol}.svg`}
                  alt="token"
                  className="h-5 w-5 rounded-full"
                  width={20}
                  height={20}
                />
                <span>{formatNumber(Number(firstReserve) / 1e18, 8)}</span>
              </p>
              <p className="flex flex-shrink-0 items-center gap-[5px] text-shark-100">
                <Image
                  src={`/static/images/tokens/${secondToken.symbol}.svg`}
                  alt="token"
                  className="h-5 w-5 rounded-full"
                  width={20}
                  height={20}
                />
                <span>{formatNumber(Number(secondReserve) / 1e18, 8)}</span>
              </p>
            </div> */}
          </div>
        </div>

        <div className="text-xs leading-normal text-white">
          {/* <div className="text-right md:mb-[5px]">APR</div> */}

          {/* <p className="border-1 rounded-[10px] border border-solid border-shark-300 bg-shark-400 bg-opacity-40 px-5 py-[5px]">
            {
              pairs?.find(
                (pair: LiquidityTableElement) => pair?.pairAddress?.toLowerCase() === pairAddress.toLowerCase()
              )?.apr
            }{' '}
            %
          </p> */}
        </div>
      </div>
      <div className="mb-2.5 flex flex-wrap gap-1.5 rounded-[10px] border border-shark-950 bg-shark-400 bg-opacity-40 p-[13px] md:gap-2.5 md:px-[19px] md:py-[11px]">
        <Button
          onClick={() => handlerOption('ADD')}
          className="mx-auto h-[38px] flex-1 !text-xs"
          variant={optionActive === 'ADD' ? 'primary' : 'secondary'}
        >
          Add
        </Button>
        <Button
          onClick={() => handlerOption('WITHDRAW')}
          className="mx-auto h-[38px] flex-1 !text-xs"
          variant={optionActive === 'WITHDRAW' ? 'primary' : 'secondary'}
        >
          Withdraw
        </Button>
        {/* <Button
          onClick={() => handlerOption('STAKE')}
          className="flex-1 h-[38px] mx-auto !text-xs"
          variant={optionActive === 'STAKE' ? 'primary' : 'secondary'}
        >
          STAKE
        </Button>
        <Button
          onClick={() => handlerOption('UNSTAKE')}
          className="flex-1 h-[38px] mx-auto !text-xs"
          variant={optionActive === 'UNSTAKE' ? 'primary' : 'secondary'}
        >
          UNSTAKE
        </Button> */}
      </div>
      <div className="relative flex flex-col gap-1">
        {optionActive === 'WITHDRAW' && (
          <>
            <div className="mb-3">
              {
                // TODO: handle LP tokens list
              }

              <ExchangeBox
                value={lpValue}
                token={
                  {
                    name: `${firstToken.symbol}/${secondToken.symbol} LP`,
                    symbol: `${firstToken.symbol}/${secondToken.symbol} LP`,
                    id: 0,
                    decimals: 18,
                    address: pairAddress as Address,
                    img: '/static/images/tokens/FNX.svg',
                  } as IToken
                }
                onOpenModal={() => setOpenSelectToken(true)}
                variant="primary"
                onTokenValueChange={handleOnLPTokenValueChange}
                setValue={() => {}}
                option={optionActive}
              />

              {/* <SelectToken openModal={openSelectToken} setOpenModal={setOpenSelectToken} setToken={setFirstToken} /> */}
            </div>
            <Separator single />
          </>
        )}
        {optionActive === 'STAKE' && (
          <>
            <div className="mb-3">
              <div className="exchange-box-x1">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-medium text-white">Stake LP</p>
                  <p className="items-cente flex w-full justify-end gap-6 text-sm text-shark-100 xl:w-3/5 xl:justify-between xl:gap-0">
                    <span className="ml-3">
                      {firstToken?.price && formatDollarAmount(toBN(lpValue).multipliedBy(firstToken?.price))}
                    </span>
                    <div>
                      <span className="icon-wallet mr-2 text-xs"></span>
                      <span>
                        {/* Available: {`${formatNumber(Number(balance) / 10 ** token.decimals, 8)}`} {token.symbol} */}
                        Available: 0 {firstToken.symbol}/{secondToken.symbol}
                      </span>
                    </div>
                  </p>
                </div>
                <div className="flex flex-col items-center gap-3 xl:flex-row">
                  <div className="relative w-full xl:w-2/5">
                    <div className="flex h-[50px] items-center justify-between rounded-lg bg-shark-400 bg-opacity-40 px-4 text-white">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          <Image
                            src={`/static/images/tokens/FNX.png`}
                            alt="token"
                            className="h-7 w-7 rounded-full"
                            width={20}
                            height={20}
                          />
                          <Image
                            src={`/static/images/tokens/WETH.png`}
                            alt="token"
                            className="-ml-4 h-7 w-7 rounded-full"
                            width={20}
                            height={20}
                          />
                        </div>
                        <span className="text-base">
                          {firstToken.symbol}/{secondToken.symbol}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="relative w-full xl:w-3/5">
                    <input
                      value={0}
                      className="h-[50px] w-full rounded-lg border border-shark-400 bg-shark-400 bg-opacity-40 px-3 text-sm text-white outline-none"
                      placeholder="0.0"
                      onChange={(input) => console.log(input)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {optionActive === 'UNSTAKE' && (
          <>
            <div className="mb-3">
              <div className="exchange-box-x1">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-medium text-white">Unstake LP</p>
                  <p className="items-cente flex w-full justify-end gap-6 text-sm text-shark-100 xl:w-3/5 xl:justify-between xl:gap-0">
                    <span className="ml-3">
                      {firstToken?.price && formatDollarAmount(toBN(lpValue).multipliedBy(firstToken?.price))}
                    </span>
                    <div>
                      <span className="icon-wallet mr-2 text-xs"></span>
                      <span>
                        {/* Available: {`${formatNumber(Number(balance) / 10 ** token.decimals, 8)}`} {token.symbol} */}
                        Available: 0 {firstToken.symbol}/{secondToken.symbol}
                      </span>
                    </div>
                  </p>
                </div>
                <div className="flex flex-col items-center gap-3 xl:flex-row">
                  <div className="relative w-full xl:w-2/5">
                    <div className="flex h-[50px] items-center justify-between rounded-lg bg-shark-400 bg-opacity-40 px-4 text-white">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          <Image
                            src={`/static/images/tokens/FNX.png`}
                            alt="token"
                            className="h-7 w-7 rounded-full"
                            width={20}
                            height={20}
                          />
                          <Image
                            src={`/static/images/tokens/WETH.png`}
                            alt="token"
                            className="-ml-4 h-7 w-7 rounded-full"
                            width={20}
                            height={20}
                          />
                        </div>
                        <span className="text-base">
                          {firstToken.symbol}/{secondToken.symbol}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="relative w-full xl:w-3/5">
                    <input
                      value={0}
                      className="h-[50px] w-full rounded-lg border border-shark-400 bg-shark-400 bg-opacity-40 px-3 text-sm text-white outline-none"
                      placeholder="0.0"
                      // onChange={(input) => console.log(input)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {optionActive == 'ADD' ? (
          <TokensSelector
            firstToken={firstToken}
            setFirstToken={setFirstToken}
            firstValue={firstValue}
            setFirstValue={setFirstValue}
            secondToken={secondToken}
            setSecondToken={setSecondToken}
            secondValue={secondValue}
            setSecondValue={setSecondValue}
            onTokenValueChange={handleOnTokenValueChange}
            option={'ADD'}
          />
        ) : optionActive == 'WITHDRAW' ? (
          <TokensSelector
            firstToken={firstToken}
            setFirstToken={setFirstToken}
            firstValue={firstValue}
            setFirstValue={setFirstValue}
            secondToken={secondToken}
            setSecondToken={setSecondToken}
            secondValue={secondValue}
            setSecondValue={setSecondValue}
            onTokenValueChange={handleOnTokenValueChange}
            option={'WITHDRAWINN'}
          />
        ) : null}
      </div>

      {optionActive == 'ADD' ? (
        <>
          {' '}
          {pairAddress != '0x0000000000000000000000000000000000000000' ? (
            <ApproveButtonClassic
              shouldApproveFirst={shouldApproveFirst}
              shouldApproveSecond={shouldApproveSecond}
              allowanceFirst={allowanceFirst}
              allowanceSecond={allowanceSecond}
              token0={firstToken}
              token1={secondToken}
              firstValue={firstValue}
              secondValue={secondValue}
              handleApprove={handleApprove}
              mainFn={handleAddLiquidity}
              mainText={buttonText}
              isLoading={isLoading}
              disabled={buttonText === 'Insufficient balance'
                || !((+firstValue && !isNaN(+firstValue)) || (+secondValue && !isNaN(+secondValue)))}
            />
          ) : (
            <Button
              className="mx-auto !h-[49px] w-full !text-xs"
              variant="tertiary"
              disabled={pairAddress == '0x0000000000000000000000000000000000000000'}
            >
              Pair not created yet
            </Button>
          )}
        </>
      ) : null}
      {optionActive == 'WITHDRAW' ? (
        <>
          {' '}
          <Button
            className="mx-auto !h-[49px] w-full !text-xs"
            variant="tertiary"
            disabled={
              pairAddress == '0x0000000000000000000000000000000000000000'
              || Number(lpBalance) / 10 ** 18 < Number(lpValue)
              || !(+lpValue && !isNaN(+lpValue))
            }
            onClick={() => {
              Number(formatUnits(BigInt(allowanceLp), 18)) < Number(lpValue.toString())
                ? handleApprove(pairAddress as Address, parseUnits(lpValue.toString(), 18).toString())
                : handleRemoveLiquidity()
            }}
          >
            {pairAddress == '0x0000000000000000000000000000000000000000' ? (
              'Pair not created yet'
            ) : isLoading ? (
              <Loader color="white" size={20} />
            ) : Number(lpBalance) / 10 ** 18 < Number(lpValue) ? (
              'Insufficient LP'
            ) : Number(formatUnits(BigInt(allowanceLp), 18)) < Number(lpValue.toString()) ? (
              'Approve LP'
            ) : (
              'Remove Liquidity'
            )}
          </Button>
        </>
      ) : null}
      {/* <Button
        className="w-full mx-auto !text-xs !h-[49px]"
        variant="tertiary"
        onClick={() => {
          optionActive == 'ADD'
            ? shouldApproveFirst
              ? handleApprove(firstToken.address as Address)
              : shouldApproveSecond
                ? handleApprove(secondToken.address as Address)
                : handleAddLiquidity()
            : shouldApprovePair
              ? handleApprove(pairAddress as Address)
              : handleRemoveLiquidity()
        }}
      >
        {optionActive == 'STAKE'
          ? 'STAKE'
          : optionActive == 'UNSTAKE'
            ? 'UNSTAKE'
            : optionActive == 'ADD'
              ? shouldApproveFirst
                ? `Approve ${firstToken.symbol}`
                : shouldApproveSecond
                  ? `Approve ${secondToken.symbol}`
                  : `Add Liquidity`
              : shouldApprovePair
                ? `Approve LP`
                : `Remove Liquidity`}
      </Button> */}
    </>
  )
}

export default Classic
