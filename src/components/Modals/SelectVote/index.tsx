'use client'

import { Modal } from '@/src/components/UI'
import { LockElement } from '@/src/library/structures/lock/LockElement'
import formatDate from '@/src/library/utils/foramatDate'
import { getUserVeFNXLockPositions } from '@/src/library/web3/LockManagment'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

interface SelectVoteProps {
  openModal: boolean
  setOpenModal: (openModal: boolean) => void
  setlock: (value: LockElement) => void
  activeVote: boolean
  setActiveVote: (parameter: boolean) => void
}

const SelectVote = ({ setOpenModal, openModal, setActiveVote, activeVote, setlock }: SelectVoteProps) => {
  const { address, chainId } = useAccount()
  const [loading, setLoading] = useState(true)
  const [nowTime, setnowTime] = useState<Number>(0)
  const [locks, setLocks] = useState<LockElement[]>([])
  useEffect(() => {
    loadCurrentLocks()
    const now = new Date().getTime() / 1000
    setnowTime(now)
  }, [address])

  const loadCurrentLocks = useCallback(async () => {
    if (!address && !chainId) {
      setLoading(() => false)
      return
    }

    try {
      setLoading(() => true)
      if (address && chainId) {
        const resp = await getUserVeFNXLockPositions(address, chainId)
        setLocks(resp)
      }
    } finally {
      setLoading(() => false)
    }
  }, [address, chainId])

  const handlerClose = () => setOpenModal(false)
  const handlerChange = (lock: any) => (
    lock && BigInt(nowTime.toFixed(0).toString()) < lock.veNFTInfo.lockEnd ? setActiveVote(true) : setActiveVote(false),
    setOpenModal(false)
  )

  return (
    <Modal openModal={openModal} setOpenModal={setOpenModal}>
      <div className="common-modal">
        <span className="absolute top-0 right-0 text-2xl cursor-pointer icon-x text-shark-100" onClick={handlerClose} />
        <div className="relative z-10 w-full h-full">
          <h1 className="mb-2 text-lg font-medium text-white">Select veFNX to Vote</h1>
          <div className="mb-4">
            <div className="relative bg-shark-400 bg-opacity-40 w-full rounded-xl pl-4 xl:pl-5 pr-4 xl:pr-3 py-3 flex items-center h-[62px]">
              <span className="flex items-center justify-center w-8 h-5 text-2xl icon-search text-shark-100" />
              <input
                type="text"
                placeholder="Search by ID..."
                className="w-full px-2 text-sm bg-transparent outline-none text-shark-100"
              />
            </div>
          </div>
          <div>
            <div className="flex text-sm text-shark-100">
              <p className="w-[45%]">Lock ID</p>
              <div className="w-full flex gap-2">
                <p className="ml-auto pl-6">Position</p>
                <p className="ml-auto">Voting Power</p>
                {/* <p>Rewards</p> */}
              </div>
            </div>

            <div className="max-h-[220px] overflow-y-auto">
              {locks.map((lock, index) => {
                return (
                  <div key={index} className="flex flex-col gap-3 cursor-pointer" onClick={() => setlock(lock)}>
                    <div
                      onClick={() => handlerChange(lock)}
                      className="flex flex-wrap items-center justify-between p-4 mt-2 text-xs rounded-lg xl:flex-nowrap bg-shark-400 bg-opacity-40"
                    >
                      <div className="flex items-center gap-2">
                        <Image alt="fenix-logo" src={'/static/images/vote/fenix-logo.svg'} height={32} width={32} />
                        <div className="flex flex-col">
                          <div className="flex gap-2">
                            {' '}
                            <p className="text-white">{lock.veNFTInfo.id.toString()}</p>{' '}
                            {BigInt(nowTime.toFixed(0).toString()) < lock.veNFTInfo.lockEnd ? (
                              <p className="text-green-400">
                                <span>•</span> Active
                              </p>
                            ) : (
                              <p className=" text-red-400">
                                <span>•</span> Expired
                              </p>
                            )}
                          </div>
                          <div className="flex">
                            <p className="text-shark-100">Expires {formatDate(Number(lock.veNFTInfo.lockEnd))}</p>
                          </div>
                        </div>
                      </div>
                      {/* first */}
                      <div>
                        <p className="text-white">{(Number(lock.veNFTInfo.amount) / 10 ** 18).toFixed(2)} FNX</p>
                      </div>
                      {/* second */}
                      <div>
                        <p className="text-white">{(Number(lock.veNFTInfo.voting_amount) / 10 ** 18).toFixed(2)} FNX</p>
                      </div>
                      {/* third */}
                      {/* <div>
                        <p className="text-green-400">0.00</p>
                      </div> */}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default SelectVote
