/* eslint-disable max-len */
'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'

import Swap from '@/src/components/Trade/Swap/Panel/Swap'
import For from '@/src/components/Trade/Swap/Panel/For'
import Separator from '@/src/components/Trade/Common/Separator'
import { Address, TransactionExecutionError, erc20Abi, formatUnits, parseUnits, zeroAddress } from 'viem'
import { useAccount, useCall, useConnectorClient, useSimulateContract } from 'wagmi'
import { type WriteContractErrorType } from '@wagmi/core'
import Chart from '@/src/components/Liquidity/Deposit/Chart'
import { useShowChart, useSetChart } from '@/src/state/user/hooks'
import React from 'react'
import { IToken } from '@/src/library/types'
import { useReadContract, useWriteContract } from 'wagmi'
import useActiveConnectionDetails from '@/src/library/hooks/web3/useActiveConnectionDetails'
import { algebraQuoterV2ABI, openOceanExchangeAbi } from '@/src/library/web3/abis'
import { Button, Switch } from '@/src/components/UI'
import { algebraSwapABI } from '@/src/library/web3/abis/algebraSwap'
import useStore from '@/src/state/zustand'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import toast from 'react-hot-toast'
import Loader from '@/src/components/UI/Icons/Loader'
import { ReloadIcon } from '@/src/components/UI/Icons/Reload'
import SettingsIcon from '@/src/components/UI/Icons/Settings'
import { useSlippageTolerance } from '@/src/state/user/hooks'
import { BN_ONE, formatNumber, fromWei, removeTrailingZeros, toBN } from '@/src/library/utils/numbers'
import { contractAddressList } from '@/src/library/constants/contactAddresses'
import useAlgebraPoolByPair from '@/src/library/hooks/web3/useAlgebraPoolByPair'
import useAlgebraSafelyStateOfAMM from '@/src/library/hooks/web3/useAlgebraSafelyStateOfAMM'
import cn from '@/src/library/utils/cn'
import { useAlgebraMultiRouting } from './useAlgebraMultiRouting'
import { approveToken, isNativeToken, switchTokensValues } from './utilsChange'
import { getWeb3Provider } from '@/src/library/utils/web3'
import { NATIVE_ETH, NATIVE_ETH_LOWERCASE, WETH_ADDRESS } from '@/src/library/Constants'
import { wethAbi } from '@/src/library/web3/abis/wethAbi'
import { useNotificationAdderCallback, useReadNotificationCallback } from '@/src/state/notifications/hooks'
import { NotificationDetails, NotificationDuration, NotificationType } from '@/src/state/notifications/types'
import { Token, computePoolAddress } from '@cryptoalgebra/integral-sdk'
import { blast } from 'viem/chains'
import { INIT_CODE_HASH_MANUAL_OVERRIDE } from '@/src/library/constants/algebra'
import { useAllPools } from '@/src/state/liquidity/hooks'

import { fetchTokens } from '@/src/library/common/getAvailableTokens'
import { ethers } from 'ethers'
import useDebounce from '@/src/library/hooks/useDebounce'
import { postEvent } from '@/src/library/utils/events'
import debounce from 'lodash/debounce'
import formatNumberToView from '@/src/library/helper/format-number-to-view'

