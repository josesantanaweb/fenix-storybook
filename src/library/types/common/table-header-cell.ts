// models
import { BasicPool } from '@/src/state/liquidity/types'

interface TableHeaderCell {
  text: string
  className: string
  rangeClassName?: string
  sortBy?: keyof BasicPool
  showTooltip?: boolean
  setShowTooltip?: (showTooltip: boolean) => void
}

export default TableHeaderCell
