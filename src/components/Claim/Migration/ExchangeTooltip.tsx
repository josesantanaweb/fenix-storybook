'use client'

import { Tooltip } from '@/src/components/UI'

export interface Info {
  unlocked: number
  locked: number
}

interface ExchangeTooltipProps {
  show: boolean
  setShow: (show: boolean) => void
  info: Info
}

const ExchangeTooltip = ({ show, setShow, info }: ExchangeTooltipProps) => {
  return (
    <Tooltip show={show} setShow={setShow}>
      <div className="flex items-center gap-3">
        <span className="icon-lock-off text-lg text-shark-100"></span>
        <div>
          <p className="text-xs text-shark-100">Unlocked</p>
          <p className="text-xs text-green-600">
            {info.unlocked}/ <span className="text-white">50.000.000</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="icon-lock text-xl text-shark-100"></span>
        <div>
          <p className="text-xs text-shark-100">Locked</p>
          <p className="text-xs text-red-600">
            {info.locked}/ <span className="text-white">50.000.000</span>
          </p>
        </div>
      </div>
    </Tooltip>
  )
}

export default ExchangeTooltip
