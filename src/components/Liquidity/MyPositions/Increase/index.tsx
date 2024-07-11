'use client'

import Tabs from '@/src/components/Liquidity/MyPositions/Common/Tabs'
import { Button } from '@/src/components/UI'
import TopCurrentPosition from '@/src/components/Liquidity/MyPositions/Increase/TopCurrentPosition'
import FeeFier from '@/src/components/Liquidity/MyPositions/Increase/FeeFier'
import AddMoreLiquidity from '@/src/components/Liquidity/MyPositions/Increase/AddMoreLiquidity'
import SelectRange from '@/src/components/Liquidity/MyPositions/Increase/SelectRange'

interface IncreaseProps {
  tabActive: string
  setTabActive: (tabActive: string) => void
}

const Increase = ({ tabActive, setTabActive }: IncreaseProps) => {

  const handlerBack = () => setTabActive("")

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between mb-5 font-semibold">
        <div className="flex items-center gap-3">
          <div onClick={handlerBack} className="flex items-center justify-center flex-shrink-0 w-8 h-8 px-4 text-white transition-colors border rounded-lg border-shark-300 bg-shark-400 bg-opacity-40 hover:bg-outrageous-orange-400">
            <span className="text-sm icon-chevron rotate-90"></span>
          </div>
          <h4 className="text-lg font-medium text-white md:text-base">Add liquidity</h4>
        </div>
        <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 px-4 text-white transition-colors border rounded-lg border-shark-300 bg-shark-400 bg-opacity-40 hover:bg-outrageous-orange-400">
          <span className="text-sm icon-cog"></span>
        </div>
      </div>
      <TopCurrentPosition />
      <FeeFier />
      <Tabs tabActive={tabActive} setTabActive={setTabActive} />
      <AddMoreLiquidity />
      <SelectRange />
      <Button className="w-full" variant="tertiary">Enter an amount</Button>
    </div>
  )
}

export default Increase
