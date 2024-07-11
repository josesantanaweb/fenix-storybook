'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import AddressCheck from './AddressCheck'
import TotalMigrated from './TotalMigrated'
import { TableHead, TableBody, TableCell, TableRow, Button, Pagination } from '@/src/components/UI'
import { TOKENS_LIST } from './data'
import { NONSNAPSHOT_TOKENS_LIST } from './data'
import { useAccount, useChainId } from 'wagmi'
import {} from '@wagmi/core'
import useStore from '@/src/state/zustand'
import BigNumber from 'bignumber.js'
import toast, { Toaster } from 'react-hot-toast'
import DepositModal from './DepositModal'

interface ABI {
  inputs?: {
    internalType?: string
    name?: string
    type?: string
  }[]
  name?: string
  outputs?: {
    internalType?: string
    name?: string
    type?: string
  }[]
  stateMutability?: string
  type?: string
  anonymous?: boolean
  indexed?: boolean
}

interface Item {
  token: string
  abi?: ABI[]
  address: string
  migrateAddress: string
  migrateabi?: ABI[]
  icon: string
  migrated: {
    amount: number
    icon: string
  }
  claimable: {
    amount: number
    icon: string
  }
}

const Overview = () => {
  const [migrateStatus, setMigrateStatus] = useState<string | undefined>(undefined)
  const [acc, setacc] = useState<string | undefined>(undefined)
  const [chramount, setchramount] = useState<BigInt>(BigInt(0))
  const [elChramount, setelChramount] = useState<BigInt>(BigInt(0))
  const [spChramount, setspChramount] = useState<BigInt>(BigInt(0))
  const [ChrNftIds, setChrNftIds] = useState<BigInt>(BigInt(0))
  const [veChrIds, setveChrIds] = useState<BigInt>(BigInt(0))
  const [ChrNftDeposited, setChrNftDeposited] = useState<BigInt>(BigInt(0))
  const [veChrNftAmount, setveChrNftAmount] = useState<BigInt>(BigInt(0))
  const [veChrNftMigrated, setveChrNftMigrated] = useState<BigInt>(BigInt(0))
  const [chramountDeposited, setchramountDeposited] = useState<BigInt>(BigInt(0))
  const [elChramountDeposited, setelChramountDeposited] = useState<BigInt>(BigInt(0))
  const [spChramountDeposited, setspChramountDeposited] = useState<BigInt>(BigInt(0))
  const [ChrNftsTotal, setChrNftsTotal] = useState<BigInt>(BigInt(0))
  const [veChrNftsTotal, setveChrNftsTotal] = useState<BigInt>(BigInt(0))
  const [chrBalanceOf, setchrBalanceOf] = useState<BigInt>(BigInt(0))
  const [chrNftBalanceOf, setchrNftBalanceOf] = useState<BigInt>(BigInt(0))
  const [vechrNftBalanceOf, setvechrNftBalanceOf] = useState<BigInt>(BigInt(0))

  const [item, setItem] = useState<Item | undefined>(undefined)

  const [openModal, setOpenModal] = useState<boolean | undefined>(false)

  const accounts = useAccount()
  const chainId = useChainId()

  const { setIsConnected } = useStore()

  useEffect(() => {
    if (accounts.address) {
      setIsConnected(true)
    }
  }, [])

  return (
    <div className="relative">
      <h5 className="mb-4 text-lg text-white">Migration Overview</h5>
      <div className="flex flex-col gap-5 mb-5 md:items-center md:justify-between xl:flex-row">
        <AddressCheck
          migrateStatus={migrateStatus}
          setMigrateStatus={setMigrateStatus}
          setchramount={setchramount}
          setelChramount={setelChramount}
          setspChramount={setspChramount}
          setChrNftIds={setChrNftIds}
          setveChrIds={setveChrIds}
          setacc={setacc}
          setchrBalanceOf={setchrBalanceOf}
          setchrNftBalanceOf={setchrNftBalanceOf}
          setvechrNftBalanceOf={setvechrNftBalanceOf}
        />

        <TotalMigrated
          migrateStatus={migrateStatus}
          acc={acc}
          setveChrNftAmount={setveChrNftAmount}
          setChrNftDeposited={setChrNftDeposited}
          setchramountDeposited={setchramountDeposited}
          setelChramountDeposited={setelChramountDeposited}
          setspChramountDeposited={setspChramountDeposited}
          setChrNftsTotal={setChrNftsTotal}
          setveChrNftsTotal={setveChrNftsTotal}
          setveChrNftMigrated={setveChrNftMigrated}
        />
      </div>
      {
        migrateStatus == 'success' ? (
          <>
            <div className="w-full mb-10">
              <TableHead
                items={[
                  { text: 'Token', className: 'text-left', sortable: true },
                  { text: 'Snapshot Balance', className: 'md:max-w-[300px]', sortable: true },
                  { text: 'Claimable Token', className: 'md:max-w-[300px]', sortable: true },
                  { text: 'Action', className: 'hidden md:block md:max-w-[300px]', sortable: false },
                ]}
                setSort={() => {}}
                setSortIndex={() => {}}
                sortIndex={0}
                sort={'normal'}
              />

              <TableBody>
                {TOKENS_LIST.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="w-1/3 md:w-1/4">
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
                    <TableCell className="w-1/3 md:w-1/4 2xl:max-w-[300px]">
                      <div className="flex items-center justify-end w-full px-3">
                        <div className="flex gap-2">
                          <Image
                            src={`/static/images/tokens/${item.migrated.icon}.svg`}
                            alt="token"
                            className="w-5 h-5 rounded-full"
                            width={20}
                            height={20}
                          />

                          <p className="text-sm text-white">
                            {item.token === 'CHR'
                              ? new BigNumber(parseInt(chramount.toString()))
                                  .dividedBy(10 ** 18)
                                  .toFixed(2)
                                  .toString()
                              : item.token === 'elCHR'
                                ? new BigNumber(parseInt(elChramount.toString()))
                                    .dividedBy(10 ** 18)
                                    .toFixed(2)
                                    .toString()
                                : item.token === 'spCHR'
                                  ? new BigNumber(parseInt(spChramount.toString()))
                                      .dividedBy(10 ** 18)
                                      .toFixed(2)
                                      .toString()
                                  : item.token === 'veCHR'
                                    ? parseInt(veChrNftAmount.toString())
                                      ? parseInt(veChrNftAmount.toString())
                                      : 0
                                    : item.token === 'chrNFT'
                                      ? parseInt(chrNftBalanceOf.toString())
                                        ? parseInt(chrNftBalanceOf.toString())
                                        : 0
                                      : 0}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="w-1/3 md:w-1/4 2xl:max-w-[300px]">
                      <div className="flex items-center justify-end w-full px-3">
                        <div className="flex gap-2">
                          <Image
                            src={`/static/images/tokens/${item.claimable.icon}.svg`}
                            alt="token"
                            className="w-5 h-5 rounded-full"
                            width={20}
                            height={20}
                          />
                          <p className="text-sm text-white">
                            {' '}
                            {item.token === 'CHR'
                              ? new BigNumber(parseInt(chramountDeposited.toString()))
                                  .dividedBy(166)
                                  .dividedBy(10 ** 18)
                                  .toFixed(2)
                                  .toString()
                              : item.token === 'elCHR'
                                ? new BigNumber(parseInt(elChramountDeposited.toString()))
                                    .dividedBy(166)
                                    .dividedBy(10 ** 18)
                                    .toFixed(2)
                                    .toString()
                                : item.token === 'spCHR'
                                  ? new BigNumber(parseInt(spChramountDeposited.toString()))
                                      .dividedBy(166)
                                      .dividedBy(10 ** 18)
                                      .toFixed(2)
                                      .toString()
                                  : item.token === 'veCHR'
                                    ? parseInt(veChrNftMigrated.toString())
                                      ? (parseInt(veChrNftMigrated?.toString()) / 166).toFixed(2)
                                      : 0
                                    : item.token === 'chrNFT'
                                      ? parseInt(ChrNftDeposited.toString())
                                        ? (parseInt(ChrNftDeposited?.toString()) * 76).toFixed(0)
                                        : 0
                                      : 0}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="w-1/3 md:w-1/4 2xl:max-w-[300px]">
                      <div className="flex justify-end w-full">
                        <Button
                          variant="tertiary"
                          className="w-full md:w-auto"
                          onClick={() => {
                            setOpenModal(true)
                            setItem(item)
                          }}
                        >
                          Migrate
                        </Button>
                        <Toaster />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </div>

            {openModal && (
              <DepositModal
                open={openModal}
                setOpenModal={setOpenModal}
                item={item}
                acc={acc}
                migrateStatus={migrateStatus}
                migrateAmount={
                  item?.token === 'CHR'
                    ? new BigNumber(parseInt(chramount.toString())).dividedBy(10 ** 18).toString()
                    : item?.token === 'elCHR'
                      ? new BigNumber(parseInt(elChramount.toString())).dividedBy(10 ** 18).toString()
                      : item?.token === 'spCHR'
                        ? new BigNumber(parseInt(spChramount.toString())).dividedBy(10 ** 18).toString()
                        : item?.token === 'veCHR'
                          ? veChrIds.toString()
                            ? veChrIds.toString()
                            : '0'
                          : item?.token === 'chrNFT'
                            ? ChrNftIds.toString()
                              ? ChrNftIds.toString()
                              : '0'
                            : '0'
                }
              />
            )}
          </>
        ) : migrateStatus == 'wrong' ? (
          <>
            <div className="w-full mb-10">
              <TableHead
                items={[
                  { text: 'Token', className: 'text-left', sortable: true },
                  { text: 'Non Snapshot Balance', className: 'md:max-w-[300px]', sortable: true },
                  { text: 'Action', className: 'hidden md:block md:max-w-[300px]', sortable: false },
                ]}
                setSort={() => {}}
                setSortIndex={() => {}}
                sortIndex={0}
                sort={'normal'}
              />

              <TableBody>
                {NONSNAPSHOT_TOKENS_LIST.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="w-1/3 md:w-1/4">
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
                    <TableCell className="w-1/3 md:w-1/4 2xl:max-w-[300px]">
                      <div className="flex items-center justify-end w-full px-3">
                        <div className="flex gap-2">
                          <Image
                            src={`/static/images/tokens/${item.migrated.icon}.svg`}
                            alt="token"
                            className="w-5 h-5 rounded-full"
                            width={20}
                            height={20}
                          />

                          <p className="text-sm text-white">
                            {item.token === 'CHR'
                              ? new BigNumber(parseInt(chrBalanceOf.toString()))
                                  .dividedBy(10 ** 18)
                                  .toFixed(2)
                                  .toString()
                              : item.token === 'elCHR'
                                ? new BigNumber(parseInt(elChramount.toString())).dividedBy(10 ** 18).toString()
                                : item.token === 'spCHR'
                                  ? new BigNumber(parseInt(spChramount.toString())).dividedBy(10 ** 18).toString()
                                  : item.token === 'veCHR'
                                    ? parseInt(vechrNftBalanceOf.toString())
                                      ? parseInt(vechrNftBalanceOf.toString())
                                      : 0
                                    : item.token === 'chrNFT'
                                      ? parseInt(chrNftBalanceOf.toString())
                                        ? parseInt(chrNftBalanceOf.toString())
                                        : 0
                                      : 0}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="w-1/3 md:w-1/4 2xl:max-w-[300px]">
                      <div className="flex justify-end w-full">
                        <Button
                          variant="tertiary"
                          className="w-full md:w-auto"
                          onClick={() => {
                            setOpenModal(true)
                            setItem(item)
                          }}
                        >
                          Migrate
                        </Button>
                        <Toaster />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </div>

            {openModal && (
              <DepositModal
                open={openModal}
                setOpenModal={setOpenModal}
                item={item}
                acc={acc}
                migrateStatus={migrateStatus}
                migrateAmount={
                  item?.token === 'CHR'
                    ? new BigNumber(parseInt(chramount.toString())).dividedBy(10 ** 18).toString()
                    : item?.token === 'elCHR'
                      ? new BigNumber(parseInt(elChramount.toString())).dividedBy(10 ** 18).toString()
                      : item?.token === 'spCHR'
                        ? new BigNumber(parseInt(spChramount.toString())).dividedBy(10 ** 18).toString()
                        : item?.token === 'veCHR'
                          ? veChrIds.toString()
                            ? veChrIds.toString()
                            : '0'
                          : item?.token === 'chrNFT'
                            ? ChrNftIds.toString()
                              ? ChrNftIds.toString()
                              : '0'
                            : '0'
                }
              />
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 rounded-lg bg-shark-400 bg-opacity-40">
            <span className="text-5xl icon-send text-shark-100"></span>
            <p className="text-sm text-shark-100">No migrations or tokens found</p>
          </div>
        )
        //)
        // : (
        //   <div className="flex flex-col items-center justify-center py-10 rounded-lg bg-shark-400 bg-opacity-40">
        //     <span className="text-5xl icon-send text-shark-100"></span>
        //     <p className="text-sm text-shark-100">Wrong Network! Connect wallet to Arbitrum</p>
        //   </div>
        // )
      }
    </div>
  )
}

export default Overview
