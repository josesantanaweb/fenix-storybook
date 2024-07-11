'use client'

import { useState } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import AccountHandler from '../AccountHandler'
import Toggle from './Toggle'
import WalletSelection from '@/src/components/Modals/WalletSelection'
import Menu from './Menu'

const MobileHeader = () => {
  const pathname = usePathname()
  const [showMenu, setShowMenu] = useState<boolean>(false)

  const handleShowMenu = () => setShowMenu(!showMenu)
  // Todas las clases que tienen como condicion "pathname === '/' son tomadas en cuenta para el landing page de forma que no modifiquen estilos importantes en el resto de la aplicación"
  return (
    <div className={`block ${pathname === '/' ? 'lg:hidden' : 'lg:hidden'} px-5 container`}>
      <header
        className={`${pathname === '/' ? '' : 'header-mobile-box'} flex  justify-between gap-5 p-0 mx-auto relative `}
      >
        <div className="flex items-center justify-between w-full relative z-50 h-[87px] p-4 gap-3 ">
          <Link href="/">
            <Image
              src="/static/images/isotipe.svg"
              className="w-[45px] h-7"
              alt="logo"
              width={43}
              height={26}
              priority
            />
          </Link>
          <div className="flex items-center gap-2">
            <AccountHandler isMenuMobile={false} />
            <Toggle onClick={handleShowMenu} />
          </div>
          <Menu showMenu={showMenu} setShowMenu={setShowMenu} />
        </div>
      </header>
      <WalletSelection />
    </div>
  )
}

export default MobileHeader
