import { useIsActiveSubMenu, useSetActiveSubMenu } from '@/src/state/user/hooks'

import Logo from './Logo'
import Menu from './Navbar/Menu'
import ActionBar from './ActionBar'
import SubMenu from './Navbar/SubMenu'

const HeaderV2 = () => {
  const subMenuIsActive = useIsActiveSubMenu()

  return (
    <header className="container py-0.5 ">
      <div className="flex items-center justify-between relative mb-2.5">
        <Logo />
        <Menu />
        <ActionBar />
      </div>

      {subMenuIsActive && <SubMenu />}

      {/* <div
        className={`${pathname === '/' ? 'relative' : 'h-[102px] px-5 pb-3'}  flex justify-center items-center  rounded-l`}
      >
        <div
          className={`${pathname === '/' ? 'flex justify-center items-center' : 'w-full relative flex justify-center z-50 max-xl:mr-auto max-2xl:mr-[20px]'} `}
        > */}
      {/* {width < 1380 && <Toggle onClick={handleShowSubMenu} />} */}
      {/* <SubMenu showMenu={showSubMenu} setShowMenu={setShowSubMenu} />
        </div>

        <div
          className={`flex z-50 items-center gap-3.5  ${width < 860 ? 'px-1' : 'px-5'} 
          h-[95px]
          ${pathname === '/' ? 'absolute right-0 w-full justify-end' : 'w-full justify-center'}`}
        >
          <AccountHandler isMenuMobile={false} />
        </div>
      </div> */}
      {/* <WalletSelection /> */}
      <div></div>
    </header>
  )
}

export default HeaderV2
