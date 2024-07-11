'use client'

import Image from 'next/image'
import AddressCheck from './AddressCheck'
import TotalMigrated from './TotalMigrated'
import { TableHead, TableBody, TableCell, TableRow, Button, Pagination } from '@/src/components/UI'
import { TOKENS_LIST } from './data'

interface OverviewProps {
  migrateStatus: string | undefined
  setMigrateStatus: (status: string) => void
}

const Overview = ({ migrateStatus, setMigrateStatus }: OverviewProps) => {
  return (
    <div className="relative">
      <h5 className="mb-4 text-lg text-white">Migration Overview</h5>
      <div className="flex flex-col gap-5 mb-5 md:items-center md:justify-between 2xl:flex-row">
        <AddressCheck migrateStatus={migrateStatus} setMigrateStatus={setMigrateStatus} />
        <TotalMigrated state={migrateStatus} />
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
              items={[
                { text: 'Token', className: 'text-left w-[20%]', sortable: true },
                { text: 'My Total Amount', className: 'text-right w-[20%]', sortable: true },
                { text: 'My Migrated Amount', className: 'text-right w-[20%]', sortable: true },
                { text: 'Claimable Token', className: 'text-right w-[20%]', sortable: true },
                { text: 'Action', className: 'text-right w-[20%]', sortable: false },
              ]}
              setSort={() => {}}
              setSortIndex={() => {}}
              sort={'normal'}
              sortIndex={1}
            />

            <TableBody>
              {TOKENS_LIST.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="w-[20%]">
                    <div className="flex items-center gap-2">
                      <Image
                        src={`/static/images/tokens/${item.icon}.svg`}
                        alt="token"
                        className="rounded-full w-7 h-7"
                        width={20}
                        height={20}
                      />
                      <p className="text-sm text-white">{item.token}</p>
                    </div>
                  </TableCell>
                  <TableCell className="w-[20%]">
                    <div className="flex items-center justify-end w-full px-3">
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
                  </TableCell>
                  <TableCell className="w-[20%]">
                    <div className="flex items-center justify-end w-full px-3">
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
                  </TableCell>
                  <TableCell className="w-[20%]">
                    <div className="flex items-center justify-end w-full px-3">
                      <div className="flex gap-2">
                        <Image
                          src={`/static/images/tokens/${item.claimable.icon}.svg`}
                          alt="token"
                          className="w-5 h-5 rounded-full"
                          width={20}
                          height={20}
                        />
                        <p className="text-sm text-white">{item.claimable.amount}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="w-[20%]">
                    <div className="flex justify-end w-full">
                      <Button variant="tertiary" className="w-full md:w-auto">
                        Claim not started
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </div>
          <div className="items-center hidden md:flex">
            <p className="mb-5 text-sm text-shark-100 md:mb-0">Showing 2 out of 2 migrations...</p>
            <Pagination
              className="mx-auto mb-5 md:mb-0"
              numberPages={7}
              activePage={1}
              setActivePage={() => {}}
              itemsPerPage={10}
              setItemPerPage={() => {}}
            />
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 px-4 text-white transition-colors border rounded-lg border-shark-300 bg-shark-400 bg-opacity-40 hover:bg-outrageous-orange-400">
              <span className="text-lg icon-cog"></span>
            </div>
          </div>
        </>
      )}

      {migrateStatus === 'wrong' && (
        <>
          <div className="w-full mb-10">
            <TableHead
              items={[
                { text: 'Token', className: 'text-left w-[50%]', sortable: true },
                { text: 'My Migrated Amount', className: 'text-right w-[50%]', sortable: true },
              ]}
              setSort={() => {}}
              setSortIndex={() => {}}
              sortIndex={1}
              sort={'normal'}
            />

            <TableBody>
              {TOKENS_LIST.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="w-[50%]">
                    <div className="flex items-center gap-2">
                      <Image
                        src={`/static/images/tokens/${item.icon}.svg`}
                        alt="token"
                        className="rounded-full w-7 h-7"
                        width={20}
                        height={20}
                      />
                      <p className="text-sm text-white">{item.token}</p>
                    </div>
                  </TableCell>
                  <TableCell className="w-[50%]">
                    <div className="flex items-center justify-end w-full px-3">
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </div>
          <div className="items-center hidden md:flex">
            <p className="mb-5 text-sm text-shark-100 md:mb-0">Showing 2 out of 2 migrations...</p>
            <Pagination
              className="mx-auto mb-5 md:mb-0"
              numberPages={7}
              activePage={1}
              setActivePage={() => {}}
              itemsPerPage={10}
              setItemPerPage={() => {}}
            />
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 px-4 text-white transition-colors border rounded-lg border-shark-300 bg-shark-400 bg-opacity-40 hover:bg-outrageous-orange-400">
              <span className="text-lg icon-cog"></span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Overview
