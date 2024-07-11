'use client'
import { Button } from '@/src/components/UI'
import Locks from '@/src/components/Lock/MyLocks'
import MylocksMobile from '@/src/components/Lock/Mobile/MylocksMobile'
import { LOCKS } from '@/src/components/Lock/data'
import INFO_API from '../data'

const MyLocks = () => {
  return (
    <>
      {INFO_API.length !== 0 ? (
        <div className="mb-10">
          <div className="flex justify-between mb-4 items-center">
            <h1 className="text-white text-xl">Locks</h1>
            <Button variant="tertiary" className="!py-3 xl:me-5 !text-xs !lg:text-sm" href="/liquidity">
              <span className="icon-logout "></span>New deposit
            </Button>
          </div>
          <div className="dashboard-box rounded-lg">
            <div className="relative z-10">
              <Locks Locks={LOCKS} activePagination={false} tab={''} />
              <MylocksMobile activePagination={false} Locks={LOCKS} tab={''} />
              <div className="mt-2">
                <Button variant="tertiary" className="!py-3 flex gap-2 !text-xs !lg:text-sm">
                  Review more
                  <span className="icon-link"></span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col  gap-3 w-full lg:w-4/5 mt-10 mx-auto">
          <div className="text-white flex justify-between items-center">
            <p className="flex gap-3 text-lg ms-2">Locks</p>
          </div>
          <div className="box-dashboard p-6">
            <p className="text-white text-sm">To receive incentives and fees create a lock and vote with it.</p>
          </div>
        </div>
      )}
    </>
  )
}

export default MyLocks
