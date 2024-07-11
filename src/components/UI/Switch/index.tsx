'use client'
import cn from '@/src/library/utils/cn'

import React from 'react'

interface SwitchProps {
  active: boolean
  setActive: (active: boolean) => void
}

const Switch = ({ active, setActive }: SwitchProps) => {
  const handlerSwitch = () => setActive(!active)

  const wrapperClassName = cn('transition rounded-full w-10 h-5 cursor-pointer flex items-center relative', {
    'bg-shark-400 bg-opacity-40': !active,
    'bg-gradient-to-r from-outrageous-orange-500 to-chilean-fire-500': active,
  })

  const circleClassName = cn('transition bg-shark-300 rounded-full w-4 h-4 block absolute top-[2px]', {
    'left-[2px]': !active,
    'right-[2px]': active,
  })

  return (
    <div onClick={handlerSwitch} className={wrapperClassName}>
      <span className={circleClassName}></span>
    </div>
  )
}

export default Switch
