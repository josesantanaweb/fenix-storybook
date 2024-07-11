'use client'

// helpers
import cn from '@/src/library/utils/cn'

// models
import TableHeaderCell from '@/src/library/types/common/table-header-cell'
import SortTypes from '@/src/library/types/common/sort-types.enum'
import { BasicPool } from '@/src/state/liquidity/types'

// personal models
interface TableHeadProps {
  items: TableHeaderCell[],
  setSort: (sortBy: keyof BasicPool | null, sort: SortTypes | null) => void,
  sortBy: keyof BasicPool | null,
  sort: SortTypes | null,
}

const TableHeadNew = ({ items, setSort, sortBy, sort }: TableHeadProps) => {
  // helpers
  function handleSort(newSortBy: keyof BasicPool | null): void {
    if (!newSortBy) {
      return
    }

    const newSort = (newSortBy === sortBy && sort)
      ? sort === SortTypes.ASC ? SortTypes.DESC : null
      : SortTypes.ASC

    setSort(newSortBy, newSort)
  }

  function mergeClassName(item: TableHeaderCell): string {
    return cn('px-2.5 ', item.sortBy ? 'cursor-pointer relative select-none' : 'cursor-default', item.className)
  }

  function sortClassName(item: TableHeaderCell): string {
    return cn(
      'icon-chevron text-[11px] inline-block ml-2',
      sort === SortTypes.ASC ? '-scale-y-100' : '',
      (item.sortBy === sortBy && sort) ? '' : 'opacity-0',
    )
  }

  return (
    <div className="flex text-white text-sm mb-3.5 px-1.5 ">
      {items.map((item, index) => {
        return (
          <div
            key={index}
            className={mergeClassName(item)}
            onClick={() => handleSort(item.sortBy || null)}
          >
            <span className="leading-normal relative max-w-[20px]">
              {item.text}
            </span>
            {item.sortBy
              ? <span className={sortClassName(item)} />
              : null}
          </div>
        )
      })}
    </div>
  )
}

export default TableHeadNew
