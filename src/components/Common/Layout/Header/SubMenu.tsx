'use client'

import Image from 'next/image'
import cn from '@/src/library/utils/cn'
import { usePathname } from 'next/navigation'

import { MENU_LINKS, SOCIAL_LINKS } from './data'
import Link from 'next/link'

interface SubMenuProps {
  showMenu: boolean
  setShowMenu: (showMenu: boolean) => void
}

const SubMenu = ({ showMenu, setShowMenu }: SubMenuProps) => {
  const pathname = usePathname()
  const className = cn(
    'absolute transition-all w-[180px] m-2 py-4 px-10 bg-shark-500 backdrop-blur-3xl bg-opacity-80 top-full rounded-2xl border border-shark-400',
    showMenu ? 'right-5 opacity-100 visible' : 'right-0 opacity-50 invisible'
  )
  const handleCloseMenu = () => setShowMenu(false)
  // Todas las clases que tienen como condicion "pathname === '/' son tomadas en cuenta para el landing page de forma que no modifiquen estilos importantes en el resto de la aplicación"
  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <span className="icon-x text-white text-xl ml-auto cursor-pointer" onClick={handleCloseMenu}></span>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        {MENU_LINKS.slice(5).map((link, index) => (
          <div className="relative" key={index}>
            <Link onClick={() => handleCloseMenu()} href={link.href} className="text-white text-xs my-4">
              <span>{link.name}</span>
            </Link>
            {link.new && (
              <span className="absolute left-20 text-[9px] top-1 bg-alizarin-crimson-600 rounded-md w-7 h-5 flex items-center justify-center  text-white">
                New
              </span>
            )}
          </div>
        ))}
      </div>

      {/* <div className="flex items-center gap-3">
        {SOCIAL_LINKS.map((link, index) => (
          <Link
            key={index}
            target="_blank"
            href={link.href}
            className="bg-shark-400 border border-shark-300 rounded-lg p-1 w-8 h-8 flex items-center justify-center"
          >
            <span className={`text-white text-xs icon-${link.iconName}`}></span>
          </Link>
        ))}
      </div> */}
    </div>
  )
}

export default SubMenu
