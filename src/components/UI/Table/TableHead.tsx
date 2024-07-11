'use client'

import cn from '@/src/library/utils/cn'

interface IItems {
  text: string
  sortable?: boolean
  className?: string
  showTooltip?: boolean
  setShowTooltip?: (showTooltip: boolean) => void
}
interface TableHeadProps {
  items: IItems[]
  setSort: (sort: 'asc' | 'desc' | 'normal') => void
  setSortIndex: (sortIndex: number) => void
  sortIndex: number
  sort: 'asc' | 'desc' | 'normal'
}

const TableHead = ({ items, setSort, setSortIndex, sortIndex, sort }: TableHeadProps) => {
  const handleSort = (index: number, items: IItems) => {
    const newSort = sort === 'asc' ? 'desc' : sort === 'desc' ? 'normal' : 'asc'
    if (items.sortable) {
      setSort(newSort)
      setSortIndex(index)
    }
  }

  const mergeClassName = (item: IItems) => {
    return cn('px-2.5 ', item.sortable ? 'cursor-pointer relative select-none' : 'cursor-default', item.className)
  }

  const sortClassName = (item: IItems, index: number) => {
    return cn(
      'icon-chevron text-[11px] inline-block ml-2',
      sort === 'asc' ? '-scale-y-100' : sort === 'desc' ? '' : '',
      sortIndex === index && sort !== 'normal' ? '' : 'opacity-0'
    )
  }

  return (
    <div className="flex text-white text-sm mb-3.5 px-1.5 ">
      {items.map((item, index) => {
        return (
          <div
            key={index}
            className={mergeClassName(item)}
            onClick={() => {
              setSortIndex(index)
              handleSort(index, item)
            }}
          >
            <span
              // onMouseOver={() => {
              //   setSortIndex(index)
              //   item.setShowTooltip && item.setShowTooltip(true)
              //   // if (item.text === 'Total Rewards') {
              //   // }
              // }}
              // onMouseOut={() => {
              //   item.setShowTooltip && item.setShowTooltip(false)
              //   // if (item.text === 'Total Rewards') {
              //   // }
              // }}
              className="leading-normal relative max-w-[20px]"
            >
              {/* {item.showTooltip && (
                <span className="w-2/5 absolute z-50 text-left bottom-6 right-36 ">
                  <TotalRewardsTooltip show={item.showTooltip} setShow={() => {}} />
                </span>
              )} */}
              {item.text}
            </span>
            {item.sortable && <span className={sortClassName(item, index)}></span>}
          </div>
        )
      })}
    </div>
  )
}

export default TableHead
