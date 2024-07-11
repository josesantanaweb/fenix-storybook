'use client'
import Panel from '@/src/components/Trade/Swap/Panel'
import Blast3XBanner from '../../Common/Banners/Blast3XBanner'

const Swap = () => {
  return (
    <div className="flex flex-col items-start gap-6 justify-center">
      <Blast3XBanner/>
      <div className="flex flex-col w-full ">
        <div className="flex flex-wrap w-full xl:gap-5 xl:flex-nowrap justify-center ">
          <Panel />
        </div>
      </div>
    </div>
  )
}

export default Swap
