'use client'

import { Button } from '@/src/components/UI'
import Tabs from '@/src/components/Liquidity/MyPositions/Common/Tabs'
import TopCurrentPosition from '@/src/components/Liquidity/MyPositions/Remove/TopCurrentPosition'
import Summary from '@/src/components/Liquidity/MyPositions/Remove/Summary'
import Detail from '@/src/components/Liquidity/MyPositions/Remove/Detail'
import Amount from '@/src/components/Liquidity/MyPositions/Remove/Amount'

interface IncreaseProps {
  tabActive: string
  setTabActive: (tabActive: string) => void
}

const Remove = ({ tabActive, setTabActive }: IncreaseProps) => {

  const handlerBack = () => setTabActive("")

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between mb-5 font-semibold">
        <div className="flex items-center gap-3">
          <div onClick={handlerBack} className="flex items-center justify-center flex-shrink-0 w-8 h-8 px-4 text-white transition-colors border rounded-lg border-shark-300 bg-shark-400 bg-opacity-40 hover:bg-outrageous-orange-400">
            <span className="text-sm icon-chevron rotate-90"></span>
          </div>
          <h4 className="text-lg font-medium text-white md:text-base">Remove liquidity</h4>
        </div>
        <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 px-4 text-white transition-colors border rounded-lg border-shark-300 bg-shark-400 bg-opacity-40 hover:bg-outrageous-orange-400">
          <span className="text-sm icon-cog"></span>
        </div>
      </div>
      <TopCurrentPosition />
      <Detail />
      <Tabs tabActive={tabActive} setTabActive={setTabActive} />
      <Amount />
      <Summary />
      <Button className="w-full" variant="tertiary">
        <span>Enter an amount</span>
      </Button>
    </div>
  )
}

export default Remove
