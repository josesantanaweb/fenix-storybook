'use client'

import React from 'react'
import Link from 'next/link'
import cn from '@/src/library/utils/cn'
import useActiveConnectionDetails from '@/src/library/hooks/web3/useActiveConnectionDetails'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { FALLBACK_CHAIN_ID, SupportedChainId, isSupportedChain } from '@/src/library/constants/chains'
import { useSwitchChain } from 'wagmi'

interface ButtonProps {
  variant?: 'default' | 'primary' | 'secondary' | 'tertiary'
  className?: string
  onClick?: () => void
  children: React.ReactNode
  disabled?: boolean
  href?: string
  labelWallet?: string
  walletConfig?: {
    needWalletConnected: boolean
    needSupportedChain: boolean
  }
  style?: React.CSSProperties
}

const Button = ({
  children,
  onClick,
  href,
  labelWallet,
  disabled,
  className,
  variant = 'primary',
  walletConfig,
  ...props
}: ButtonProps) => {
  const variantClasses = {
    default: 'button-default',
    primary: 'button-primary [&_*]:relative [&_*]:z-20',
    secondary: 'button-secondary',
    tertiary: 'button-tertiary',
  }[variant]
  const { isConnected, chainId } = useActiveConnectionDetails()
  const disabledClasses = 'opacity-40 cursor-not-allowed'
  const { openConnectModal } = useConnectModal()
  const { switchChain } = useSwitchChain()
  const mergeClassName = cn('button', variantClasses, { [disabledClasses]: disabled }, className)
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
    onClick && onClick()
  }
  const buttonText = () => {
    if (ensureWalletConnected()) {
      return labelWallet ? labelWallet : 'Connect Wallet'
    }
    if (ensureChainSupported()) {
      return 'Change to Blast Network'
    }
    return children
  }
  if (href) {
    return (
      <Link href={href} onClick={handleClick} className={mergeClassName} {...props}>
        {buttonText()}
      </Link>
    )
  }

  return (
    <button disabled={disabled} onClick={handleClick} className={mergeClassName} {...props}>
      {buttonText()}
    </button>
  )
}

export default Button
