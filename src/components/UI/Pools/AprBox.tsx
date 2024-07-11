import { useState } from 'react'
import Tooltip from '../Tooltip'
import cn from '@/src/library/utils/cn'
import { formatAmount, formatCurrency } from '@/src/library/utils/numbers'
interface AprBox {
  apr: number
  tooltip?: React.ReactNode
  tooltipClassName?: string
}

export default function AprBox({ apr, tooltip, tooltipClassName }: AprBox) {
  const [openInfo, setOpenInfo] = useState(false)
  return (
    <>
      <div className="flex justify-center items-center min-w-10">
        <p className="px-2 py-1 text-xs whitespace-nowrap text-white border border-solid bg-shark-400 rounded-xl bg-opacity-40 border-1 border-shark-300 relative">
          {formatAmount(apr, 2)}%
          {!!tooltip && (
            <span
              className="icon-info ml-1"
              onMouseEnter={() => setOpenInfo(true)}
              onMouseLeave={() => setOpenInfo(false)}
            ></span>
          )}
          {!!tooltip && (
            <Tooltip
              className={cn(
                'absolute z-10 bg-shark-950 rounded-lg border border-shark-300 w-auto top-8 px-5 py-3 left-0 xl:left-1/2 xl:-translate-x-1/2 transform',
                tooltipClassName
              )}
              show={openInfo}
              setShow={() => {}}
            >
              {tooltip}
            </Tooltip>
          )}
        </p>
      </div>
    </>
  )
}
