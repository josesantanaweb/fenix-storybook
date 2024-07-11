'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import RowSkeleton from '@/src/components/UI/Table/TableSkeleton'
import { TableHead, TableBody, TableCell, TableRow, Button, Pagination, PaginationMobile } from '@/src/components/UI'
import NotFoundLock from './NotFoundLock'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { AppThunkDispatch, useAppSelector } from '@/src/state'
import { fetchNftsAsync } from '@/src/state/lock/reducer'
import { useDispatch } from 'react-redux'
import { lockState } from '@/src/state/lock/types'
import formatDate from '@/src/library/utils/foramatDate'

type LOCK = {
  LOCK_ID: string
  STATUS: boolean
  VOTE: boolean
  TYPE?: string
}

interface MyLocksProps {
  activePagination?: boolean
  Locks: LOCK[]
  tab: string
}

const MyLocks = ({ activePagination = true, Locks, tab }: MyLocksProps) => {
  const [nowTime, setnowTime] = useState<Number>(0)
  const { push } = useRouter()
  const router = useRouter()
  const { address, chainId } = useAccount()
  const dispatch = useDispatch<AppThunkDispatch>()
  const lock = useAppSelector<lockState>((state) => state.lock)
  const handlerNavigation = () => push('/lock/manage')

  const [data, setData] = useState<any>(lock.positions)
  const [sidx, setSidx] = useState<number>(1)
  const [svalue, setSvalue] = useState<'asc' | 'desc' | 'normal'>('normal')

  useEffect(() => {
    if (address && chainId) dispatch(fetchNftsAsync({ address, chainId }))
    const now = new Date().getTime() / 1000
    setnowTime(now)
  }, [address])

  const handleManage = (id: Number) => {
    router.push(`lock/${id}`)
  }

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
    if (tab === 'ACTIVE') {
      const newdata = lock.positions.filter((pos) => {
        if (BigInt(nowTime.toFixed(0).toString()) < pos.veNFTInfo.lockEnd) {
          return pos
        }
      })
      setData(newdata)
    } else if (tab === 'EXPIRED') {
      const newdata = lock.positions.filter((pos) => {
        if (BigInt(nowTime.toFixed(0).toString()) >= pos.veNFTInfo.lockEnd) {
          return pos
        }
      })
      setData(newdata)
    } else if (tab === 'VOTE') {
      const newdata = lock.positions.filter((pos) => {
        if (pos.veNFTInfo.voted) {
          return pos
        }
      })
      setData(newdata)
    } else if (tab === 'NOT VOTE') {
      const newdata = lock.positions.filter((pos) => {
        if (!pos.veNFTInfo.voted) {
          return pos
        }
      })
      setData(newdata)
    } else setData(lock.positions)
  }, [lock.positions, tab])

  useEffect(() => {
    if (sidx === 1) {
      if (svalue === 'asc') {
        const sortedArr = [...data].sort(
          (a, b) => Number(a.veNFTInfo.amount) / 10 ** 18 - Number(b.veNFTInfo.amount) / 10 ** 18
        )
        setData(sortedArr)
      } else if (svalue === 'desc') {
        const sortedArr = [...data].sort(
          (a, b) => Number(b.veNFTInfo.amount) / 10 ** 18 - Number(a.veNFTInfo.amount) / 10 ** 18
        )
        setData(sortedArr)
      } else {
        const sortedArr = [...data].sort(
          (a, b) => Number(a.veNFTInfo.amount) / 10 ** 18 - Number(b.veNFTInfo.amount) / 10 ** 18
        )
        setData(sortedArr)
      }
    } else if (sidx === 2) {
      if (svalue === 'asc') {
        const sortedArr = [...data].sort(
          (a, b) => Number(a.veNFTInfo.voting_amount) / 10 ** 18 - Number(b.veNFTInfo.voting_amount) / 10 ** 18
        )
        setData(sortedArr)
      } else if (svalue === 'desc') {
        const sortedArr = [...data].sort(
          (a, b) => Number(b.veNFTInfo.voting_amount) / 10 ** 18 - Number(a.veNFTInfo.voting_amount) / 10 ** 18
        )
        setData(sortedArr)
      } else {
        const sortedArr = [...data].sort(
          (a, b) => Number(a.veNFTInfo.voting_amount) / 10 ** 18 - Number(b.veNFTInfo.voting_amount) / 10 ** 18
        )
        setData(sortedArr)
      }
    } else if (sidx === 3) {
      if (svalue === 'asc') {
        const sortedArr = [...data].sort((a, b) => Number(a.veNFTInfo.lockEnd) - Number(b.veNFTInfo.lockEnd))
        setData(sortedArr)
      } else if (svalue === 'desc') {
        const sortedArr = [...data].sort((a, b) => Number(b.veNFTInfo.lockEnd) - Number(a.veNFTInfo.lockEnd))
        setData(sortedArr)
      } else {
        const sortedArr = [...data].sort((a, b) => Number(a.veNFTInfo.lockEnd) - Number(b.veNFTInfo.lockEnd))
        setData(sortedArr)
      }
    }
  }, [sidx, svalue])

  const pagination = paginate(data, activePage, itemsPerPage)

  return (
    <>
      <div className="relative hidden lg:block z-10 xl:mb-5">
        <div className="w-full">
          <TableHead
            items={[
              { text: 'Lock ID', className: 'text-left text-xs w-[20%]', sortable: false },
              { text: 'Lock Amount', className: 'text-left text-xs w-[15%]', sortable: true },
              { text: 'Voting Power', className: 'text-left text-xs w-[15%]', sortable: true },
              { text: 'Unlock Date', className: 'text-left text-xs w-[15%]', sortable: true },
              { text: 'Vote Status', className: 'text-center text-xs w-[15%]', sortable: false },
              { text: 'Action', className: 'text-right text-xs w-[20%]', sortable: false },
            ]}
            setSort={setSvalue}
            sort={svalue}
            setSortIndex={setSidx}
            sortIndex={sidx}
          />
          {lock.positions.length !== 0 ? (
            <>
              <TableBody>
                {lock.appState == 'loading' ? (
                  <>
                    {Array.from({ length: 1 }).map((_, index) => (
                      <RowSkeleton key={index} />
                    ))}
                  </>
                ) : (
                  <>
                    {pagination.map((lock: any, index: number) => {
                      //
                      return (
                        <TableRow key={index}>
                          <TableCell className="w-[20%]">
                            <div className="flex items-center gap-3">
                              <Image
                                // src={'/static/images/vote/fenix-logo.svg'}
                                src={'/static/images/tokens/FNX.svg'}
                                className="h-[40px] w-[40px]"
                                alt="alternative fenix"
                                width={40}
                                height={40}
                              />
                              <div className="flex flex-col items-center">
                                <h1 className="text-xs">{lock.veNFTInfo.id.toString()}</h1>
                                {BigInt(nowTime.toFixed(0).toString()) < lock.veNFTInfo.lockEnd ? (
                                  <p className="text-xs text-green-400">
                                    <span>•</span> Active
                                  </p>
                                ) : (
                                  <p className="text-xs text-red-700">
                                    <span>•</span> Expired
                                  </p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="w-[15%]">
                            <div className="flex items-center gap-2">
                              <Image
                                src={`/static/images/tokens/FNX.svg`}
                                alt="token"
                                className="w-5 h-5 rounded-full"
                                width={20}
                                height={20}
                              />
                              <p className="text-xs text-white">
                                {(Number(lock.veNFTInfo.amount) / 10 ** 18).toFixed(2)}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="w-[15%]">
                            <div className="flex items-center gap-2">
                              <Image
                                src={`/static/images/tokens/FNX.svg`}
                                alt="token"
                                className="w-5 h-5 rounded-full"
                                width={20}
                                height={20}
                              />
                              <p className="text-xs text-white">
                                {(Number(lock.veNFTInfo.voting_amount) / 10 ** 18).toFixed(2)}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="w-[15%]">
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-white">{formatDate(Number(lock.veNFTInfo.lockEnd))}</p>
                            </div>
                          </TableCell>
                          <TableCell className="w-[15%] flex justify-center">
                            {lock.veNFTInfo.voted ? (
                              <span className="flex items-center bg-opacity-20 w-[105px] text-xs justify-center px-5 py-1 text-white border border-solid border-green-400 bg-green-500 rounded-xl ">
                                Voted
                              </span>
                            ) : (
                              <span className="flex items-center bg-opacity-20 w-[105px] text-xs justify-center px-5 py-1 text-white border border-solid border-red-600 bg-red-700 rounded-xl ">
                                Not Voted
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="w-[20%]">
                            <div className="flex justify-end w-full">
                              <Button
                                variant="tertiary"
                                className="h-[38px] w-[90px] bg-opacity-40"
                                onClick={() => handleManage(Number(lock.veNFTInfo.id))}
                              >
                                <span className="text-xs">Manage</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </>
                )}
              </TableBody>
              {activePagination && (
                <div className="items-center hidden xl:flex">
                  <Pagination
                    className="mx-auto"
                    numberPages={
                      data ? Math.ceil(data.length / itemsPerPage) : Math.ceil(lock.positions.length / itemsPerPage)
                    }
                    activePage={activePage}
                    itemsPerPage={itemsPerPage}
                    setActivePage={setActivePage}
                    setItemPerPage={setItemPerPage}
                  />
                </div>
              )}
            </>
          ) : (
            <NotFoundLock />
          )}
        </div>
      </div>
    </>
  )
}

export default MyLocks
