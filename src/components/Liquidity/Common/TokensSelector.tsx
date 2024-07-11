/* eslint-disable react/no-multi-comp */
'use client'

import { useState } from 'react'
import SelectToken from '@/src/components/Modals/SelectToken'

import { IToken } from '@/src/library/types'
import ExchangeBox from '@/src/components/Liquidity/Common/ExchangeBox'
import Separator from '@/src/components/Trade/Common/Separator'
import { switchTokensValues } from '../../Trade/Swap/Panel/utilsChange'

interface TokenSelectorProps {
  token: IToken
  value: string
  setToken: (token: IToken) => void
  setValue: (value: string) => void
  variant?: 'primary' | 'secondary'
  onTokenValueChange?: (arg0: string, token: IToken) => void
  option?: string
  defaultBalance?: string
  balanceTrigger?: boolean
}

const TokenSelector = ({
  token,
  setToken,
  variant,
  onTokenValueChange,
  value,
  setValue,
  option,
  defaultBalance,
  balanceTrigger
}: TokenSelectorProps) => {
  const [openSelectToken, setOpenSelectToken] = useState<boolean>(false)

  return (
    <div>
      <ExchangeBox
        token={token}
        onOpenModal={() => setOpenSelectToken(true)}
        variant={variant}
        onTokenValueChange={onTokenValueChange}
        setValue={setValue}
        value={value}
        option={option}
        defaultBalance={defaultBalance}
        balanceTrigger={balanceTrigger}
      />

      <SelectToken openModal={openSelectToken} setOpenModal={setOpenSelectToken} setToken={setToken} />
    </div>
  )
}

const TokensSelector = ({
  firstToken,
  secondToken,
  firstValue,
  secondValue,
  setFirstToken,
  setSecondToken,
  setFirstValue,
  setSecondValue,
  onTokenValueChange,
  option,
  hideTokenSwap = false,
  defaultBalanceFirst,
  defaultBalanceSecond,
  balanceTrigger
}: {
  firstToken: IToken
  secondToken: IToken
  firstValue: string
  secondValue: string
  setFirstToken: (token: IToken) => void
  setSecondToken: (token: IToken) => void
  setFirstValue: (value: string) => void
  setSecondValue: (value: string) => void
  onTokenValueChange: (arg0: any, token: IToken) => void
  option?: string
  hideTokenSwap?: boolean
  defaultBalanceFirst?: string
  defaultBalanceSecond?: string
  balanceTrigger?: boolean
}) => {
  return (
    <div className="flex flex-col gap-1 mb-2 relative">
      <TokenSelector
        token={firstToken}
        value={firstValue}
        setToken={(token) => setFirstToken(token)}
        setValue={(value) => setFirstValue(value)}
        variant="primary"
        onTokenValueChange={onTokenValueChange}
        option={option}
        defaultBalance={defaultBalanceFirst}
        balanceTrigger={balanceTrigger}
      />
      {
        hideTokenSwap ? (<></>) : (
          <Separator
            onClick={() => {
              switchTokensValues(firstToken, secondToken, setFirstToken, setSecondToken)
            }}
          />
        )
      }
      <TokenSelector
        token={secondToken}
        value={secondValue}
        setToken={(token) => setSecondToken(token)}
        setValue={(value) => setSecondValue(value)}
        variant="secondary"
        onTokenValueChange={onTokenValueChange}
        option={option}
        defaultBalance={defaultBalanceSecond}
        balanceTrigger={balanceTrigger}
      />
    </div>
  )
}

export default TokensSelector
