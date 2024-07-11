'use client'
import { useMemo, useState } from 'react'

// hooks
import { useRingsCampaignsBoostedPools } from '@/src/state/liquidity/hooks'

// helpers
import { buildAprRingsMap } from '@/src/library/utils/build-apr-rings-map'
import { totalCampaigns } from '@/src/library/utils/campaigns'

// components
import Row from './Row'
import { Pagination, PaginationMobile, TableBody, TableSkeleton } from '@/src/components/UI'
import TableHeadNew from '@/src/components/UI/Table/TableHeadNew'

// models
import { BasicPool } from '@/src/state/liquidity/types'
import SortTypes from '@/src/library/types/common/sort-types.enum'
import TableHeaderCell from '@/src/library/types/common/table-header-cell'
import { Campaign } from '@/src/library/utils/campaigns'
import LoadingData from '@/src/components/Modals/LoadingData'
import NotFoundLock from '@/src/components/Lock/NotFoundLock'

// personal models
interface HeaderRowProps {
  loading: boolean,
  poolsData: BasicPool[],
  activePagination?: boolean,
  titleHeader?: string,
  titleHeader2?: string,
  titleButton?: string,
  titleButton2?: string,
  activeRange?: boolean,
}

// personal constants
const HeaderCellsRaw: TableHeaderCell[] = [
  { text: 'Pair', className: 'w-[20%]' },
  { text: 'Range', className: 'w-[12%] text-center' },
  { text: 'Point Stack', className: 'w-[15%] text-right', rangeClassName: 'w-[8%] text-right', sortBy: 'totalCampaigns' },
  { text: 'TVL', className: 'w-[13%] text-right', sortBy: 'totalValueLockedUSD' },
  { text: 'APR', className: 'w-[13%] text-right', rangeClassName: 'w-[8%] text-right', sortBy: 'aprRings' },
  { text: 'Volume', className: 'w-[13%] text-right', sortBy: 'volumeUSD' },
  { text: 'Fees', className: 'w-[13%] text-right', sortBy: 'feesUSD' },
  { text: 'Action', className: 'w-[13%] text-right' },
]

const HeaderRow = ({
  poolsData,
  loading,
  activePagination = true,
  titleHeader = '',
  titleButton = '',
  titleButton2 = '',
  titleHeader2 = '',
  activeRange = false,
}: HeaderRowProps) => {
  // common
  const { data: ringsList, loading: ringsLoading } = useRingsCampaignsBoostedPools()

  // state
  const aprRingsMap = useMemo(
    () => (ringsLoading ? null : buildAprRingsMap(ringsList)),
    [ringsLoading, ringsList],
  )
  const [itemsPerPage, setItemPerPage] = useState<number>(20)
  const [activePage, setActivePage] = useState<number>(1)
  const [sort, setSort] = useState<SortTypes | null>(null)
  const [sortBy, setSortBy] = useState<keyof BasicPool | null>(null)
  const [openLoadingData, setOpenLoadingData] = useState<boolean>(false)

  // computed
  const HeaderCells = useMemo(() => [
    HeaderCellsRaw.at(0),
    ...(activeRange ? [HeaderCellsRaw.at(1)] : []),
    ...HeaderCellsRaw.slice(2, -3).map(
      (cell) => ({
        ...cell,
        ...((activeRange && cell.rangeClassName) ? { className: cell.rangeClassName } : {})
      })
    ),
    { ...HeaderCellsRaw.at(-3), text: titleHeader || HeaderCellsRaw.at(-3)!.text },
    { ...HeaderCellsRaw.at(-2), text: titleHeader2 || HeaderCellsRaw.at(-2)!.text },
    HeaderCellsRaw.at(-1),
  ] as TableHeaderCell[], [activeRange, titleHeader, titleHeader2])
  const sortedMappedTableData: BasicPool[] = useMemo(() => {
    const mappedData = poolsData.map((item) => ({
      ...item,
      aprRings: (+(aprRingsMap?.[item.id?.toLowerCase()] ?? 0) + +(isNaN(+item.apr!) ? 0 : item.apr ?? 0)).toString(),
      totalCampaigns: Number(totalCampaigns.find((add:Campaign) => add.pairAddress.toLowerCase() === item.id.toLowerCase())?.pointStack?.length) || 0,
    }))

    if (!(sortBy && sort && mappedData[0]?.[sortBy])) {
      return mappedData
    }

    return mappedData.sort((a, b) => (+a[sortBy]! - +b[sortBy]!) * sort)
  }, [poolsData, aprRingsMap, sortBy, sort])
  const pageData = useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(sortedMappedTableData.length / itemsPerPage))

    // Ensure current page isn't out of range
    const start = (Math.min(activePage, totalPages) - 1) * itemsPerPage
    const end = start + itemsPerPage
    return sortedMappedTableData.slice(start, end)
  }, [sortedMappedTableData, itemsPerPage, activePage])

  // helpers
  function toggleSort(sortBy: keyof BasicPool | null, sort: SortTypes | null): void {
    setSortBy(sortBy)
    setSort(sort)
  }


  return (
    <div className="relative">
      <div className="mb-2.5 w-full xl:mb-5">
        <div className="hidden lg:block">
          <TableHeadNew items={HeaderCells} sort={sort} sortBy={sortBy} setSort={toggleSort} />
        </div>

        <TableBody>
          {loading
            ? Array.from({ length: 5 }).map((_, index) => (
                <TableSkeleton key={index} />
              ))
            : pageData.length > 0 ? pageData.map((row) => (
                <Row
                  key={row.id}
                  row={row}
                  tokensData={null}
                  activeRange={activeRange}
                  titleHeader={titleHeader}
                  titleHeader2={titleHeader2}
                  titleButton={titleButton}
                  titleButton2={titleButton2}
                />
              )) : (
                <div className="bg-shark-400 bg-opacity-20 p-6 rounded-[10px]">
                  <NotFoundLock info={'No data available. Please try another search'} />
                </div>
              )}
        </TableBody>
      </div>

      {activePagination
        ? (
            <>
              <div className="hidden items-center lg:flex">
                <Pagination
                  itemsPerPage={itemsPerPage}
                  setItemPerPage={setItemPerPage}
                  activePage={activePage}
                  setActivePage={setActivePage}
                  className="mx-auto"
                  numberPages={Math.ceil(poolsData.length / itemsPerPage)}
                />
              </div>
              <div className="py-5 lg:hidden">
                <PaginationMobile
                  count={poolsData.length}
                  itemsPerPage={itemsPerPage}
                  setItemPerPage={setItemPerPage}
                  activePage={activePage}
                  setActivePage={setActivePage}
                  className="mx-auto"
                  numberPages={Math.ceil(poolsData.length / itemsPerPage)}
                />
              </div>
            </>
          )
        : null}
        <LoadingData openModal={ringsLoading} setOpenModal={setOpenLoadingData} />
    </div>
  )
}

export default HeaderRow
