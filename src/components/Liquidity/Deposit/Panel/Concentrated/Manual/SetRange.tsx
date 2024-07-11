import { useEffect, useState } from 'react'

import { Button } from '@/src/components/UI'
import InputRange from '@/src/components/UI/SliderRange/InputRange'
import StrategyButton, { StrategyType } from './StrategyButton'
import Input from './Input'
import { formatNumber } from '@/src/library/utils/numbers'
import { IToken } from '@/src/library/types'

const SetRange = ({
  setCurrentPercentage,
  currentPercentage,
  price1,
  price2,
  shownPercentage,
  token1,
  token2,
  multiplier,
  handleMinMaxInput,
  isInverse,
  swapTokens,
  price1text,
  price2text,
}: {
  setCurrentPercentage: any
  currentPercentage: any
  price1: any
  price2: any
  shownPercentage?: any
  token1?: IToken
  token2?: IToken
  multiplier?: any
  handleMinMaxInput?: any
  isInverse?: any
  swapTokens?: any
  price1text?: any
  price2text?: any
}) => {
  const [currentStrategy, setCurrentStrategy] = useState<StrategyType | null>(null)
  const [currentPercentageShown, setCurrentPercentShown] = useState([5, 5])

  useEffect(() => {
    if (currentStrategy == StrategyType.NARROW) handlePercentageChange([-2.5, 2.5], false)
    if (currentStrategy == StrategyType.BALANCED) handlePercentageChange([-6, 6], false)
    if (currentStrategy == StrategyType.WIDE) handlePercentageChange([-15, 15], false)
    if (currentStrategy == StrategyType.FULL_RANGE) handlePercentageChange([-1, -1], false) //inf
  }, [currentStrategy])

  const handlePercentageChange = (percent: any, s=true) => {
    setCurrentPercentage([percent[0], percent[1]])

    return setCurrentPercentShown(percent)

    // if(percent[0] != -1 && percent[1] != -1) {
    //   percent[0] = isInverse ? invertPercentage(-percent[0]) : percent[0]
    //   percent[1] = isInverse ? invertPercentage(-percent[1]) : percent[1]
    // }
    // setCurrentPercentage([percent[0], percent[1]])
    // if (s) setCurrentStrategy(null)
  }

 
  function invertPercentage(percent: number) {
    const remaining = 1 + percent / 100
    return (1 / remaining - 1) * 100
  }

  useEffect(() => {
    if (currentPercentage[0] === -1 && currentPercentage[1] === -1) setCurrentPercentShown([-1, -1])
  }, [currentPercentage])
  const [showFullRange, setShowFullRange] = useState(false)
  useEffect(() => {
    if (currentPercentage[0] === -1 && currentPercentage[1] === -1) setShowFullRange(true)
    else setShowFullRange(false)
  }, [currentPercentage])
  return (
    <div className="bg-shark-400 bg-opacity-40 py-[29px] px-[19px] border border-shark-950 rounded-[10px] mb-2.5">
      <div className="mb-2 text-xs leading-normal text-white">Selected Range</div>
      <div className="flex gap-[7px] mb-3">
        <Button
          variant={currentPercentage[0] === -5 && currentPercentage[1] === 5 ? 'primary' : 'tertiary'}
          className="flex-grow"
          onClick={() => {
            handlePercentageChange([-5, 5])
            setCurrentPercentShown([-5, 5])
          }}
        >
          5%
        </Button>
        <Button
          variant={currentPercentage[0] === -10 && currentPercentage[1] === 10 ? 'primary' : 'tertiary'}
          className="flex-grow"
          onClick={() => {
            handlePercentageChange([-10, 10])
            setCurrentPercentShown([-10, 10])
          }}
        >
          10%
        </Button>
        <Button
          variant={currentPercentage[0] === -25 && currentPercentage[1] === 25 ? 'primary' : 'tertiary'}
          className="flex-grow"
          onClick={() => {
            handlePercentageChange([-25, 25])
            setCurrentPercentShown([-25, 25])
          }}
        >
          25%
        </Button>
        <Button
          variant={currentPercentage[0] === -50 && currentPercentage[1] === 50 ? 'primary' : 'tertiary'}
          className="flex-grow"
          onClick={() => {
            handlePercentageChange([-50, 50])
            setCurrentPercentShown([-50, 50])
          }}
        >
          50%
        </Button>
        <Button
          variant={currentPercentage[0] === -100 && currentPercentage[1] === 100 ? 'primary' : 'tertiary'}
          className="flex-grow"
          onClick={() => {
            setCurrentPercentShown([-100, 100])
            handlePercentageChange([-100, 100])
          }}
        >
          100%
        </Button>
      </div>
      <div className="bg-shark-400 bg-opacity-40 border border-shark-950 px-5 py-2 flex justify-between items-center gap-2.5 rounded-[10px] mb-4">
        <div className="flex items-center gap-2 text-white opacity-75">
          <span>±</span>
          <span className="text-[30px] leading-normal font-light">
            {showFullRange ? 'Full Range' : `${currentPercentageShown[1]}%`}
          </span>
        </div>
        <div className="max-w-[274px] flex-grow">
          <InputRange
            height={8.412}
            thumbSize={14.421}
            value={currentPercentageShown[1] == -1 ? 101 : currentPercentageShown[1]}
            min={1}
            max={100}
            disabled={false}
            onChange={(value) => {
              handlePercentageChange([-value, value])
            }}
            onChangeShown={(value) => {
              {
                if (value != 101) setCurrentPercentShown([-value, value])
              }
            }}
          />
        </div>
      </div>

      <div className="flex gap-2.5 mb-4">
        <StrategyButton
          strategyType={StrategyType.NARROW}
          currentStrategy={currentStrategy}
          onClick={() => {
            setCurrentPercentShown([-2.5, 2.5])
            handlePercentageChange([-2.5, 2.5])
          }}
          active={currentPercentage[0] === -2.5 && currentPercentage[1] === 2.5}
        />
        <StrategyButton
          strategyType={StrategyType.BALANCED}
          currentStrategy={currentStrategy}
          onClick={() => {
            handlePercentageChange([-6, 6])
            setCurrentPercentShown([-6, 6])
          }}
          active={currentPercentage[0] === -6 && currentPercentage[1] === 6}
        />
        <StrategyButton
          strategyType={StrategyType.WIDE}
          currentStrategy={currentStrategy}
          onClick={() => {
            handlePercentageChange([-15, 15])
            setCurrentPercentShown([-15, 15])
          }}
          active={currentPercentage[0] === -15 && currentPercentage[1] === 15}
        />
        <StrategyButton
          strategyType={StrategyType.FULL_RANGE}
          currentStrategy={currentStrategy}
          onClick={() => {
            setCurrentPercentShown([-1, -1])
            handlePercentageChange([-1, -1], false)
          }}
          active={currentPercentage[0] === -1 && currentPercentage[1] === -1}
        />
      </div>
      <div className="flex gap-[21px]">
        <Input
          title={`Min Price (${token2?.symbol} per ${token1?.symbol})`}
          percent={`${currentPercentage[0] == -1 && currentPercentage[1] == -1 ? 0 : currentPercentage[0].toFixed(2)}`}
          setCurrentPercentage={(value: any) => {
            handlePercentageChange([value, currentPercentage[1]])
          }}
          value={
            isInverse
              ? price2text == price2.toString()
                ? currentPercentage[0] == -1 && currentPercentage[1] == -1
                  ? '0'
                  : (formatNumber(1 / (price2 * multiplier), 6) as string)
                : price2text
              : price1text == price1.toString()
                ? currentPercentage[0] == -1 && currentPercentage[1] == -1
                  ? '0'
                  : (formatNumber(price1 / multiplier, 6) as string)
                : price1text
          }
          onChange={(value: any) => {
            handleMinMaxInput(value.target.value, isInverse, multiplier)
          }}
          onTitleClick={swapTokens}
        />
        <Input
          title={`Max Price (${token2?.symbol} per ${token1?.symbol})`}
          percent={`${currentPercentage[0] == -1 && currentPercentage[1] == -1 ? 'Infinity' : currentPercentage[1].toFixed(2)}`}
          setCurrentPercentage={(value: any) => {
            handlePercentageChange([currentPercentage[0], value])
          }}
          value={
            isInverse
              ? price1text == price1.toString()
                ? currentPercentage[0] == -1 && currentPercentage[1] == -1
                  ? 'Infinity'
                  : (formatNumber(1 / (price1 * multiplier), 6) as string)
                : price1text
              : price2text == price2.toString()
                ? currentPercentage[0] == -1 && currentPercentage[1] == -1
                  ? 'Infinity'
                  : (formatNumber(price2 / multiplier, 6) as string)
                : price2text
          }
          onChange={(value: any) => {
            handleMinMaxInput(value.target.value, !isInverse, multiplier)
          }}
          onTitleClick={swapTokens}
        />
      </div>
    </div>
  )
}

export default SetRange
