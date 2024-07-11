import {
  LiquidityHubProvider,
  useLiquidityHub,
  Token as LHToken,
  SwapConfirmation,
  useAmountBN,
  LiquidityHubPayload,
  useSwapButtonContent,
  getSwapModalTitle,
  isLHSwap,
  networks,
  PoweredByOrbs,
} from '@orbs-network/liquidity-hub-ui-sdk'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useSlippageTolerance } from '@/src/state/user/hooks'
import { IToken } from '@/src/library/types'
import { useAccount } from 'wagmi'
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import React from 'react'
import { Modal, Button } from '@/src/components/UI'
import Loader from '@/src/components/UI/Icons/Loader'
import BN from 'bignumber.js'
import { formatDollarAmount } from '@/src/library/utils/numbers'

const useWrappedToken = (): IToken | undefined => {
  const { chainId } = useAccount()

  return useMemo(() => {
    switch (chainId) {
      case networks.blast.id:
        return {
          name: 'Wrapped Ether',
          symbol: 'WETH',
          address: '0x4300000000000000000000000000000000000004',
          decimals: 18,
          img: '/static/images/tokens/WETH.svg',
          price: 0,
        }

      default:
        break
    }
  }, [chainId])
}

const useProvider = () => {
  const [provider, setProvider] = useState<any>(undefined)
  const { connector, address, isConnected } = useAccount()

  const getProvider = useCallback(async () => {
    try {
      const res = await connector?.getProvider()
      setProvider(res)
    } catch (error) {}
  }, [setProvider, connector, address, isConnected])

  useEffect(() => {
    getProvider()
  }, [getProvider])

  return provider
}

const Provider = ({ children }: { children: ReactNode }) => {
  const { openConnectModal } = useConnectModal()
  const { address, chain } = useAccount()

  const provider = useProvider()

  return (
    <LiquidityHubProvider
      partner="fenix"
      connectWallet={openConnectModal}
      account={address}
      chainId={chain?.id}
      provider={provider}
    >
      {children}
    </LiquidityHubProvider>
  )
}

const handleSlippage = (slippage: string | number) => {
  if (slippage === 'Auto') return 1
  return typeof slippage === 'number' ? slippage : parseFloat(slippage)
}

export const useQuoteSwap = (swapValue?: string, minAmountOut?: bigint, tokenSell?: IToken, tokenGet?: IToken) => {
  const fromAmount = useAmountBN(tokenSell?.decimals, swapValue)
  const { fromToken, toToken } = useModifyTokens(tokenSell, tokenGet)
  const dexMinAmountOut = minAmountOut?.toString()
  const slippage = useSlippageTolerance()

  return useLiquidityHub({
    fromAmount,
    fromToken,
    toToken,
    slippage: handleSlippage(slippage),
    minAmountOut: BN(dexMinAmountOut || '0').isZero() ? undefined : dexMinAmountOut,
  })
}

const useIsLHSwap = (liquidityHubPaload?: LiquidityHubPayload, dexMinAmountOut?: bigint) => {
  const lhMinAmountOut = liquidityHubPaload?.quote?.minAmountOut
  const isDisabled = liquidityHubPaload?.isDisabled
  const dexMinAmountOutStr = dexMinAmountOut?.toString()
  return useMemo(() => {
    let res = false
    if (BN(lhMinAmountOut || 0).isZero()) {
      res = false
    } else if (isDisabled) {
      res = false
    } else {
      res = isLHSwap(lhMinAmountOut, dexMinAmountOutStr)
    }
    const params = new URLSearchParams(location.search)
    if (params.get('lh-log')) {
      console.log({ isLHSwap: res, liquidityHubPrice: lhMinAmountOut, dexPrice: dexMinAmountOutStr })
    }

    return res
  }, [lhMinAmountOut, dexMinAmountOutStr, isDisabled])
}

const useModifyTokens = (tokenSell?: IToken, tokenGet?: IToken): { fromToken?: LHToken; toToken?: LHToken } => {
  const fromToken = useMemo(() => {
    if (!tokenSell) return

    return {
      decimals: tokenSell.decimals,
      address: tokenSell.address as string,
      symbol: tokenSell.symbol,
      logoUrl: tokenSell.img,
    }
  }, [tokenSell])

  const toToken = useMemo(() => {
    if (!tokenGet) return
    return {
      decimals: tokenGet.decimals,
      address: tokenGet.address as string,
      symbol: tokenGet.symbol,
      logoUrl: tokenGet.img,
    }
  }, [tokenGet])

  return { fromToken, toToken }
}

const SwapConfirmationModal = ({
  liquidityHubPaload,
  fromUsd,
  toUsd,
  setTokenSell,
  resetAfterSwap,
  forValue,
}: {
  liquidityHubPaload: LiquidityHubPayload
  fromUsd?: BN
  toUsd?: BN
  setTokenSell: (token: IToken) => void
  resetAfterSwap: () => void
  forValue?: string
}) => {
  const wToken = useWrappedToken()

  const {
    showConfirmationModal,
    closeConfirmationModal,
    fromToken,
    swapSuccess,
    swapStatus,
    swapLoading,
    submitSwap,
    fromAmount,
    swapError,
    isWrapped,
  } = liquidityHubPaload

  const onClose = useCallback(() => {
    if (swapSuccess) {
      resetAfterSwap()
    }
    if (swapError && isWrapped && wToken) {
      setTokenSell(wToken)
    }
    closeConfirmationModal()
  }, [closeConfirmationModal, resetAfterSwap, swapSuccess, setTokenSell, wToken, swapError, isWrapped])

  const onSwap = useCallback(async () => {
    try {
      await submitSwap()
    } catch (error) {
      console.error(error)
    }
  }, [submitSwap])

  const buttonContent = useSwapButtonContent(fromToken?.address, fromAmount)

  const title = useMemo(() => {
    return getSwapModalTitle(swapStatus)
  }, [swapStatus])

  return (
    <Modal openModal={showConfirmationModal} setOpenModal={onClose} key="lh-confirmation-modal">
      <div className="common-modal">
        <span className="absolute top-0 right-0 text-2xl cursor-pointer icon-x text-shark-100" onClick={onClose} />
        <div className="relative z-10 w-full h-full">
          <h1 className="text-md font-medium text-white mb-2">{title}</h1>
          <SwapConfirmation
            {...liquidityHubPaload}
            outAmount={forValue}
            fromTokenUsd={fromUsd?.gt(0) ? formatDollarAmount(fromUsd.toString()) : undefined}
            toTokenUsd={toUsd?.gt(0) ? formatDollarAmount(toUsd.toString()) : undefined}
          >
            <SwapConfirmation.Main
              SubmitButton={
                <Button variant="primary" className="w-full flex items-center justify-center gap-x-2" onClick={onSwap}>
                  {swapLoading ? <Loader color="white" size={20} /> : <>{buttonContent}</>}
                </Button>
              }
            />
          </SwapConfirmation>
        </div>
      </div>
    </Modal>
  )
}

const PoweredBy = () => {
  return <PoweredByOrbs style={{ marginTop: 30 }} />
}

export const LiquidityHub = {
  Provider,
  SwapConfirmationModal,
  useIsLHSwap,
  useQuoteSwap,
  PoweredBy,
}
