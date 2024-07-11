'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import RowSkeleton from '@/src/components/UI/Table/TableSkeleton'
import { TableBody, TableCell, TableRow, PaginationMobile, Button } from '@/src/components/UI'
import { LOCKS_INFO_API } from '../data'
import NotFoundLock from '../NotFoundLock'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { AppThunkDispatch, useAppSelector } from '@/src/state'
import { lockState } from '@/src/state/lock/types'
import { useAccount } from 'wagmi'
import { fetchNftsAsync } from '@/src/state/lock/reducer'
import formatDate from '@/src/library/utils/foramatDate'

type LOCK = {
  LOCK_ID: string
  STATUS: boolean
  VOTE: boolean
}
interface MylocksMobileProps {
  activePagination?: boolean
  Locks: LOCK[]
  tab: string
}

const MylocksMobile = ({ activePagination = true, Locks, tab }: MylocksMobileProps) => {
  const [loading, setLoading] = useState(true)
  const [accordion, setAccordion] = useState<{ [key: number]: boolean }>({})
  const [nowTime, setnowTime] = useState<Number>(0)
  const router = useRouter()
  const { address, chainId } = useAccount()
  const dispatch = useDispatch<AppThunkDispatch>()
  const lock = useAppSelector<lockState>((state) => state.lock)
  const { push } = useRouter()
  const handlerNavigation = () => push('/lock/manage')

  const handlerAccordion = (index: number) => {
    setAccordion((prevState) => ({ ...prevState, [index]: !prevState[index] }))
  }
  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }, [])

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

  let data
  if (tab === 'ACTIVE') {
    data = lock.positions.filter((pos) => {
      if (BigInt(nowTime.toFixed(0).toString()) < pos.veNFTInfo.lockEnd) {
        return pos
      }
    })
  } else if (tab === 'EXPIRED') {
    data = lock.positions.filter((pos) => {
      if (BigInt(nowTime.toFixed(0).toString()) >= pos.veNFTInfo.lockEnd) {
        return pos
      }
    })
  } else if (tab === 'VOTE') {
    data = lock.positions.filter((pos) => {
      if (pos.veNFTInfo.voted) {
        return pos
      }
    })
  } else if (tab === 'NOT VOTE') {
    data = lock.positions.filter((pos) => {
      if (!pos.veNFTInfo.voted) {
        return pos
      }
    })
  } else data = lock.positions

  //

  const pagination = paginate(data, activePage, itemsPerPage)

  return (
    <div className="relative lg:hidden">
      <div className="w-full">
        {pagination.length !== 0 ? (
          <>
            <TableBody>
              {loading ? (
                <>
                  {Array.from({ length: 10 }).map((_, index) => (
                    <RowSkeleton key={index} />
                  ))}
                </>
              ) : (
                <>
                  {pagination.map((lock: any, index: number) => {
                    return (
                      <TableRow key={index}>
                        <TableCell className="flex-col  w-full">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Image
                                src={'/static/images/vote/fenix-logo.svg'}
                                className="h-[40px] w-[40px]"
                                alt="alternative fenix"
                                width={40}
                                height={40}
                              />
                              <div className="flex flex-col ">
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
                            <div>
                              <p className="lg:text-sm text-xs text-shark-100">Unlock Date</p>
                              <p className="lg:text-sm text-xs">{formatDate(Number(lock.veNFTInfo.lockEnd))}</p>
                            </div>
                            <div>
                              <span
                                onClick={() => handlerAccordion(index)}
                                className={`cursor-pointer icon-chevron block  ${accordion[index] ? 'rotate-180' : ''}`}
                              ></span>
                            </div>
                          </div>
                          {accordion[index] && (
                            <>
                              <div className="flex flex-col gap-3 p-2 mt-5 text-xs">
                                <div className="flex items-center justify-between">
                                  <div className="flex flex-col gap-1 items-center">
                                    <p className="text-shark-100">Lock Amount</p>
                                    <p className="flex gap-2 items-center">
                                      <Image src={'/static/images/tokens/FNX.svg'} alt="" height={17} width={17} />
                                      {(Number(lock.veNFTInfo.amount) / 10 ** 18).toFixed(2)}
                                    </p>
                                  </div>
                                  <div className="flex flex-col gap-1 items-center">
                                    <p className="text-shark-100 text-center">Vote Power</p>
                                    <p className="flex gap-2 items-center">
                                      <Image src={'/static/images/tokens/FNX.svg'} alt="" height={17} width={17} />
                                      {(Number(lock.veNFTInfo.voting_amount) / 10 ** 18).toFixed(2)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-shark-100 text-center">Vote Status</p>
                                    {lock.veNFTInfo.voted ? (
                                      <span
                                        className="flex items-center bg-opacity-20 lg:w-[105px] 
                                      text-xs justify-center  py-1 px-2
                                      text-white border border-solid border-green-400 bg-green-500 rounded-xl "
                                      >
                                        Voted
                                      </span>
                                    ) : (
                                      <span
                                        className="flex items-center bg-opacity-20 px-2 lg:w-[105px]  
                                      text-xs justify-center py-1 text-white border 
                                      border-solid border-red-600 bg-red-700 rounded-xl "
                                      >
                                        Not Voted
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <Button
                                  onClick={() => handleManage(Number(lock.veNFTInfo.id))}
                                  variant="tertiary"
                                  className="w-full !text-xs"
                                >
                                  Manage
                                </Button>
                              </div>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </>
              )}
            </TableBody>
            {activePagination && (
              <div className="py-5">
                <PaginationMobile
                  count={data ? data.length : lock.positions.length}
                  itemsPerPage={itemsPerPage}
                  setItemPerPage={setItemPerPage}
                  activePage={activePage}
                  setActivePage={setActivePage}
                  className="mx-auto"
                  numberPages={
                    data ? Math.ceil(data.length / itemsPerPage) : Math.ceil(lock.positions.length / itemsPerPage)
                  }
                />
              </div>
            )}
          </>
        ) : (
          <NotFoundLock />
        )}
      </div>
    </div>
  )
}

export default MylocksMobile
