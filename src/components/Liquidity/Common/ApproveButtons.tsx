'use client'

import { Button } from '@/src/components/UI'
import { Address } from 'viem'
import Loader from '../../UI/Icons/Loader'

interface ApproveButtonsProps {
  shouldApproveFirst: boolean
  shouldApproveSecond: boolean
  token0: any
  token1: any
  handleApprove: any
  mainFn: any
  mainText: string
  isLoading: boolean
  isFirstLoading?: boolean
  isSecondLoading?: boolean
  disabled?: boolean
}

const ApproveButtons = ({
  token0,
  token1,
  shouldApproveFirst,
  shouldApproveSecond,
  handleApprove,
  mainFn,
  mainText,
  isLoading,
  isFirstLoading,
  isSecondLoading,
  disabled
}: ApproveButtonsProps) => {
  return shouldApproveFirst || shouldApproveSecond ? (
    <div className="flex">
      <Button
        onClick={() => {
          if (shouldApproveFirst) handleApprove(token0.address as Address)
        }}
        className="button button-tertiary w-1/2 !text-xs !h-[49px] mr-[10px]"
        disabled={!shouldApproveFirst || disabled}
      >
        {isFirstLoading ? (
          <>
            <Loader color="white" size={20} /> {' Approving'}
          </>
        ) : shouldApproveFirst ? (
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
          if (shouldApproveSecond) handleApprove(token1.address as Address)
        }}
        disabled={!shouldApproveSecond || disabled}
        className="button button-tertiary w-1/2 !text-xs !h-[49px]"
      >
        {isSecondLoading ? (
          <>
            <Loader color="white" size={20} /> {' Approving'}
          </>
        ) : shouldApproveSecond ? (
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
      disabled={disabled}
      className="w-full mx-auto !text-xs !h-[49px]"
      variant="tertiary"
      onClick={() => {
        mainFn()
      }}
    >
      {isLoading ? <Loader color="white" size={20} /> : `${mainText}`}
    </Button>
  )
}

export default ApproveButtons
