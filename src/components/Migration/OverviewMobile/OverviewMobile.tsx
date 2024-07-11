'use client'
import { useState } from 'react'
import Image from 'next/image'
import AddressCheck from '../AddressCheck'
import TotalMigrated from '../TotalMigrated'
import { TableHead, TableBody, TableCell, TableRow, Button } from '@/src/components/UI'
import { TOKENS_LIST } from '../data'
import PaginationMobile from '@/src/components/UI/Pagination/PaginationMobile'

interface OverviewMobileProps {
  migrateStatus: string | undefined
  setMigrateStatus: (status: string | undefined) => void
}

const OverviewMobile = ({ migrateStatus, setMigrateStatus }: OverviewMobileProps) => {
  const [activeAccordion, setActiveAccordion] = useState<boolean>(false)

  const handlerActive = () => (activeAccordion ? setActiveAccordion(false) : setActiveAccordion(true))

  return (
    <div className="relative">
      <h5 className="mb-4 text-lg text-white">Migration Overview</h5>
      <div className="flex flex-col gap-5 mb-5 lg:hidden xl:hidden md:items-center md:justify-between xl:flex-row">
        <AddressCheck migrateStatus={migrateStatus} setMigrateStatus={setMigrateStatus} />
        <TotalMigrated />
      </div>

      {migrateStatus !== 'success' && migrateStatus !== 'wrong' && (
        <>
          <div className="flex flex-col items-center justify-center py-10 rounded-lg bg-shark-400 bg-opacity-40">
            <span className="text-5xl icon-circles text-shark-100"></span>
            <p className="text-sm text-shark-100">No migrations or tokens found</p>
          </div>
        </>
      )}
      {migrateStatus === 'success' && (
        <>
          <div className="w-full mb-10">
            <TableHead
              items={[{ text: 'Token', className: 'text-left w-[20%]', sortable: true }]}
              setSort={() => {}}
              sort={'normal'}
              setSortIndex={() => {}}
              sortIndex={1}
            />

            <TableBody>
              {TOKENS_LIST.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="flex w-full">
                    <div className="flex flex-col w-full">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center w-1/2 gap-2 px-3 py-[18px] rounded-lg bg-shark-400 bg-opacity-40">
                          <Image
                            src={`/static/images/tokens/${item.icon}.svg`}
                            alt="token"
                            className="w-5 h-5 rounded-full"
                            width={40}
                            height={40}
                          />
                          <p className="text-xs text-white">{item.token}</p>
                        </div>
                        <div className="flex items-center w-1/2 gap-3">
                          <div className="flex flex-col justify-start w-full px-3 py-2 rounded-lg bg-shark-400 bg-opacity-40">
                            <p className="mb-1 text-xs text-shark-100 line-clamp-1">Mi Migrated Amount</p>
                            <div className="flex items-center gap-2">
                              <Image
                                src={`/static/images/tokens/${item.migrated.icon}.svg`}
                                alt="token"
                                className="w-4 h-4 rounded-full"
                                width={20}
                                height={20}
                              />
                              <p className="text-sm text-white">{item.migrated.amount}</p>
                            </div>
                          </div>
                          <Button onClick={handlerActive} variant="tertiary" className="!py-4 !px-4">
                            <span
                              className={`text-sm flex items-center justify-center ${
                                activeAccordion ? 'icon-chevron rotate-180' : 'icon-chevron'
                              }`}
                            ></span>
                          </Button>
                        </div>
                      </div>
                      {activeAccordion && (
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between gap-2 py-2">
                            <div className="flex flex-col w-1/2 px-3 py-2 rounded-lg bg-shark-400 bg-opacity-40">
                              <p className="text-xs text-shark-100 line-clamp-1">Mi Migrated Amount</p>
                              <div className="flex gap-2">
                                <Image
                                  src={`/static/images/tokens/${item.migrated.icon}.svg`}
                                  alt="token"
                                  className="w-5 h-5 rounded-full"
                                  width={20}
                                  height={20}
                                />
                                <p className="text-sm text-white">{item.migrated.amount}</p>
                              </div>
                            </div>
                            <div className="flex flex-col w-1/2 px-3 py-2 rounded-lg bg-shark-400 bg-opacity-40">
                              <p className="text-xs text-shark-100 line-clamp-1">Mi Migrated Amount</p>
                              <div className="flex gap-2">
                                <Image
                                  src={`/static/images/tokens/${item.migrated.icon}.svg`}
                                  alt="token"
                                  className="w-5 h-5 rounded-full"
                                  width={20}
                                  height={20}
                                />
                                <p className="text-sm text-white">{item.migrated.amount}</p>
                              </div>
                            </div>
                          </div>
                          <Button variant="tertiary" className="w-full">
                            Claim not started
                          </Button>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </div>
          <div>
            <PaginationMobile
              activePage={1}
              setActivePage={() => {}}
              itemsPerPage={10}
              setItemPerPage={() => {}}
              numberPages={7}
              className=""
              count={10}
            />
          </div>
        </>
      )}

      {migrateStatus === 'wrong' && (
        <>
          <div className="w-full mb-10">
            <TableHead
              items={[{ text: 'Tokens', className: 'text-left w-[100%]', sortable: true }]}
              setSort={() => {}}
              sort={'normal'}
              setSortIndex={() => {}}
              sortIndex={1}
            />

            <TableBody>
              {TOKENS_LIST.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="w-[30%] ">
                    <div className="flex items-center gap-2">
                      <Image
                        src={`/static/images/tokens/${item.icon}.svg`}
                        alt="token"
                        className="rounded-full w-[40px] h-[40px]"
                        width={40}
                        height={40}
                      />
                      <p className="text-sm text-white">{item.token}</p>
                    </div>
                  </TableCell>
                  <TableCell className="w-[70%]">
                    <div className="flex  w-full ">
                      <div className="bg-shark-300  flex justify-start   rounded-lg bg-opacity-30 flex-col h-[51px] w-full ">
                        <p className="text-[12px] text-shark-100 ms-2">Mi Migrated Amount</p>
                        <div className="flex gap-2 ms-2">
                          <Image
                            src={`/static/images/tokens/${item.migrated.icon}.svg`}
                            alt="token"
                            className="w-5 h-5 rounded-full"
                            width={20}
                            height={20}
                          />
                          <p className="text-sm text-white">{item.migrated.amount}</p>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </div>
          <PaginationMobile
            activePage={1}
            setActivePage={() => {}}
            itemsPerPage={10}
            setItemPerPage={() => {}}
            numberPages={7}
            className=""
            count={10}
          />
        </>
      )}
    </div>
  )
}

export default OverviewMobile
