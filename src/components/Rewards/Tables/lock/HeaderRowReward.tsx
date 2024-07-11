'use client'
import { Fragment, useEffect, useState } from 'react'
import { TableSkeleton, TableBody, TableHead, PaginationMobile, TableRow, TableCell, Button } from '@/src/components/UI'
import { Pagination } from '@/src/components/UI'
import RowReward from './RowReward'
import NotFoundLock from '../../../Lock/NotFoundLock'
import Image from 'next/image'
import { useAccount } from 'wagmi'
import formatDate from '@/src/library/utils/foramatDate'
import { AppThunkDispatch } from '@/src/state'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { fetchNftsAsync } from '@/src/state/lock/reducer'

type filterData = {
  type: string
  APR: string
}

interface HeaderRowRewardProps {
  loading: boolean
  // filterData: filterData[]
  filterData: any
  activeVote: boolean
  activePagination?: boolean
  activeSlider?: boolean
  search: string
}

const HeaderRowReward = ({
  activeVote,
  filterData,
  loading,
  activePagination = true,
  activeSlider = true,
  search,
}: HeaderRowRewardProps) => {
  const { push } = useRouter()
  const router = useRouter()
  const [showTooltip, setShowTooltip] = useState(false)
  const [openInfo, setOpenInfo] = useState<boolean>(false)
  const [infoId, setInfoId] = useState<number | null>(null)
  const [nowTime, setnowTime] = useState<Number>(0)
  const [data, setData] = useState<filterData[]>(filterData)
  const { address, chainId } = useAccount()
  const dispatch = useDispatch<AppThunkDispatch>()

  useEffect(() => {
    if (address && chainId) dispatch(fetchNftsAsync({ address, chainId }))
    const now = new Date().getTime() / 1000
    setnowTime(now)
  }, [address])
  const handleManage = (id: Number) => {
    router.push(`lock/${id}`)
  }

  useEffect(() => {
    //
    if (search.length > 0) {
      const filterArr = filterData.filter((item: any) => {
        if (
          item.veNFTInfo.tokenSymbol.toLowerCase().includes(search.toLowerCase()) ||
          item.veNFTInfo.token.toLowerCase().includes(search.toLowerCase()) ||
          item.veNFTInfo.account.toLowerCase().includes(search.toLowerCase())
        ) {
          return item
        }
      })
      setData(filterArr)
    } else {
      setData(filterData)
    }
  }, [filterData, search])

  return (
    <div className="relative z-10">
      <div className="w-full mb-2.5 xl:mb-5">
        <div className="max-xl:hidden">
          <TableHead
            items={[
              { text: 'Lock Id', className: 'w-[50%] text-xs', sortable: true },
              { text: 'Rewards', className: 'text-center  w-[20%] text-xs', sortable: true },
              { text: 'Action', className: 'w-[30%] text-right text-xs', sortable: true },
            ]}
            setSort={() => {}}
            sort={'normal'}
            setSortIndex={() => {}}
            sortIndex={1}
          />
        </div>

        {data.length !== 0 ? (
          <>
            <TableBody className="h-[350px] overflow-y-scroll">
              {loading ? (
                <>
                  {Array.from({ length: filterData.length }).map((_, index) => (
                    <TableSkeleton key={index} />
                  ))}
                </>
              ) : (
                <>
                  {activeVote &&
                    data.map((lock: any, index: number) => {
                      //
                      return (
                        <TableRow key={index}>
                          <TableCell className="w-[50%]">
                            <div className="flex items-center gap-3">
                              <Image
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
                          <TableCell className="w-[20%] flex justify-center">
                            <div className="relative flex items-center gap-2">
                              {openInfo && infoId == index && (
                                <>
                                  <div className="absolute z-10 bg-shark-950 rounded-lg border border-shark-300 w-auto lg:w-[230px] top-9 px-5 py-3 gap-y-1">
                                    <div className="flex justify-between items-center gap-2">
                                      <div className="w-fit flex flex-col justify-center items-start">
                                        <p className="text-white text-xs">Bribe</p>
                                        <p className="flex items-center gap-2 text-xs text-shark-100">21 FNX</p>
                                        <p className="w-full flex items-center gap-2 text-xs text-shark-100">
                                          200.2 fnUSDT
                                        </p>
                                      </div>
                                      <div className="flex flex-col justify-center items-start">
                                        <p className="text-white text-xs">Fees</p>
                                        <p className="flex items-center gap-2 text-xs text-shark-100">21 FNX</p>
                                        <p className="flex items-center gap-2 text-xs text-shark-100">200.2 fnUSDT</p>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                              <p className="text-xs text-white">
                                ${(Number(lock.veNFTInfo.amount) / 10 ** 18).toFixed(2)}
                              </p>
                              <span
                                className="icon-info"
                                onMouseEnter={() => {
                                  setOpenInfo(true)
                                  setInfoId(index)
                                }}
                                onMouseLeave={() => {
                                  setOpenInfo(false)
                                  setInfoId(null)
                                }}
                              ></span>
                            </div>
                          </TableCell>
                          <TableCell className="w-[30%]">
                            <div className="flex justify-end w-full">
                              <Button
                                variant="primary"
                                // className="h-[38px] w-[90px] bg-opacity-40"
                                className="flex gap-2 items-center !text-xs"
                                onClick={() => handleManage(Number(lock.veNFTInfo.id))}
                              >
                                Claim Rewards
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}

                  {!activeVote && <NotFoundLock info={'You have not selected any veFNX yet.'} />}
                </>
              )}
            </TableBody>
            {activePagination && (
              <>
                <div className="items-center hidden xl:flex py-4">
                  {/* <p className="text-sm text-shark-100">Showing 2 out of 2 migrations...</p> */}
                  <Pagination
                    className="mx-auto"
                    numberPages={7}
                    activePage={1}
                    setActivePage={() => {}}
                    itemsPerPage={10}
                    setItemPerPage={() => {}}
                  />
                </div>
                <div className="block xl:hidden py-4">
                  <PaginationMobile
                    numberPages={7}
                    activePage={1}
                    setActivePage={() => {}}
                    itemsPerPage={10}
                    setItemPerPage={() => {}}
                    className=""
                    count={7}
                  />
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <NotFoundLock />
          </>
        )}
      </div>
    </div>
  )
}

export default HeaderRowReward
