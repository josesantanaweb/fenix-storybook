'use client'
import cn from '@/src/library/utils/cn'

interface MainBoxProps {
  children: React.ReactNode
  className?: string
}

const MainBox = ({ children, className }: MainBoxProps) => {

  const mergeClassName = cn('main-box  min-h-[270px]', className)

  return <div className={mergeClassName}>{children}</div>
}

export default MainBox
