import { useEffect, useMemo, useState } from 'react'

export interface IInputRangeProps {
  min?: number
  max?: number
  value: number
  step?: number
  height?: number
  thumbSize?: number
  onChange?: (value: number) => void
  disabled: boolean
  onChangeShown?: (value: number) => void
}

const InputRange = ({
  min = 0,
  max = 100,
  value,
  step = 1,
  height = 5,
  thumbSize = 11,
  onChange,
  disabled,
  onChangeShown,
}: IInputRangeProps) => {
  const [currentValue, setCurrentValue] = useState(value)

  const percent = useMemo(() => ((currentValue - min) / (max - min)) * 100, [currentValue, min, max])
  useEffect(() => {
    setCurrentValue(value)
  }, [value])

  useEffect(() => {
    if (onChangeShown) {
      onChangeShown(currentValue)
    }
    //
  }, [])

  const isDisabledClass = disabled
    ? '[&::-webkit-slider-thumb]:bg-[#333A43] [&::-webkit-slider-thumb]:pointer-events-none'
    : '[&::-webkit-slider-thumb]:bg-fenix-slider'

  return (
    <input
      type="range"
      className={`w-full h-[var(--height)] rounded-lg cursor-pointer appearance-none
        [&::-webkit-slider-thumb]:transition-transform [&:active::-webkit-slider-thumb]:scale-[1.5]
        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[var(--thumb-size)]
        [&::-webkit-slider-thumb]:w-[var(--thumb-size)] [&::-webkit-slider-thumb]:rounded-full ${isDisabledClass} [&::-webkit-slider-thumb]:bg-cover`}
      style={{
        // @ts-ignore
        '--thumb-size': `${thumbSize}px`,
        '--height': `${height}px`,
        background: `linear-gradient(to right, #FE5E35 ${percent}%, #333A43 ${percent}%, #333A43 100%)`,
      }}
      min={min}
      max={max}
      step={step}
      value={currentValue}
      onMouseDown={(e) => window.getSelection()?.removeAllRanges()}
      onChange={(e) => {
        setCurrentValue(Number(e.target.value))
        onChangeShown && onChangeShown(Number(e.target.value))
      }}
      onMouseUp={(e) => onChange && onChange(currentValue)}
      onTouchEnd={(e) => onChange && onChange(currentValue)}
      disabled={disabled}
    />
  )
}

export default InputRange
