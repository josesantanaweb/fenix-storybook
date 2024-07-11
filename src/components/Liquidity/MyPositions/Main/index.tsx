'use client'

import { Button } from '@/src/components/UI'
import TopCurrentPosition from '@/src/components/Liquidity/MyPositions/Main/TopCurrentPosition'
import Liquidity from '@/src/components/Liquidity/MyPositions/Main/Liquidity'
import UnclaimedFees from '@/src/components/Liquidity/MyPositions/Main/UnclaimedFees'
import PriceRange from '@/src/components/Liquidity/MyPositions/Main/PriceRange'
import Tabs from '@/src/components/Liquidity/MyPositions/Common/Tabs'

interface MainProps {
  setTabActive: (tabActive: string) => void
  tabActive: string
}

const Main = ({ setTabActive, tabActive }: MainProps) => {

  return (
    <>
      <div className="flex items-center justify-between mb-5 font-semibold">
        <h4 className="text-lg font-medium text-white md:text-xl">My Manage Position</h4>
      </div>
      <p className="text-xs text-white mb-3">Current Position</p>

      <TopCurrentPosition />
      <Liquidity />
      <UnclaimedFees />
      <Tabs tabActive={tabActive} setTabActive={setTabActive} />
      <PriceRange />
    </>
  )
}

export default Main
