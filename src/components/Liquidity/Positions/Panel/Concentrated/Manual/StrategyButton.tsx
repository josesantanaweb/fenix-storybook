import { Button } from '@/src/components/UI'

import BalancedIcon from './Icons/BalancedIcon'
import FullRange from './Icons/FullRange'
import NarrowIcon from './Icons/NarrowIcon'
import WideIcon from './Icons/WideIcon'
import { useMemo, useState } from 'react'

export enum StrategyType {
  NARROW = 'Narrow',
  BALANCED = 'Balanced',
  WIDE = 'Wide',
  FULL_RANGE = 'Full Range',
}

const StrategyButton = ({
  strategyType,
  currentStrategy,
  onClick,
}: {
  strategyType: StrategyType
  currentStrategy: StrategyType | null
  onClick: (strategyType: StrategyType | null) => void
}) => {
  const [isHover, setIsHover] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const currentIcon = useMemo(() => {
    switch (strategyType) {
      case StrategyType.NARROW:
        return <NarrowIcon isHovered={strategyType === currentStrategy} />
      case StrategyType.BALANCED:
        return <BalancedIcon isHovered={strategyType === currentStrategy} />
      case StrategyType.WIDE:
        return <WideIcon isHovered={strategyType === currentStrategy} />
      case StrategyType.FULL_RANGE:
        return <FullRange isHovered={strategyType === currentStrategy} />
      default:
        return null
    }
  }, [strategyType, isHover, currentStrategy, strategyType])

  const tooltipText = useMemo(() => {
    switch (strategyType) {
      case StrategyType.NARROW:
        return 'Narrow = +/- 2.5%'
      case StrategyType.BALANCED:
        return 'Balanced = +/- 6%'
      case StrategyType.WIDE:
        return 'Wide = +/- 15%'
      case StrategyType.FULL_RANGE:
        return 'Full Range (Uni V2)'
      default:
        return null
    }
  }, [strategyType])

  return (
    <div
      className="flex-grow flex flex-col items-center text-white text-xs leading-normal"
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        type="button"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onClick={() => onClick(strategyType === currentStrategy ? null : strategyType)}
        className={`bg-shark-300 bg-opacity-40 px-5 pt-[17px] pb-[7px] rounded-[10px] border border-shark-200 w-full flex flex-col gap-1 items-center justify-center hover:bg-shark-400 mb-2.5 max-md:w-[46.166px] max-md:h-[36.716px] ${
          strategyType === currentStrategy ? 'bg-button-primary-hover' : ''
        }`}
      >
        <span>{currentIcon}</span>
        <span className="">{strategyType}</span>
      </button>

      <Button
        variant="tertiary"
        className="!w-6 !h-6 !p-0 mb-[5px] relative"
        onClick={() => setShowTooltip(!showTooltip)}
      >
        <span className="icon-info text-[16px]"></span>

        {showTooltip && (
          <div className="absolute bg-shark-400 bg-opacity-80 backdrop-blur-[15px] px-2.5 py-1.5 rounded-[10px] text-xs leading-normal text-shark-100 border border-shark-950 w-[148.5px] text-left bottom-full -translate-y-2.5">
            <div className="mb-[5px]">
              <span className="icon-info text-[13px]"></span>
            </div>
            <div>{tooltipText}</div>
          </div>
        )}
      </Button>

      {/* <div>102,6% APR</div> */}
    </div>
  )
}

export default StrategyButton
