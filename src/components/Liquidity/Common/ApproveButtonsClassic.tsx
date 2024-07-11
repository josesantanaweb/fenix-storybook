'use client'

import { Button } from '@/src/components/UI'
import { Address, formatUnits, parseUnits } from 'viem'
import Loader from '../../UI/Icons/Loader'
import { BigDecimal } from '@/src/library/common/BigDecimal'

interface ApproveButtonsProps {
  shouldApproveFirst: boolean
  shouldApproveSecond: boolean
  allowanceFirst: string
  allowanceSecond: string
  token0: any
  token1: any
  handleApprove: any
  firstValue: string
  secondValue: string
  mainFn: any
  mainText: string
  isLoading: boolean
  disabled?: boolean
}

const ApproveButtonClassic = ({
  token0,
  token1,
  firstValue,
  secondValue,
  allowanceFirst,
  allowanceSecond,
  shouldApproveFirst,
  shouldApproveSecond,
  handleApprove,
  mainFn,
  mainText,
  isLoading,
  disabled,
}: ApproveButtonsProps) => {
  return shouldApproveFirst ||
    shouldApproveSecond ||
    Number(formatUnits(BigInt(allowanceFirst), token0?.decimals)) < Number(firstValue.toString()) ||
    Number(formatUnits(BigInt(allowanceSecond), token1?.decimals)) < Number(secondValue.toString()) ? (
    <div className="flex">
      <Button
        onClick={() => {
          handleApprove(token0.address as Address, parseUnits(firstValue, token0?.decimals))
        }}
        className="button button-tertiary w-1/2 !text-xs !h-[49px] mr-[10px]"
        disabled={Number(formatUnits(BigInt(allowanceFirst), token0?.decimals)) >= Number(firstValue.toString())}
      >
        {Number(formatUnits(BigInt(allowanceFirst), token0?.decimals)) < Number(firstValue.toString()) ||
        shouldApproveFirst ? (
          <> Approve {token0.symbol}</>
        ) : (
          <div className="flex items-center">
            <span className="text-[12px] 2xl:text-lg icon-check text-white mr-2"></span>
            Approved {token0.symbol}
          </div>
        )}
      </Button>
      <Button
        onClick={() => {
          handleApprove(token1.address as Address, parseUnits(secondValue, token1?.decimals))
        }}
        disabled={Number(formatUnits(BigInt(allowanceSecond), token1?.decimals)) >= Number(secondValue.toString())}
        className="button button-tertiary w-1/2 !text-xs !h-[49px]"
      >
        {Number(formatUnits(BigInt(allowanceSecond), token1?.decimals)) < Number(secondValue.toString()) ||
        shouldApproveSecond ? (
          <> Approve {token1.symbol}</>
        ) : (
          <div className="flex items-center">
            <span className="text-[12px] 2xl:text-lg icon-check text-white mr-2"></span>
            Approved {token1.symbol}
          </div>
        )}
      </Button>
    </div>
  ) : (
    <Button
      className="w-full mx-auto !text-xs !h-[49px]"
      variant="tertiary"
      onClick={() => {
        mainFn()
      }}
      disabled={disabled}
    >
      {isLoading ? <Loader color="white" size={20} /> : `${mainText}`}
    </Button>
  )
}

export default ApproveButtonClassic