import { LiquidityHub } from '../LiquidityHub/index'
enum ButtonState {
  POOL_NOT_AVAILABLE = 'Pool Not Available',
  ENTER_AMOUNT = 'Enter Amount',
  APPROVAL_REQUIRED = 'Approval Required',
  APPROVING = 'Approving...',
  WAITING_APPROVAL = 'Waiting Approval',
  INSUFFICIENT_BALANCE = 'Insufficient Balance',
  WAITING_CONFIRMATION = 'Waiting Confirmation',
  PRICE_IMPACT_ALERT = 'Price Impact Too High. Swap Anyway',
  SWAP = 'Swap',
  LOADING = 'Loading...',
}
const Panel = () => {
  const [isButtonPrimary, setisButtonPrimary] = useState(false)
  const [inputSwapValue, setInputSwapValue] = useState<string>('')
  const [swapValue, setSwapValue] = useState<string>('')
  const [dexForValue, setForValue] = useState<string>('')

  const { setSlippageModal } = useStore()
  const [currentButtonState, setCurrentButtonState] = useState(ButtonState.SWAP)
  const [disableChart, setDisableChart] = useState(false)
  const [tokenSellUserBalance, setTokenSellUserBalance] = useState<string>('')
  const { writeContract, failureReason, data: hash, status } = useWriteContract()
  const slippage = useSlippageTolerance()
  const { openConnectModal } = useConnectModal()
  const { account, isConnected } = useActiveConnectionDetails()
  const { chainId } = useAccount()
  const addNotification = useNotificationAdderCallback()
  const readNotification = useReadNotificationCallback()
  const [swapQuoteLoading, setSwapQuoteLoading] = useState<boolean>(false)
  const [swapTransactionData, setSwapTransactionData] = useState<string>()
  const [swapTxEstimatedGas, setSwapTxEstimatedGas] = useState<number>(0)

  const debounceSetSwapValue = useCallback(debounce((value: string) => {
    setSwapValue(value)
  }, 400), [])

  const handleTransactionSuccess = (
    hash: `0x${string}` | undefined,
    tokenSell: IToken,
    tokenGet: IToken,
    isApproval: boolean = false
  ) => {
    const id = crypto.randomUUID()
    const provider = getWeb3Provider()
    const notificationMessage = `${tokenSell?.symbol} for ${tokenGet?.symbol}`

    //
    addNotification({
      id: id,
      createTime: new Date().toISOString(),
      message: !isApproval ? `Proccessing ${notificationMessage} swap...` : 'Proccessing approval...',
      notificationType: NotificationType.DEFAULT,
      txHash: hash,
      notificationDuration: NotificationDuration.DURATION_3000,
    })

    if (!hash) return
    provider
      .waitForTransaction(hash)
      .then((transactionReceipt) => {
        setTimeout(() => {
          readNotification(id)
        }, 10)
        addNotification({
          id: crypto.randomUUID(),
          createTime: new Date().toISOString(),
          message: !isApproval
            ? `Swap ${notificationMessage} completed successfully`
            : 'Approval completed successfully',
          notificationType: NotificationType.SUCCESS,
          txHash: hash,
          notificationDuration: NotificationDuration.DURATION_5000,
        })
      })
      .catch((error) => {
        console.error('Error, there was an error', error)
      })
  }

  const handleTransactionError = (e: any) => {
    //
    if (e instanceof TransactionExecutionError) {
      addNotification({
        id: crypto.randomUUID(),
        createTime: new Date().toISOString(),
        message: e.shortMessage,
        notificationType: NotificationType.ERROR,
      })
      return
    } else if (e.message) {
      addNotification({
        id: crypto.randomUUID(),
        createTime: new Date().toISOString(),
        message: e.message,
        notificationType: NotificationType.ERROR,
      })
      return
    } else {
      addNotification({
        id: crypto.randomUUID(),
        createTime: new Date().toISOString(),
        message: 'There was an error',
        notificationType: NotificationType.ERROR,
      })
      return
    }
  }
  const [tokenSell, setTokenSell] = useState<IToken>({
    name: 'USDB',
    symbol: 'USDB',
    address: '0x4300000000000000000000000000000000000003',
    decimals: 18,
    img: '/static/images/tokens/USDB.svg',
    price: 0,
  })

  const [tokenGet, setTokenGet] = useState<IToken>({
    name: 'Wrapped Ether',
    symbol: 'WETH',
    address: '0x4300000000000000000000000000000000000004',
    decimals: 18,
    img: '/static/images/tokens/WETH.svg',
    price: 0,
  })

  const updateTokenPrice = useCallback((data: any[], symbol: string) => {
    const foundToken = data.find((token) => token.basetoken.symbol === symbol)
    return foundToken ? foundToken.priceUSD : null
  }, [])
  const showChart = useShowChart()
  const setChart = useSetChart()
  const result = useConnectorClient()

  // To have a 0s load, use static default tokens and fetch the prices as soon as the component mounts
  // Ideally, we should do this on a loader in redux and share the data across the app
  useEffect(() => {
    const fetchTokenPrices = async () => {
      try {
        if (chainId) {
          const data = await fetchTokens(chainId)
          // USDB Because it's the default token sell
          const sellPrice = updateTokenPrice(data, 'USDB')
          if (sellPrice !== null && tokenSell?.symbol === 'USDB')
            setTokenSell((prev) => ({ ...prev, price: sellPrice }))
          // WETH Because it's the default token get
          const getPrice = updateTokenPrice(data, 'WETH')
          if (getPrice !== null && tokenGet?.symbol === 'WETH') setTokenGet((prev) => ({ ...prev, price: getPrice }))
        }
      } catch (error) {
        console.error('Failed to fetch token prices:', error)
      }
    }

    fetchTokenPrices()
  }, [updateTokenPrice, chainId])
  const { connector } = useAccount()

  // function to make the swap
  const slippageValue = slippage == 'Auto' || !slippage ? 100 - 0.5 : 100 - slippage
  const nativeWETH_ETH =
    tokenGet?.address?.toLowerCase() === NATIVE_ETH.toLowerCase() &&
    tokenSell?.address?.toLowerCase() == WETH_ADDRESS.toLowerCase()
  const nativeETH_WETH =
    tokenSell?.address?.toLowerCase() === NATIVE_ETH.toLowerCase() &&
    tokenGet?.address?.toLowerCase() == WETH_ADDRESS.toLowerCase()
  // const amountOutMinimum = toBN(Number(parseUnits(forValue, tokenGet.decimals)))
  //   .multipliedBy(slippageValue)
  //   .dividedBy(100)
  const [amountOutMinimum, setAmountOutMinimum] = useState<bigint>(BigInt(0))
  const callAlgebraRouter = async () => {
    if (!isConnected) {
      openConnectModal && openConnectModal()
      return
    }
    setLoadingSwap(true)
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    // const signer = provider.getSigner()
    try {
      if (nativeETH_WETH) {
        const txResponse = writeContract(
          {
            address: WETH_ADDRESS,
            abi: wethAbi,
            functionName: 'deposit',
            value: parseUnits(swapValue, tokenSell.decimals),
          },
          {
            onSuccess: async (txHash) => {
              setForValue('')
              setSwapValue('')
              setInputSwapValue('')
              setTimeout(() => {
                handleTransactionSuccess(txHash, tokenSell, tokenGet)
              }, 250)
            },
            onError: (e) => {
              handleTransactionError(e)
            },
          }
        )
        return
      }

      const estimatedGas = swapTxEstimatedGas <= 0
        ? (await signer.estimateGas({
            to: contractAddressList.open_ocean,
            data: swapTransactionData,
          }))
        : ethers.BigNumber.from(swapTxEstimatedGas)
      const txResponse = await signer.sendTransaction({
        to: contractAddressList.open_ocean,
        gasLimit: estimatedGas.toBigInt(),
        data: swapTransactionData,
        ...(tokenSell?.address?.toLowerCase() === NATIVE_ETH.toLowerCase()
          ? { value: parseUnits(swapValue, tokenSell.decimals) }
          : {}),
      })
      await txResponse.wait()

      setForValue('')
      setSwapValue('')
      setInputSwapValue('')
      setLoadingSwap(false)
      await postEvent({
        tx: txResponse.hash,
        user: account as `0x${string}`,
        event_type: 'SWAP',
        value: toBN(swapValue).times(tokenSell.price).toNumber(),
      })
      handleTransactionSuccess(txResponse.hash as `0x${string}`, tokenSell, tokenGet)

      // setTimeout(() => {
      //   handleTransactionSuccess(txResponse.hash as `0x${string}`, tokenSell, tokenGet)
      // }, 250)
    } catch (error) {
      setLoadingSwap(false)

      if (error instanceof Error && error.message) {
        handleTransactionError(error.message)
      }
      handleTransactionError(error)
    } finally {
      setLoadingSwap(false)
    }
  }

  const resetAfterSwap = useCallback(() => {
    setSwapValue('')
    setForValue('')
    setAmountOutMinimum(BigInt(0))
  }, [])

  const handleApproveToken = async () => {
    if (!isConnected) {
      openConnectModal && openConnectModal()
      return
    }
    setCurrentButtonState(ButtonState.WAITING_APPROVAL)
    const provider = getWeb3Provider()
    const txApproveHash = await approveToken({
      tokenAddress: tokenSell.address as `0x${string}`,
      contractAddress: contractAddressList.open_ocean as `0x${string}`,
      abi: erc20Abi,
      onSuccess: () => setCurrentButtonState(ButtonState.APPROVING),
      onError: () => setCurrentButtonState(ButtonState.APPROVAL_REQUIRED),
      onTransactionSuccess: handleTransactionSuccess,
      onTransactionError: handleTransactionError,
    })
    if (txApproveHash) {
      await provider.waitForTransaction(txApproveHash)
      approvalData.refetch()

      // setCurrentButtonState(ButtonState.SWAP)
    }
    setCurrentButtonState(ButtonState.SWAP)
  }
  const tokenSellIsNative = isNativeToken(tokenSell?.address)
  const tokenGetIsNative = isNativeToken(tokenGet?.address)

  // when user changes the account, we reset the swap and for values
  useEffect(() => {
    if (!account) {
      setSwapValue('')
      setInputSwapValue('')
      setForValue('')
    }
  }, [account])

  const swapAvailable = true

  // check if the user has approved the token
  const approvalData = useReadContract({
    address: tokenSell.address as `0x${string}`,
    functionName: 'allowance',
    args: [account as `0x${string}`, contractAddressList.open_ocean as `0x${string}`],
    abi: erc20Abi,
  })
  // this is the user balance of the token that the user wants to sell. We pass the setTokenSellUserBalance to the Swap component to update the balance when the user changes the token.
  // We use this balance to check if the user has enough balance to swap

  // manage button click
  const handleSwapClick = () => {
    if (isLHSwap && currentButtonState === ButtonState.SWAP) {
      liquidityHubPaload.onShowConfirmation()
    } else if (currentButtonState === ButtonState.SWAP || currentButtonState === ButtonState.PRICE_IMPACT_ALERT) {
      callAlgebraRouter()
    } else if (currentButtonState === ButtonState.APPROVAL_REQUIRED) {
      setCurrentButtonState(ButtonState.WAITING_APPROVAL)
      handleApproveToken()
    }
  }

  const liquidityHubPaload = LiquidityHub.useQuoteSwap(swapValue, amountOutMinimum, tokenSell, tokenGet)

  const isLHSwap = LiquidityHub.useIsLHSwap(liquidityHubPaload, amountOutMinimum)

  const forValue = useMemo(() => {
    if (!swapQuoteLoading && isLHSwap && toBN(dexForValue).isZero()) {
      return liquidityHubPaload.ui.outAmount
    }    
    return dexForValue
  }, [swapQuoteLoading, dexForValue, isLHSwap, liquidityHubPaload.ui.outAmount])

  const tokenGetValue = toBN(swapValue).multipliedBy(tokenSell.price)
  const tokenSellValue = toBN(forValue).multipliedBy(tokenGet.price)
  const [loadingSwap, setLoadingSwap] = useState(false)
  const percentageChange = tokenGetValue.minus(tokenSellValue).div(tokenGetValue).multipliedBy(100).abs().toString()
  const percentageChangeValue = useDebounce(percentageChange, 1000)
  const priceImpact = isNaN(Number(percentageChangeValue)) ? '' : percentageChangeValue

  const minimumReceived = useMemo(() => {
    if (!swapQuoteLoading && isLHSwap && toBN(amountOutMinimum.toString()).isZero()) {
      return liquidityHubPaload.ui.minAmountOut
    }
    return fromWei(Number(amountOutMinimum), tokenGet.decimals)
  }, [amountOutMinimum, tokenGet.decimals, swapQuoteLoading, isLHSwap, liquidityHubPaload.ui.minAmountOut])

  useEffect(() => {
    if ((approvalData.isLoading && !tokenSellIsNative) || swapQuoteLoading || loadingSwap) {
      //
      //
      setCurrentButtonState(ButtonState.LOADING)
    } else if (!swapAvailable) {
      setCurrentButtonState(ButtonState.POOL_NOT_AVAILABLE)
    } else if (currentButtonState == ButtonState.WAITING_APPROVAL || currentButtonState == ButtonState.APPROVING) {
      return
    } else if (
      !isLHSwap &&
      !tokenSellIsNative &&
      Number(formatUnits(approvalData?.data || 0n, tokenSell.decimals)) < Number(swapValue)
    ) {
      setCurrentButtonState(ButtonState.APPROVAL_REQUIRED)
    } else if (!swapValue || !forValue) {
      setCurrentButtonState(ButtonState.ENTER_AMOUNT)
    } else if (Number(swapValue) > Number(tokenSellUserBalance || 0)) {
      setCurrentButtonState(ButtonState.INSUFFICIENT_BALANCE)
    } else if (toBN(priceImpact).abs().gt(3)) {
      setCurrentButtonState(ButtonState.PRICE_IMPACT_ALERT)
    } else {
      setCurrentButtonState(ButtonState.SWAP)
    }
  }, [
    isConnected,
    swapValue,
    forValue,
    approvalData?.data,
    tokenSell.decimals,
    tokenSellUserBalance,
    swapQuoteLoading,
    loadingSwap,
    tokenSellIsNative,
    priceImpact,
    swapAvailable,
    approvalData.isLoading,
    isLHSwap,
    currentButtonState,
  ])
  useEffect(() => {
    const interval = setInterval(() => {
      if (nativeETH_WETH || nativeWETH_ETH) return
      approvalData.refetch()
    }, 3000)
    return () => clearInterval(interval)
  }, [swapValue, forValue, account, approvalData])

  const [expandTxDetails, setExpandTxDetails] = useState<boolean>(false)
  useEffect(() => {
    setForValue('')
  }, [tokenGet])
  useEffect(() => {
    if (swapValue == '') setForValue('')
  }, [swapValue])
  useEffect(() => {
    if (currentButtonState === 'Enter Amount' && swapValue === '' && forValue === '') {
      setisButtonPrimary(false)
    } else {
      setisButtonPrimary(true)
    }
  }, [currentButtonState, swapValue, forValue])
  const [isChartVisible, setIsChartVisible] = useState(showChart)

  const handleSwitch = () => {
    if (!disableChart) {
      setChart(!isChartVisible)
      setIsChartVisible((prevState) => !prevState)
    }
  }

  useEffect(() => {
    if (nativeETH_WETH) {
      setForValue(swapValue)
    }
  }, [swapValue, nativeETH_WETH])
  useEffect(() => {
    if (nativeWETH_ETH) {
      setForValue(swapValue)
    }
  }, [swapValue, nativeWETH_ETH])
  useEffect(() => {
    if (inputSwapValue !== swapValue) {
      debounceSetSwapValue(inputSwapValue)
    }
  }, [inputSwapValue])

  const normalizeToken = (token: string) =>
    token.toLowerCase() === NATIVE_ETH_LOWERCASE ? WETH_ADDRESS.toLowerCase() : token.toLowerCase()
  const { data } = useAllPools()

  // disable/enable chart
  useEffect(() => {
    const tokenA =
      tokenGet?.address && tokenSell?.address
        ? normalizeToken(tokenGet?.address) < normalizeToken(tokenSell?.address)
          ? tokenGet?.address
          : tokenSell?.address
        : zeroAddress
    const tokenB =
      tokenGet?.address && tokenSell?.address
        ? normalizeToken(tokenGet?.address) < normalizeToken(tokenSell?.address)
          ? tokenSell?.address
          : tokenGet?.address
        : zeroAddress
    const poolAddress =
      tokenA == tokenB
        ? '0x0000000000000000000000000000000000000000'
        : computePoolAddress({
            tokenA: new Token(blast.id, tokenA, 18), // decimals here are arbitrary
            tokenB: new Token(blast.id, tokenB, 18), // decimals here are arbitrary
            poolDeployer: contractAddressList.pool_deployer,
            initCodeHashManualOverride: INIT_CODE_HASH_MANUAL_OVERRIDE,
          })

    const availablePool = data?.find((pool: any) => pool?.id?.toLowerCase() === poolAddress.toLowerCase())

    if (!tokenGet?.address || !tokenSell?.address || availablePool == null) {
      if (isChartVisible) handleSwitch()
      setDisableChart(true)
    } else {
      setDisableChart(false)
    }
  }, [tokenSell?.address, tokenGet?.address, data])
  //
  // si es ether, tengo que enviar el 0xeeee
  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    const fetchData = async () => {
      setSwapQuoteLoading(true)

      if (!tokenGet.address || !tokenSell.address) {
        setSwapQuoteLoading(false)
        return
      }
      if (!swapValue) {
        setSwapQuoteLoading(false)
        return
      }
      if (toBN(swapValue).lte(0)) {
        setForValue('')
        setTimeout(() => {
          setSwapQuoteLoading(false)
        }, 50)
        return
      }
      try {
        const params = new URLSearchParams({
          inTokenAddress: tokenSell.address as Address,
          outTokenAddress: tokenGet.address as Address,
          amount: removeTrailingZeros(swapValue),
          slippage: slippage == 'Auto' ? '1' : removeTrailingZeros(slippage),
          account: account || zeroAddress,
        })
        const apiUrl = `/api/aggregator/blast/swap?${params}`
        const response = await fetch(apiUrl, { signal })

        const jsonResponse = await response.json()
        const swapData = jsonResponse.data
        setForValue(fromWei(swapData?.outAmount, tokenGet.decimals))
        setAmountOutMinimum(BigInt(swapData?.minOutAmount))
        setSwapTxEstimatedGas(swapData?.estimatedGas || 0)
        setSwapTransactionData(swapData?.data)
        setTimeout(() => {
          setSwapQuoteLoading(false)
        }, 50)
      } catch (error) {
      } finally {
        setTimeout(() => {
          setSwapQuoteLoading(false)
        }, 50)
      }
    }
    fetchData()
    // controller.abort()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
    return () => {
      controller.abort()
      setSwapQuoteLoading(false)
    }
  }, [tokenGet.address, tokenSell.address, swapValue, account, slippage, tokenGet.decimals])
  const handleTokenSwap = () => {
    const prevForValue = forValue
    switchTokensValues(tokenGet, tokenSell, setTokenGet, setTokenSell)
    setSwapValue(prevForValue)
    setInputSwapValue(prevForValue)
  }
  const updateTokenSell = (newToken: IToken) => {
    if (newToken.address === tokenGet.address) {
      handleTokenSwap()
    } else {
      setTokenSell(newToken)
    }
  }

  const updateTokenGet = (newToken: IToken) => {
    if (newToken.address === tokenSell.address) {
      handleTokenSwap()
    } else {
      setTokenGet(newToken)
    }
  }
  return (
    <>
      <section className={`box-panel-trade ${showChart ? 'max-xl:rounded-b-none' : ''}`}>
        <div className="w-full flex flex-col xl:flex-row justify-between gap-12 items-center relative z-10">
          <div className="w-full relative">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-x-4 ">
                <h1 className="text-lg text-white font-medium">Swap</h1>
              </div>

              <div className="flex gap-x-3 items-center">
                <span className="text-shark-100 text-sm">
                  {/* {swapFee && swapFee != '0' && `${formatUnits(BigInt(swapFee), 4)}% fee`} */}
                </span>
                <span
                  onClick={handleSwitch}
                  className={`text-2xl ${disableChart ? 'cursor-default bg-opacity-40' : 'cursor-pointer'} ${!showChart ? `transition-all bg-shark-100 ${!disableChart && 'lg:hover:bg-gradient-to-r lg:hover:from-outrageous-orange-500 lg:hover:to-festival-500'} text-transparent bg-clip-text` : 'text-gradient'} icon-chart-fenix`}
                ></span>
                <span
                  className="text-2xl transition-all bg-shark-100 lg:hover:bg-gradient-to-r lg:hover:from-outrageous-orange-500 lg:hover:to-festival-500 text-transparent bg-clip-text !cursor-pointer icon-refresh"
                  onClick={() => {
                    setSwapValue('')
                    setInputSwapValue('')
                    setForValue('')
                  }}
                ></span>
                <span
                  className="text-2xl transition-all bg-shark-100 lg:hover:bg-gradient-to-r lg:hover:from-outrageous-orange-500 lg:hover:to-festival-500 text-transparent bg-clip-text !cursor-pointer icon-settings"
                  onClick={() => setSlippageModal(true)}
                ></span>
                {/* <ReloadIcon
                  className="transition-all bg-shark-100 lg:hover:bg-gradient-to-r lg:hover:from-outrageous-orange-500 lg:hover:to-festival-500 text-transparent bg-clip-text !cursor-pointer"

                /> */}
                {/* <SettingsIcon onClick={() => setSlippageModal(true)} className="!cursor-pointer " /> */}
              </div>
            </div>
            <div className="flex flex-col gap-1 mb-5 relative">
              <div className="mb-3">
                <Swap
                  token={tokenSell}
                  setToken={updateTokenSell}
                  value={inputSwapValue}
                  setValue={setInputSwapValue}
                  setTokenSellUserBalance={setTokenSellUserBalance}
                />
                <Separator
                  onClick={() => {
                    handleTokenSwap()
                  }}
                />
                <For token={tokenGet} setToken={updateTokenGet} value={forValue} setValue={setForValue} />
              </div>
              <div
                className={`${priceImpact && currentButtonState !== ButtonState.LOADING && Number(priceImpact) > 3 && swapValue && forValue && !swapQuoteLoading ? 'text-shark-100 text-xs exchange-box-x1 mb-2 !px-[30px] !mt-[-8px] flex items-center gap-3 font-normal' : 'hidden'}`}
              >
                <span className="icon-info text-base"></span>
                This transaction apperars to have a price impact greater than 5%. Research risks before swapping.
              </div>
              <Button
                variant={`${isButtonPrimary ? 'primary' : 'tertiary'}`}
                className="w-full flex items-center justify-center gap-x-2"
                onClick={handleSwapClick}
                walletConfig={{
                  needWalletConnected: true,
                  needSupportedChain: true,
                }}
                disabled={
                  !isConnected
                    ? false
                    : currentButtonState === ButtonState.LOADING ||
                      currentButtonState === ButtonState.APPROVING ||
                      currentButtonState === ButtonState.WAITING_APPROVAL
                }
              >
                {currentButtonState === ButtonState.LOADING ? (
                  <Loader color="white" size={20} />
                ) : currentButtonState === ButtonState.APPROVING ? (
                  <>
                    <Loader color="white" size={20} /> {currentButtonState}
                  </>
                ) : (
                  <>{currentButtonState}</>
                )}
              </Button>
            </div>
          </div>
        </div>
        <p
          className="text-white bg-shark-400 flex justify-between bg-opacity-40 w-full rounded-md px-8 py-1.5 text-sm cursor-pointer "
          onClick={() => {
            setExpandTxDetails(!expandTxDetails)
          }}
        >
          Tx details:
          <span className={cn('icon-chevron text-sm inline-block', expandTxDetails ? '' : 'rotate-180')} />
        </p>

        <div
          hidden={!expandTxDetails}
          className="bg-shark-400 bg-opacity-40 w-full mt-1 px-8 py-2 space-y-1 text-white text-sm
        [&>p]:justify-between [&>p]:flex rounded-md select-none transition-all duration-300 ease-in-out
      "
        >
          <p className="">
            Route:
            <span className="text-shark-100">
              {nativeWETH_ETH && 'WETH > ETH'}

              {nativeETH_WETH && 'ETH > WETH'}

              {!nativeETH_WETH && !nativeWETH_ETH && `${tokenSell.symbol} > ${tokenGet.symbol}`}
            </span>
          </p>
          <p className="">
            Slippage:{' '}
            <span className="text-shark-100">
              {nativeETH_WETH || nativeWETH_ETH ? '0' : slippage?.toString().toLowerCase() == 'auto' ? 'Auto' : slippage}
            </span>
          </p>

          <p className="">
            Minimum Amount Recieved:{' '}
            <span className="text-shark-100">
              <>{minimumReceived}</>
            </span>
          </p>
          <p className="">
            Price Impact:{' '}
            <span className="text-shark-100">
              <> {nativeETH_WETH || nativeWETH_ETH ? '0' : parseFloat(priceImpact.toString() || '0').toFixed(2)}%</>
            </span>
          </p>
        </div>
        <LiquidityHub.PoweredBy />
      </section>
      {showChart && <Chart token0={tokenGet?.address} token1={tokenSell?.address} />}
      <LiquidityHub.SwapConfirmationModal
        resetAfterSwap={resetAfterSwap}
        setTokenSell={setTokenSell}
        fromUsd={tokenGetValue}
        toUsd={tokenSellValue}
        liquidityHubPaload={liquidityHubPaload}
        forValue={forValue}
      />
    </>
  )
}

export default () => {
  return (
    <LiquidityHub.Provider>
      <Panel />
    </LiquidityHub.Provider>
  )
}
