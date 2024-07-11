'use client'
import { useState } from 'react'
import Steps from '../Common/Steps'
import LockTokens from './LockTokens'
import MyLocks from './MyLocks'
import Nest from './Nest'
import { LOCK_STEPS, FILTER_OPTIONS, LOCKS } from './data'
import Filter from '../Common/Filter'
import Search from '../Common/Search'
// import CreateLock from './CreateLock/CreateLock'
import MylocksMobile from './Mobile/MylocksMobile'
import NestMobile from './Mobile/NestMobile'

const Lock = () => {
  const [changeState, setChangeState] = useState<boolean>(false)
  const [currentTab, setCurrentTab] = useState('ACTIVE')

  const LOCKS_FILTER = LOCKS.filter((lock) => lock.TYPE === currentTab.toUpperCase())

  return (
    <section>
      <div className="flex flex-col items-center gap-5 py-5 xl:flex-row mb-4 overflow-hidden">
        <div className="w-full xl:w-2/3">
          <LockTokens changeState={changeState} setChangeState={setChangeState} />
        </div>
        <div className="w-full xl:w-1/3 self-auto">
          <Steps steps={LOCK_STEPS} />
        </div>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <h5 className="lg:text-2xl text-lg text-white">Locks</h5>
      </div>
      <div className="flex flex-col justify-between gap-5 mb-10 md:items-center xl:flex-row">
        {/* <div className="w-full xl:w-2/3"> */}
        <div className="w-full">
          <Filter options={FILTER_OPTIONS} currentTab={currentTab} setCurrentTab={setCurrentTab} />
        </div>
        {/* <div className="w-full xl:w-1/3">
          <Search searchValue="" setSearchValue={() => {}} />
        </div> */}
      </div>
      <MyLocks Locks={LOCKS_FILTER} tab={currentTab} />
      <MylocksMobile Locks={LOCKS_FILTER} tab={currentTab} />
      {/* <div>
        <h5 className="lg:text-2xl text-lg text-white py-5">Nest</h5>
        <Nest />
        <NestMobile />
      </div> */}
    </section>
  )
}

export default Lock
