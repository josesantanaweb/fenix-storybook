import { useState } from 'react'

import { Button } from '@/src/components/UI'
import InputRange from '@/src/components/UI/SliderRange/InputRange'
import StrategyButton, { StrategyType } from './StrategyButton'
import Input from './Input'

const SetRange = () => {
  const [currentPercentage, setCurrentPercentage] = useState(5)
  const [currentStrategy, setCurrentStrategy] = useState<StrategyType | null>(null)

  return (
    <div className="bg-shark-400 bg-opacity-40 py-[29px] px-[19px] border border-shark-950 rounded-[10px] mb-2.5">
      <div className="text-xs leading-normal text-white mb-2">Set Range</div>

      <div className="flex gap-[7px] mb-3">
        <Button
          variant={currentPercentage === 5 ? 'primary' : 'tertiary'}
          className="flex-grow"
          onClick={() => setCurrentPercentage(5)}
        >
          5%
        </Button>
        <Button
          variant={currentPercentage === 10 ? 'primary' : 'tertiary'}
          className="flex-grow"
          onClick={() => setCurrentPercentage(10)}
        >
          10%
        </Button>
        <Button
          variant={currentPercentage === 25 ? 'primary' : 'tertiary'}
          className="flex-grow"
          onClick={() => setCurrentPercentage(25)}
        >
          25%
        </Button>
        <Button
          variant={currentPercentage === 50 ? 'primary' : 'tertiary'}
          className="flex-grow"
          onClick={() => setCurrentPercentage(50)}
        >
          50%
        </Button>
        <Button
          variant={currentPercentage === 100 ? 'primary' : 'tertiary'}
          className="flex-grow"
          onClick={() => setCurrentPercentage(100)}
        >
          100%
        </Button>
      </div>

      <div className="bg-shark-400 bg-opacity-40 border border-shark-950 px-5 py-2 flex justify-between items-center gap-2.5 rounded-[10px] mb-4">
        <div className="text-white opacity-75 flex items-center gap-2">
          <span>±</span>
          <span className="text-[30px] leading-normal font-light">{currentPercentage}%</span>
        </div>
        <div className="max-w-[274px] flex-grow">
          <InputRange
            height={8.412}
            thumbSize={14.421}
            value={currentPercentage}
            min={1}
            max={100}
            disabled={false}
            onChange={(value) => setCurrentPercentage(value)}
          />
        </div>
      </div>

      <div className="flex gap-2.5 mb-4">
        <StrategyButton
          strategyType={StrategyType.NARROW}
          currentStrategy={currentStrategy}
          onClick={(strategy) => setCurrentStrategy(strategy)}
        />
        <StrategyButton
          strategyType={StrategyType.BALANCED}
          currentStrategy={currentStrategy}
          onClick={(strategy) => setCurrentStrategy(strategy)}
        />
        <StrategyButton
          strategyType={StrategyType.WIDE}
          currentStrategy={currentStrategy}
          onClick={(strategy) => setCurrentStrategy(strategy)}
        />
        <StrategyButton
          strategyType={StrategyType.FULL_RANGE}
          currentStrategy={currentStrategy}
          onClick={(strategy) => setCurrentStrategy(strategy)}
        />
      </div>

      <div className="flex gap-[21px]">
        <Input title="Min Price" />
        <Input title="Max Price" />
      </div>
    </div>
  )
}

export default SetRange
