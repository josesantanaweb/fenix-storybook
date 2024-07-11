'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import RowSkeleton from './RowSkeleton'
import { TableHead, TableBody, TableCell, TableRow, Button, Pagination } from '@/src/components/UI'

const Voted = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }, [])

  return (
    <div className="relative">
      <div className="hidden w-full mb-10 md:block">
        <TableHead
          items={[
            { text: 'Pools', className: 'w-[30%]', sortable: true },
            { text: 'Fees', className: 'text-center  w-[10%]', sortable: true },
            { text: 'Total Votes', className: 'w-[15%] text-center', sortable: true },
            { text: 'Incentives', className: 'w-[15%] text-center', sortable: true },
            { text: 'Total Votes', className: 'w-[15%] text-center', sortable: true },
            { text: 'vApr', className: 'w-[15%] text-center', sortable: true },
          ]}
          setSort={() => {}}
          sort={'normal'}
          setSortIndex={() => {}}
          sortIndex={1}
        />

        <TableBody>
          {loading ? (
            <>
              {Array.from({ length: 1 }).map((_, index) => (
                <RowSkeleton key={index} />
              ))}
            </>
          ) : (
            <TableRow>
              <TableCell className="w-[30%]">
                <div className="flex items-start gap-2">
                  <div className="flex items-center">
                    <Image
                      src="/static/images/tokens/FNX.svg"
                      alt="token"
                      className="rounded-full w-7 h-7"
                      width={20}
                      height={20}
                    />
                    <Image
                      src="/static/images/tokens/ETH.svg"
                      alt="token"
                      className="-ml-4 rounded-full w-7 h-7"
                      width={20}
                      height={20}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div>
                      <h5 className="text-sm text-white">FNX / ETH</h5>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="tertiary" className="!py-1">
                        Volatile Pool
                      </Button>
                      <Button variant="tertiary" className="!py-1">
                        0.3%
                      </Button>
                      <Button variant="tertiary" className="!py-1">
                        <span className="icon-info"></span>
                      </Button>
                    </div>
                    <div className="flex  flex-col gap-2">
                      <div>
                        <p className="text-xs">{`Votes 25,954,634.25   >   4.97%`}</p>
                      </div>
                      <div>
                        {' '}
                        <p className="text-xs">TVL 3,332,135.77</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TableCell>
              {/* firts */}
              <TableCell className="w-[10%] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-white text-sm">$12,871.72</p>
                  <div className="text-shark-100 text-sm">
                    <p>110;723.97 AERO</p>
                    <p>5,381.87 USDbC</p>
                  </div>
                </div>
              </TableCell>
              {/* second */}
              <TableCell className="w-[15%] flex items-center justify-center">
                <div className="text-sm flex-col text-center ">
                  <p>1.12M FNX</p>
                  <p className="text-shark-100">57.78%</p>
                </div>
              </TableCell>
              {/* third */}
              <TableCell className="w-[15%] flex items-center justify-center">
                <div className="text-sm text-center">
                  <p>No available incentives</p>
                  <p className="text-shark-100 gap-2">
                    <span className="icon-link"></span>Add Incentives
                  </p>
                </div>
              </TableCell>
              {/* fourth */}
              <TableCell className="w-[15%] flex items-center justify-center">
                <div className="text-sm text-center">
                  <p>$12,871.72</p>
                  <p className="text-shark-100">Fees + Incentives</p>
                </div>
              </TableCell>
              {/* fifth */}
              <TableCell className="flex items-center justify-center w-[15%]">
                <div className="text-white text-sm text-center">
                  <p>46.77%</p>
                  <Button variant="tertiary">Select </Button>
                </div>
              </TableCell>
              {/* sixth */}
            </TableRow>
          )}
        </TableBody>
      </div>
      <div className="items-center hidden md:flex">
        {/* <p className="text-sm text-shark-100">Showing 2 out of 2 migrations...</p> */}
        <Pagination
          className="mx-auto"
          numberPages={7}
          activePage={1}
          setActivePage={() => {}}
          itemsPerPage={20}
          setItemPerPage={() => {}}
        />
        <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 px-4 cursor-pointer border rounded-lg border-shark-300 bg-shark-400 bg-opacity-40 hover:bg-outrageous-orange-400">
          <span className="text-lg icon-cog text-white"></span>
        </div>
      </div>
    </div>
  )
}

export default Voted
