'use client'
import { Button, Pagination, PaginationMobile } from '@/src/components/UI'
import Item from './Item'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { RankingEntry, useRingsPointsLeaderboard } from '@/src/library/hooks/rings/useRingsPoints'
import Loader from '../../UI/Icons/Loader'
import cn from '@/src/library/utils/cn'
import useActiveConnectionDetails from '@/src/library/hooks/web3/useActiveConnectionDetails'

const Leaderboard = () => {
  const [itemsPerPage, setItemPerPage] = useState<number>(20)
  const { account, isConnected } = useActiveConnectionDetails()

  const [activePage, setActivePage] = useState<number>(1)
  const [sort, setSort] = useState(false)
  const handleSort = () => setSort(!sort)
  const { data, isLoading } = useRingsPointsLeaderboard()
  const [leaderboardData, setLeaderboardData] = useState<RankingEntry[]>([])
  useEffect(() => {
    if (!data || isLoading) return
    const orderedData = data
      .sort((a, b) => Number(b.accumulated_rings_points) - Number(a.accumulated_rings_points))
      .map((entry, index) => ({ ...entry, ranking: index + 1 }))
    setLeaderboardData(orderedData)
  }, [data, isLoading])

  function paginate(items: RankingEntry[], currentPage: number, itemsPerPage: number) {
    const totalPages = Math.ceil(items.length / itemsPerPage)
    currentPage = Math.max(1, Math.min(currentPage, totalPages))
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return items.slice(start, end)
  }

  const sortedData = sort ? leaderboardData.slice().reverse() : leaderboardData
  const paginatedData = paginate(sortedData, activePage, itemsPerPage)
  // paginatedData.push({ id: '0xb279Cb42Ab3d598Eb3A864399C11a52a5f506bA4', accumulated_rings_points: '28348', ranking: 154 })

  if (isLoading)
    return (
      <div className="mb-10 w-full mx-auto flex justify-center">
        <Loader size={'40px'} />
      </div>
    )

  return (
    <div className="mb-10 w-full">
      <div className="flex flex-col xl:flex-row items-start w-full justify-between mb-8 xl:items-center">
        <h2 className="text-white text-lg mb-3 font-medium">Leaderboard</h2>
      </div>
      <div className="relative">
        <div className="flex items-center w-full mb-3">
          <span className="text-white w-36 text-center text-sm">#</span>
          <span className="text-white w-full text-sm">Ranking Addresses</span>
          <span
            className="text-white w-36 cursor-pointer text-center text-sm flex items-center justify-end gap-x-2 mr-4"
            onClick={() => handleSort()}
          >
            RINGS
            <i className={cn(`icon-chevron flex text-xs `, sort ? '' : '-rotate-180')}></i>
          </span>
        </div>
        {paginatedData.map((data, index: number) => (
          <Item key={index} data={data} isUser={account?.toLowerCase() === data.id.toLowerCase() ? true : false}/>
        ))}
        <Pagination
          className="mx-auto"
          numberPages={Math.ceil(leaderboardData.length / itemsPerPage)}
          activePage={activePage}
          setActivePage={setActivePage}
          itemsPerPage={itemsPerPage}
          setItemPerPage={setItemPerPage}
        />
        <div className="lg:hidden">
          <PaginationMobile
            count={leaderboardData.length}
            itemsPerPage={itemsPerPage}
            setItemPerPage={setItemPerPage}
            activePage={activePage}
            setActivePage={setActivePage}
            className="mx-auto"
            numberPages={Math.ceil(leaderboardData.length / itemsPerPage)}
          />
        </div>
      </div>
    </div>
  )
}

export default Leaderboard
