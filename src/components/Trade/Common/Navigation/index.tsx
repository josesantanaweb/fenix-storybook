'use client'
import NavItem from './NavItem'
import { NAV_LIST } from '../../data'

const Navigation = () => {
  return (
    <div className="box-navigation-trade max-xl:mt-[2px] xl:h-[78px] pl-0 pr-0">
      <div className="relative px-6 xl:pl-6 z-10 
      xl:flex justify-between gap-10 xl:gap-2  grid grid-cols-2 items-center w-full xl:max-w-[calc(100%-400px)]">
        {NAV_LIST.map((item, index) => (
          <NavItem key={index} item={item} />
        ))}
      </div>
      {/* <div className="min-w-[150px] flex items-center gap-2 cursor-pointer text-shark-100 hover:text-outrageous-orange-500 justify-center">
        <span className="icon-discord"></span>
        <p className="text-sm">Need help?</p>
      </div> */}
    </div>
  )
}

export default Navigation
