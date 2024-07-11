'use client'

import Panel from '@/src/components/Liquidity/Manage/Panel'

const ManageLiquidity = () => {

  return (
    <div className="flex flex-col items-start gap-6 mb-4 xl:gap-10 xl:flex-row">
      <div className="flex flex-col w-full">
        <div className="flex flex-wrap w-full gap-5 mb-10 xl:flex-nowrap items-center justify-center">
          <Panel />
        </div>
      </div>
    </div>
  )
}

export default ManageLiquidity
