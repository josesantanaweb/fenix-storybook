'use client'

import { useState } from 'react'
import Link from 'next/link'
import cn from '@/src/library/utils/cn'
import { usePathname } from 'next/navigation'
import useIsMobile from '@/src/library/hooks/useIsMobile'

interface IItem {
  name: string
  description: string
  icon: string
  path: string
  active: boolean
}

interface NavItemProps {
  item: IItem
}

const NavItem = ({ item }: NavItemProps) => {
  const isMobile = useIsMobile()
  const [hasHover, setHasHover] = useState<boolean>(false)

  const pathname = usePathname()

  const shortenedPathname = pathname.slice(7, 20)

  const activeItem = cn(
    'relative pb-2 transtition cursor-pointer border-b-2  min-w-[100px] group hover:border-chilean-fire-600',
    shortenedPathname === item.path ? 'border-chilean-fire-600' : 'border-transparent',
    // `${isMobile && item.name !== 'Swap' ? 'hidden' : 'block'}`
  )
  const activeName = cn(shortenedPathname === item.path ? 'text-chilean-fire-600' : 'text-white')

  const onHoverEnter = () => setHasHover(true)
  const onHoverLeave = () => setHasHover(false)

  const handleRedirect = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!item.active) event.preventDefault()
  }

  return (
    <div className={activeItem} onMouseEnter={onHoverEnter} onMouseLeave={onHoverLeave}>
      <Link href={`${item.path}`} className="flex items-center gap-2" onClick={handleRedirect}>
        <div className=" flex items-center justify-center w-9 h-9   xl:w-8 xl:h-8  2xl:w-9 2xl:h-9  p-2 border rounded-lg bg-shark-400 bg-opacity-40 border-shark-400">
          <span className={`inline-block text-sm text-gradient ${item.icon}`}></span>
        </div>
        <div className="">
          <p className={`text-xs group-hover:text-chilean-fire-600 ${activeName}`}>{item.name}</p>
        </div>
      </Link>
      {hasHover && !item.active && (
        <div className="bg-shark-400 bg-opacity-90
        whitespace-nowrap
        cursor-not-allowed rounded-lg
      text-chilean-fire-600 text-xs flex items-center
        justify-center px-4 py-3 absolute top-0 bottom-1
        min-w-[102px]
        w-full">
          Coming soon
        </div>
      )}
    </div>
  )
}

export default NavItem
