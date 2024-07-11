'use client'

import React, { useRef } from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import cn from '@/src/library/utils/cn'


interface TooltipProps {
  children: React.ReactNode
  className?: string
  show: boolean
  setShow: (show: boolean) => void
}

const Tooltip = ({ children, className, show, setShow }: TooltipProps) => {
  const ref = useRef(null)

  const mergeClassName = cn(
    'bg-shark-400 flex justify-center flex-col w-[250px] p-3  rounded-lg  transition-all',
    show ? 'block' : 'hidden',
    className
  )

  const handleClickOutside = () => setShow(false)

  useOnClickOutside(ref, handleClickOutside)

  return (
    <div className={mergeClassName} ref={ref}>
      {children}
    </div>
  )
}

export default Tooltip
