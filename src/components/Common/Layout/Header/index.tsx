'use client'

import Image from 'next/image'
import Link from 'next/link'

import Menu from './Menu'
import AccountHandler from './AccountHandler'
import WalletSelection from '@/src/components/Modals/WalletSelection'
import { useWindowSize } from 'usehooks-ts'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import SubMenu from './SubMenu'
import Toggle from './Mobile/Toggle'
const Header = () => {
  const pathname = usePathname()
  const { width } = useWindowSize()
  const [showSubMenu, setShowSubMenu] = useState<boolean>(false)
  const handleShowSubMenu = () => setShowSubMenu(!showSubMenu)

  // Todas las clases que tienen como condicion "pathname === '/' son tomadas en cuenta para el landing page de forma que no modifiquen estilos importantes en el resto de la aplicación"
  return (
    <header className={`hidden mx-auto ${pathname === '/' ? 'lg:block' : 'lg:block'}  container`}>
      <div
        className={`${pathname === '/' ? 'relative' : 'header-box h-[102px] px-5 pb-3'}  flex justify-center items-center  rounded-l`}
      >
        <div
          className={`flex items-center   min-w-[50px]  z-10 h-[95px] w-full  ${pathname === '/' && 'absolute w-full left-0'}`}
        >
          <Link href="/">
            {width < 940 ? (
              <Image
                src="/static/images/isotipe.svg"
                className="w-[45px] h-7"
                alt="logo"
                width={43}
                height={26}
                priority
              />
            ) : (
              <Image
                src="/static/images/logo.svg"
                className="w-[150px] h-10"
                alt="logo"
                width={150}
                height={40}
                priority
              />
            )}
          </Link>
        </div>

        <div
          className={`${pathname === '/' ? 'flex justify-center items-center' : 'w-full relative flex justify-center z-50 max-xl:mr-auto max-2xl:mr-[20px]'} `}
        >
          <Menu />
          {/* {width < 1380 && <Toggle onClick={handleShowSubMenu} />} */}
          <SubMenu showMenu={showSubMenu} setShowMenu={setShowSubMenu} />
        </div>

        <div
          className={`flex z-50 items-center gap-3.5  ${width < 860 ? 'px-1' : 'px-5'} 
          h-[95px]
          ${pathname === '/' ? 'absolute right-0 w-full justify-end' : 'w-full justify-center'}`}
        >
          <AccountHandler isMenuMobile={false} />
        </div>
      </div>
      <WalletSelection />
    </header>
  )
}

export default Header
