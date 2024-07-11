'use client'

import React from 'react'
import { useSwitchChain } from 'wagmi'
import useActiveConnectionDetails from '@/src/library/hooks/web3/useActiveConnectionDetails'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { FALLBACK_CHAIN_ID, isSupportedChain } from '@/src/library/constants/chains'
import Button from '@/src/components/V2/UI/Button'
import { ConnectToWalletButtonProps } from './types'

const ConnectToWalletButton = ({
  disabled,
  walletConfig,
  labelWallet,
  onClick,
  className,
  ...props
}: ConnectToWalletButtonProps) => {
  const { isConnected, chainId } = useActiveConnectionDetails()
  const { openConnectModal } = useConnectModal()
  const { switchChain } = useSwitchChain()
  const ensureWalletConnected = () => !isConnected && walletConfig?.needWalletConnected
  const ensureChainSupported = () => !isSupportedChain(chainId) && walletConfig?.needSupportedChain

  const handleClick = () => {
    if (ensureWalletConnected()) {
      openConnectModal && openConnectModal()
      return
    }
    if (ensureChainSupported()) {
      switchChain({ chainId: FALLBACK_CHAIN_ID })
      return
    }
    return onClick()
  }

  const buttonContent = () => {
    let textContent;
    if (ensureWalletConnected()) {
      textContent = labelWallet ? labelWallet : 'Connect your Wallet';
    } else if (ensureChainSupported()) {
      textContent = 'Change to Blast Network';
    } else {
      textContent = 'Connect your Wallet';
    }
    return textContent;
  }

  return (
    <Button
      disabled={disabled}
      onClick={handleClick}
      className={className}
      variant="secondary"
      iconClassName="icon-settings"
      iconPosition="left"
      {...props}
    >
      {buttonContent()}
    </Button>
  )
}

export default ConnectToWalletButton
