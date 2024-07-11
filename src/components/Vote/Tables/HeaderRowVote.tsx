'use client'
import { Fragment, useEffect, useState } from 'react'
import { TableSkeleton, TableBody, TableHead, PaginationMobile } from '@/src/components/UI'
import { Pagination } from '@/src/components/UI'
import RowDataVote from './RowVote'
import { useDispatch } from 'react-redux'
import { AppThunkDispatch, useAppDispatch, useAppSelector } from '@/src/state'
import { setvotes, setpercentage, fetchGaugesAsync } from '@/src/state/vote/reducer'
import { useAccount } from 'wagmi'
import { voteState } from '@/src/state/vote/types'
import { lockState } from '@/src/state/lock/types'
import NotFoundLock from '../../Lock/NotFoundLock'
import { VoteTableElement } from '..'
import NotFoundGauges from '../NotFoundGauges'
import MobileRowVote from './MobileRowVote'

interface HeaderRowVoteProps {
  loading: boolean
  filterData: VoteTableElement[]
  activeVote: boolean
  activePagination?: boolean
  activeSlider?: boolean
  // setVotePercentage: (value: Number) => void
  vote: voteState
  lock: lockState
  tab: string
  search: string
  poolArr: any
  setPoolArr: (value: any) => void
}

const HeaderRowVote = ({
  activeVote,
  filterData,
  loading,
  activePagination = true,
  activeSlider = true,
  // setVotePercentage,
  vote,
  lock,
  tab,
  search,
  poolArr,
  setPoolArr,
}: HeaderRowVoteProps) => {
  const [data, setData] = useState<VoteTableElement[]>(vote.voteTableElement)
  const [showTooltip, setShowTooltip] = useState(false)
  // const [voteValue, setVoteValue] = useState<Number>(0)
  const [selectedRanges, setSelectedRanges] = useState<number[]>([])

  // Function to handle when a subcomponent updates its range
  const handleRangeUpdate = (index: number, value: number) => {
    const newRanges = [...selectedRanges]
    newRanges[index] = value
    setSelectedRanges(newRanges)
    // setVoteValue(newRanges.reduce((a, b) => a + b, 0))
    // setVotePercentage(newRanges.reduce((a, b) => a + b, 0))
  }

  const [sidx, setSidx] = useState<number>(1)
  const [svalue, setSvalue] = useState<'asc' | 'desc' | 'normal'>('normal')

  const [itemsPerPage, setItemPerPage] = useState<number>(5)
  const [activePage, setActivePage] = useState<number>(1)

  function paginate(items: any, currentPage: number, itemsPerPage: number) {
    // Calculate total pages
    const totalPages = Math.ceil(items.length / itemsPerPage)

    // Ensure current page isn't out of range
    currentPage = Math.max(1, Math.min(currentPage, totalPages))

    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    const paginatedItems = items.slice(start, end)

    return paginatedItems
  }

  useEffect(() => {
    if (search === '') {
      if (tab === 'STABLE') {
        setData(vote?.voteTableElement.filter((pos) => pos.pair.stable))
      } else if (tab === 'VOLATILE') {
        setData(vote?.voteTableElement.filter((pos) => pos.pair.hasOwnProperty('stable') && !pos.pair.stable))
      } else if (tab === 'CONCENTRATED') {
        setData(vote.voteTableElement.filter((pos) => !pos.pair.hasOwnProperty('stable')))
      } else {
        setData(vote.voteTableElement)
      }
    } else {
      const newData = vote?.voteTableElement.filter((pos) => {
        if (
          pos.token0Symbol.toLowerCase().includes(search.toLowerCase()) ||
          pos.token1Symbol.toLowerCase().includes(search.toLowerCase())
        )
          return pos
      })
      setData(newData)
    }
  }, [search, tab, vote.voteTableElement])

  const pagination = paginate(data, activePage, itemsPerPage)

  useEffect(() => {
    if (sidx === 1) {
      if (svalue === 'asc') {
        const sortedArr = [...data].sort((a, b) => a.poolAPR - b.poolAPR)
        setData(sortedArr)
      } else if (svalue === 'desc') {
        const sortedArr = [...data].sort((a, b) => b.poolAPR - a.poolAPR)
        setData(sortedArr)
      } else {
        const sortedArr = [...data].sort((a, b) => a.poolAPR - b.poolAPR)
        setData(sortedArr)
      }
    } else if (sidx === 2) {
      if (svalue === 'asc') {
        const sortedArr = [...data].sort(
          (a, b) =>
            Number(a.voteWeightPercentage?.mulNumber(100).toString({ maxDecimalPlaces: 2 })) -
            Number(b.voteWeightPercentage?.mulNumber(100).toString({ maxDecimalPlaces: 2 }))
        )
        setData(sortedArr)
      } else if (svalue === 'desc') {
        const sortedArr = [...data].sort(
          (a, b) =>
            Number(b.voteWeightPercentage?.mulNumber(100).toString({ maxDecimalPlaces: 2 })) -
            Number(a.voteWeightPercentage?.mulNumber(100).toString({ maxDecimalPlaces: 2 }))
        )
        setData(sortedArr)
      } else {
        const sortedArr = [...data].sort(
          (a, b) =>
            Number(a.voteWeightPercentage?.mulNumber(100).toString({ maxDecimalPlaces: 2 })) -
            Number(b.voteWeightPercentage?.mulNumber(100).toString({ maxDecimalPlaces: 2 }))
        )
        setData(sortedArr)
      }
    } else if (sidx === 3) {
      if (svalue === 'asc') {
        const sortedArr = [...data].sort(
          (a, b) =>
            Number(a.yourVoteWeightPercentage?.mulNumber(100).toString({ maxDecimalPlaces: 2 })) -
            Number(b.yourVoteWeightPercentage?.mulNumber(100).toString({ maxDecimalPlaces: 2 }))
        )
        setData(sortedArr)
      } else if (svalue === 'desc') {
        const sortedArr = [...data].sort(
          (a, b) =>
            Number(b.yourVoteWeightPercentage?.mulNumber(100).toString({ maxDecimalPlaces: 2 })) -
            Number(a.yourVoteWeightPercentage?.mulNumber(100).toString({ maxDecimalPlaces: 2 }))
        )
        setData(sortedArr)
      } else {
        const sortedArr = [...data].sort(
          (a, b) =>
            Number(a.yourVoteWeightPercentage?.mulNumber(100).toString({ maxDecimalPlaces: 2 })) -
            Number(b.yourVoteWeightPercentage?.mulNumber(100).toString({ maxDecimalPlaces: 2 }))
        )
        setData(sortedArr)
      }
    } else if (sidx === 4) {
      if (svalue === 'asc') {
        const sortedArr = [...data].sort(
          (a, b) => Number(a.dollarRewardsValue.toString()) - Number(b.dollarRewardsValue.toString())
        )
        setData(sortedArr)
      } else if (svalue === 'desc') {
        const sortedArr = [...data].sort(
          (a, b) => Number(b.dollarRewardsValue.toString()) - Number(a.dollarRewardsValue.toString())
        )
        setData(sortedArr)
      } else {
        const sortedArr = [...data].sort(
          (a, b) => Number(a.dollarRewardsValue.toString()) - Number(b.dollarRewardsValue.toString())
        )
        setData(sortedArr)
      }
    }
  }, [sidx, svalue])

  return (
    <div className="relative z-10">
      <div className="w-full mb-2.5 xl:mb-5">
        <div className="max-xl:hidden">
          <TableHead
            items={[
              { text: 'Assets', className: 'w-[30%] text-xs', sortable: false },
              { text: 'APR', className: 'text-center  w-[10%] text-xs', sortable: true },
              { text: 'Total Votes', className: 'w-[15%] text-right text-xs', sortable: true },
              { text: 'Your Votes', className: 'w-[15%] text-right text-xs', sortable: true },
              {
                text: 'Total Rewards',
                className: 'w-[10%] text-right text-xs',
                sortable: true,
              },
              { text: 'Vote', className: 'w-[20%] text-right text-xs', sortable: false },
            ]}
            setSort={setSvalue}
            sort={svalue}
            setSortIndex={setSidx}
            sortIndex={sidx}
          />
        </div>
        {pagination ? (
          <>
            <TableBody>
              {vote.appState == 'loading' ? (
                <>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <TableSkeleton key={index} />
                  ))}
                </>
              ) : (
                <>
                  <div className="hidden xl:flex flex-col justify-center gap-3">
                    {pagination.map((row: any, index: number) => (
                      <Fragment key={index}>
                        <RowDataVote
                          index={index}
                          row={row}
                          activeVote={activeVote}
                          activeSlider={activeSlider}
                          // setVoteValue={setVoteValue}
                          // onRangeUpdate={handleRangeUpdate}
                          poolArr={poolArr}
                          setPoolArr={setPoolArr}
                        />
                        {/* <RowDataVote row={row} activeVote={activeVote} /> */}
                      </Fragment>
                    ))}
                  </div>
                  <div className="flex flex-col justify-center gap-3 xl:hidden">
                    {pagination.map((row: any, index: number) => (
                      <Fragment key={index}>
                        <MobileRowVote
                          index={index}
                          row={row}
                          activeVote={activeVote}
                          activeSlider={activeSlider}
                          // onRangeUpdate={handleRangeUpdate}
                          poolArr={poolArr}
                          setPoolArr={setPoolArr}
                        />
                      </Fragment>
                    ))}
                  </div>
                </>
              )}
            </TableBody>
            {activePagination && (
              <>
                <div className="items-center hidden xl:flex py-4">
                  {/* <p className="text-sm text-shark-100">Showing 2 out of 2 migrations...</p> */}
                  <Pagination
                    className="mx-auto"
                    numberPages={
                      data
                        ? Math.ceil(data.length / itemsPerPage)
                        : Math.ceil(vote.voteTableElement.length / itemsPerPage)
                    }
                    activePage={activePage}
                    itemsPerPage={itemsPerPage}
                    setActivePage={setActivePage}
                    setItemPerPage={setItemPerPage}
                  />
                </div>
                <div className="block xl:hidden py-4">
                  <PaginationMobile
                    className=""
                    count={data.length}
                    numberPages={
                      data
                        ? Math.ceil(data.length / itemsPerPage)
                        : Math.ceil(vote.voteTableElement.length / itemsPerPage)
                    }
                    activePage={activePage}
                    itemsPerPage={itemsPerPage}
                    setActivePage={setActivePage}
                    setItemPerPage={setItemPerPage}
                  />
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <NotFoundGauges />
          </>
        )}
      </div>
    </div>
  )
}

export default HeaderRowVote
