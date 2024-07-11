/* eslint-disable max-len */
'use client'

import { Button } from '@/src/components/UI'
import useIsMobile from '@/src/library/hooks/useIsMobile'
import cn from '@/src/library/utils/cn'

interface FilterProps {
  options: string[]
  currentTab: string
  bgBox?: string
  className?: string
  setCurrentTab: (parameter: string) => void
}

const Filter = ({ options, currentTab, setCurrentTab, className }: FilterProps) => {
  const isMobile = useIsMobile()
  const handlerChange = (parameter: string) => {
    setCurrentTab(parameter)
  }

  const mergeClassName = cn(
    'md:max-h-[45px] grid grid-cols-2 sm:grid-cols-3 md:flex items-center w-full gap-2 px-2 py-2 rounded-xl xl:flex-row 2xl:gap-3 xl:w-full bg-opacity-40 bg-shark-400',
    className
  )
  return (
    <>
      <div className={mergeClassName}>
        {options.map((option, index) => {
          return (
            <Button
              key={index}
              onClick={() => {
                handlerChange(option.toUpperCase())
              }}
              variant={
                currentTab.toUpperCase() === option.split('').join('').toString().toUpperCase()
                  ? 'primary'
                  : `${isMobile ? 'tertiary' : 'default'}`
              }
              className=" w-full h-[32px] md:w-auto !text-xs !lg:text-xl "
            >
              {option}
            </Button>
          )
        })}
      </div>
    </>
  )
}

export default Filter
