'use client'

import React from 'react'
import { ButtonProps } from './types'
import { getVariantClasses } from '@/src/library/utils/getVariantClasses'
import cn from '@/src/library/utils/cn'
import { variantMappings } from './variants'

const Button = ({
  onClick,
  disabled,
  className,
  children,
  variant = 'primary',
  iconPosition,
  iconClassName,
  ...props
}: ButtonProps) => {
  const baseClass = "rounded-full text-sm font-normal py-3 px-4 gap-2 flex items-center transition-all justify-center min-w-[5rem] max-h-[2.75rem]";
  const variantClasses = getVariantClasses(variantMappings, variant);
  const disabledClasses = 'opacity-40 cursor-not-allowed bg-neutral-500 border border-neutral-300 text-neutral-100'
  const mergeClassName = cn(
    baseClass,
    !disabled && variantClasses,
    { [disabledClasses]: disabled },
    className
  )

  const leftIcon = iconPosition === 'left' ? <span className={`icon icon-regular text-xs ${iconClassName}`} /> : null
  const rightIcon = iconPosition === 'right' ? <span className={`icon icon-regular text-xs ${iconClassName}`} /> : null

  return (
    <button disabled={disabled} onClick={onClick} className={mergeClassName} {...props}>
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  )
}

export default Button
