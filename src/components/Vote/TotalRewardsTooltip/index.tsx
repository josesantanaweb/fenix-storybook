'use client'

import { Tooltip } from '@/src/components/UI'

interface TotalRewardsTooltipProps {
  show: boolean
  setShow: (show: boolean) => void
}

const TotalRewardsTooltip = ({ show, setShow }: TotalRewardsTooltipProps) => {
  return (
    <Tooltip className='min-w-[275px] p-5 ' setShow={setShow} show={show}>
      <div className="text-shark-100 flex gap-2">
        {/* <span className="icon-info"/> */}
        <p className='text-xs text-justify'>This amount represents the Projected Returns at 100% of your Voting Power</p>
      </div>
    </Tooltip>
  )
}

export default TotalRewardsTooltip
