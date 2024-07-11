'use client'
import Image from 'next/image'
import { Button } from '@/src/components/UI'
import { useAccount, useBalance } from 'wagmi'
import { IToken } from '@/src/library/types'
import { useEffect, useRef, useState } from 'react'
import { getTokenBalance } from '@/src/library/hooks/web3/useTokenBalance'
import { Address } from 'viem'
import { ethers } from 'ethers'
import { formatDollarAmount, formatNumber } from '@/src/library/utils/numbers'
import { NumericalInput } from '../../UI/Input'
import { toBN } from '@/src/library/utils/numbers'

interface ExchangeBoxProps {
  title?: string
  token: IToken
  onOpenModal?: () => void
  variant?: 'primary' | 'secondary'
  onTokenValueChange?: (arg0: string, token: IToken) => void
  value?: any
  setValue: (value: string) => void
  option?: string
  defaultBalance?: string
  balanceTrigger?: boolean
}

type CancelableCall = {
  canceled: boolean
  cancel: () => void
}

const ExchangeBox = ({
  title,
  token,
  onOpenModal,
  variant,
  onTokenValueChange,
  value,
  setValue,
  option,
  defaultBalance,
  balanceTrigger
}: ExchangeBoxProps) => {
  const boxVariant = variant === 'secondary' ? 'exchange-box-x2' : 'exchange-box-x1'
  const availableAlign = title ? 'justify-between' : 'justify-end'
  const account = useAccount()
  const [balance, setBalance] = useState('')
  const [btnDisabled, setBtnDisabled] = useState<boolean>(false)
  const latestCallRef = useRef<CancelableCall | null>(null)

  useEffect(() => {
    toBN(balance).lte(0) ? setBtnDisabled(true) : setBtnDisabled(false)
  }, [balance])

  const handleHalf = () => {
    if (btnDisabled) {
      setValue('')
    } else {
      if (onTokenValueChange) {
        onTokenValueChange(
          toBN(balance)
            .div(10 ** (token?.decimals || 18))
            .div(2)
            .toString(),

          token
        )
        // onTokenValueChange('1', token)
      } else {
        setValue('')
      }
    }
  }

  const handleMax = () => {
    if (btnDisabled) {
      setValue('')
    } else {
      if (onTokenValueChange) {
        onTokenValueChange(
          toBN(balance)
            .div(10 ** (token?.decimals || 18))
            .toString(),
          token
        )
      } else {
        setValue('')
      }
    }
  }

  useEffect(() => {
    const asyncFn = async () => {
      if (latestCallRef.current) {
        latestCallRef.current.cancel()
      }

      const currentCall: CancelableCall = {
        canceled: false,
        cancel() {
          this.canceled = true
        },
      }

      latestCallRef.current = currentCall

      try {
        const b = await getTokenBalance(token.address as Address, account.address as Address)

        if (!currentCall.canceled) {
          setBalance(b.toString())
        }
      } catch (error) {
        if (!currentCall.canceled) {
          console.error(error)
        }
      }
    }

    if (!defaultBalance) asyncFn()
    else setBalance(defaultBalance)

    return () => {
      if (latestCallRef.current) {
        latestCallRef.current.cancel()
      }
    }
  }, [token, account.address, defaultBalance, balanceTrigger])

  const handleOnChange = (e: any) => {
    if (onTokenValueChange) onTokenValueChange(e < 0 || e == '' ? 0 : e, token)
  }

  return (
    <div className={boxVariant}>
      <div className={`flex items-center mb-3 ${availableAlign}`}>
        {title && <p className="text-white font-medium">{title}</p>}
        <p className="text-shark-100 flex text-sm justify-end gap-6 xl:gap-0 w-full xl:w-3/5 items-cente xl:justify-between">
          {option !== 'WITHDRAW' ? (
            <span className=" ml-3">
              {value && value !== '' && token?.price && formatDollarAmount(toBN(value).multipliedBy(token?.price))}
            </span>
          ) : null}

          {option !== 'WITHDRAWINN' ? (
            <div className="flex items-center justify-end w-full">
              <span className="icon-wallet text-xs mr-2"></span>
              <span onClick={handleMax}>
                Available: {`${formatNumber(Number(balance) / 10 ** token.decimals, 8)}`} {token.symbol}
              </span>
            </div>
          ) : null}
        </p>
      </div>
      <div className="flex flex-col xl:flex-row items-center gap-3">
        <div className="relative w-full xl:w-2/5">
          <div
            className="bg-shark-400 bg-opacity-40 rounded-lg text-white px-4 flex items-center justify-between h-[50px]"
            onClick={onOpenModal ? () => onOpenModal() : undefined}
          >
            <div className="flex items-center gap-2">
              {option !== 'WITHDRAW' ? (
                <>
                  <Image
                    src={`${token.symbol ? `/static/images/tokens/${token.symbol}.svg` : '/static/images/tokens/FNX.svg'}`}
                    alt="token"
                    className="w-6 h-6 rounded-full"
                    width={20}
                    height={20}
                  />
                </>
              ) : null}
              <span className="text-base">{token.symbol}</span>
            </div>
            {option !== 'WITHDRAW' ? <span className="icon-chevron text-sm inline-block ml-2" /> : null}
          </div>
        </div>
        <div className="relative w-full xl:w-3/5">
          {/* <input
            type="number"
            placeholder="0"
            className="bg-shark-400 bg-opacity-40 border border-shark-400 h-[50px] w-full rounded-lg outline-none px-3 text-white text-sm"
            onChange={handleOnChange}
            value={value}
          /> */}
          <NumericalInput
            value={value}
            className="bg-shark-400 bg-opacity-40 border border-shark-400 h-[50px] w-full rounded-lg outline-none px-3 text-white text-sm"
            placeholder="0.0"
            onUserInput={(input) => handleOnChange(input)}
            precision={token.decimals}
          />

          {option !== 'WITHDRAWINN' ? (
            <div className="absolute right-2 top-[10px] flex items-center gap-1">
              <Button variant="tertiary" className="!py-1 !px-3" onClick={handleHalf}>
                Half
              </Button>
              <Button variant="tertiary" className="!py-1 !px-3" onClick={handleMax}>
                Max
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default ExchangeBox
