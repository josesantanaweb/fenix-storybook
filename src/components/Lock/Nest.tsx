'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { TableHead, TableBody, TableCell, TableRow, Button, Pagination } from '@/src/components/UI'
import NotFoundLock from './NotFoundLock'
import { LOCKS_INFO_API } from './data'
import { useRouter } from 'next/navigation'
import RowSkeleton from '../Vote/RowSkeleton'
interface NestProps {
  activePagination?: boolean
}

const Nest = ({ activePagination = true }: NestProps) => {
  const [loading, setLoading] = useState(true)
  const [activeAccordion, setActiveAccordion] = useState<{ [key: number]: boolean }>({})
  const handlerAccordion = (index: number) => {
    setActiveAccordion((prevState) => ({ ...prevState, [index]: !prevState[index] }))
  }

  const { push } = useRouter()
  const handlerNavigation = () => push('lock/deposit')

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }, [])

  return (
    <div className="relative hidden lg:block z-10">
      <div className="w-full mb-5">
        <TableHead
          items={[
            { text: 'Your Nests', className: 'text-left w-[30%] text-xs ', sortable: true },
            { text: 'APR ', className: 'w-[25%] text-center text-xs', sortable: true },
            { text: 'Reward', className: ' w-[10%] text-xs', sortable: true },
            { text: 'Voting Power', className: ' text-center w-[15%] text-xs ', sortable: true },
            { text: 'Action', className: 'text-right w-[20%] text-xs', sortable: false },
          ]}
          setSort={() => {}}
          sort={'normal'}
          setSortIndex={() => {}}
          sortIndex={1}
        />

        {LOCKS_INFO_API.length !== 0 ? (
          <>
            <TableBody>
              {loading ? (
                <>
                  {Array.from({ length: 1 }).map((_, index) => (
                    <RowSkeleton key={index} />
                  ))}
                </>
              ) : (
                <>
                  {Array.from({ length: 0 }).map((_, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell className="w-[30%]">
                          <div className="flex gap-3 items-center">
                            <Button variant="tertiary" className="!px-3 !py-2 relative">
                              <span className="icon-lucide text-lg"></span>
                              <span className="bg-green-500 p-1 rounded-full absolute right-2 bottom-3"></span>
                            </Button>
                            <div className="flex flex-col text-center gap-2 ">
                              <div className="flex gap-2 items-center">
                                <h1 className="text-sm">veFNX Maxi</h1>{' '}
                                <p className="text-xs w-[71px] h-[21px] bg-shark-400 flex items-center justify-center rounded-lg border-shark-300 border">
                                  ID 11230
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <p
                                  className="text-xs flex justify-center items-center text-shark-100 w-[159px] h-[27px]
                        bg-shark-400 rounded-lg border-shark-300 border"
                                >
                                  Updated 2 days ago
                                </p>
                                <p className="text-xs flex items-center justify-center text-shark-100 bg-shark-400 w-auto px-2 h-[27px] rounded-lg border border-shark-300">
                                  0xc981...
                                  <span className="icon-document"></span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="w-[25%] flex items-center justify-center ">
                          <h1 className="text-xs me-4">34.58%</h1>
                        </TableCell>
                        <TableCell className="w-[10%] flex  ">
                          <div className="flex items-center gap-2 me-4">
                            <Image
                              src={`/static/images/tokens/FNX.svg`}
                              alt="token"
                              className="rounded-full w-[20px] h-[20px]"
                              width={20}
                              height={20}
                            />
                            <p className="text-xs text-white">FNX</p>
                          </div>
                        </TableCell>
                        <TableCell className="w-[15%] flex justify-center">
                          <div className="flex items-center gap-2">
                            <Image
                              src={`/static/images/tokens/FNX.svg`}
                              alt="token"
                              className="rounded-full w-[20px] h-[20px]"
                              width={20}
                              height={20}
                            />
                            <p className="text-xs text-white">744,621.46</p>
                          </div>
                        </TableCell>
                        <TableCell className="w-[20%] flex justify-end">
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={handlerNavigation}
                              variant="tertiary"
                              className="w-full h-[38px] !bg-opacity-40"
                            >
                              {' '}
                              <span className="text-xs">Deposit Lock</span>
                            </Button>
                            {activeAccordion[index] ? (
                              <span
                                onClick={() => {
                                  handlerAccordion(index)
                                }}
                                className="icon-chevron rotate-180 cursor-pointer"
                              ></span>
                            ) : (
                              <span
                                onClick={() => {
                                  handlerAccordion(index)
                                }}
                                className="icon-chevron cursor-pointer"
                              ></span>
                            )}
                          </div>
                        </TableCell>
                        {activeAccordion[index] && (
                          <div className="w-[93%] text-sm mx-auto border border-shark-400 p-2 rounded-lg">
                            <div className="text-white text-xs flex items-center justify-between  w-full">
                              <div className="flex gap-2 items-center">
                                <span className="icon-lock text-white"></span>
                                <p>Lock #11462</p>
                              </div>
                              <div className="flex gap-3">
                                <p>0.0</p>
                                <p>FNX locked for 3 years</p>
                              </div>
                              <div className="flex gap-3">
                                <p>0.0</p>
                                <p>FNX compouned</p>
                              </div>
                              <div>
                                <p>Withdraw available after first epoch</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </TableRow>
                    )
                  })}
                </>
              )}
            </TableBody>
            {activePagination && (
              <div className="items-center hidden md:flex">
                <p className="text-sm text-shark-100">Showing 2 out of 2 migrations...</p>
                <Pagination
                  className="mx-auto"
                  numberPages={7}
                  activePage={1}
                  itemsPerPage={20}
                  setActivePage={() => {}}
                  setItemPerPage={() => {}}
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

export default Nest
