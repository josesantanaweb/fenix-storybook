'use client'
import { useState, useEffect } from 'react'
import Search from '@/src/components/Common/Search'
import { DATA_ROW } from '../Liquidity/data'
import VotePools from '@/src/components/Vote/VoteNow/VotePools'
import SelectVote from '../Modals/SelectVote'
import RewardBox from './RewardBox'
import RewardNow from './RewardNow'
import FeesHeaderRowReward from './Tables/fees/HeaderRowReward'
import BribeHeaderRowReward from './Tables/bribe/HeaderRowReward'
import VEFnxHeaderRowReward from './Tables/lock/HeaderRowReward'
import { LockElement } from '@/src/library/structures/lock/LockElement'
import { useAppSelector } from '@/src/state'
import { lockState } from '@/src/state/lock/types'

const Rewards = () => {
  const [activeVote, setActiveVote] = useState(true)
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchValue, setSearchValue] = useState<string>('')
  const [lock, setLock] = useState<LockElement>()
  // const filterData = DATA_ROW.filter((row) => row.type === currentTab)
  const locks = useAppSelector<lockState>((state) => state.lock)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }, [])

  return (
    <section className="relative">
      <div className="flex flex-col items-center gap-5 py-5 xl:flex-row">
        <div className="w-full xl:w-[60%]">
          <RewardBox />
        </div>
        <div className="w-full xl:w-[40%]">
          <RewardNow lock={lock} openModal={openModal} setOpenModal={setOpenModal} activeVote={activeVote} />
        </div>
      </div>
      <h1 className="text-xl font-medium text-white">Rewards overview</h1>
      <div className="flex flex-col items-center justify-between gap-5 mt-5 mb-10 xl:flex xl:flex-row">
        <div className="w-full ">
          <Search searchValue={searchValue} setSearchValue={setSearchValue} />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center gap-2 mx-2 mt-2 mb-4">
        <div className="w-full">
          <h1 className="text-xl font-medium text-white mb-6">Fees Rewards</h1>
          <div className="p-2">
            <FeesHeaderRowReward
              activeVote={activeVote}
              filterData={[1, 2, 3, 4] as any}
              loading={loading}
              activePagination={false}
              search={searchValue}
            />
          </div>
        </div>
        <div className="w-full">
          <h1 className="text-xl font-medium text-white mb-6">Bribe Rewards</h1>
          <div className="p-2">
            <BribeHeaderRowReward
              activeVote={activeVote}
              filterData={[1, 2, 3, 4] as any}
              loading={loading}
              activePagination={false}
              search={searchValue}
            />
          </div>
        </div>
        <div className="w-full">
          <h1 className="text-xl font-medium text-white mb-6">veFnx Rewards</h1>
          <div className="p-2">
            <VEFnxHeaderRowReward
              activeVote={activeVote}
              filterData={locks.positions}
              loading={loading}
              activePagination={false}
              search={searchValue}
            />
          </div>
        </div>
      </div>
      {/* <HeaderRowReward activeVote={activeVote} filterData={[1, 2, 3, 4]} loading={loading} /> */}
      <SelectVote
        activeVote={activeVote}
        setActiveVote={setActiveVote}
        openModal={openModal}
        setOpenModal={setOpenModal}
        setlock={setLock}
      />

      <div className="p-5 mx-auto fixed bottom-4 z-50 left-0 xl:w-1/2 right-0 md:block"></div>
    </section>
  )
}

export default Rewards
