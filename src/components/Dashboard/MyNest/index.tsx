'use client'

import { Button } from '@/src/components/UI'
import Nest from '@/src/components/Lock/Nest'
import NestMobile from '@/src/components/Lock/Mobile/NestMobile'
import INFO_API from '../data'

const MyNest = () => {
  return (
    <>
      {INFO_API.length !== 0 ? (
        <div className="mb-10"> 
        
          <div className="flex justify-between mb-4">
            <h1 className="text-white text-xl">Nest</h1>
          </div>
          <div className="dashboard-box rounded-lg">
            <div className="relative z-10">
              <Nest activePagination={false} />
              <NestMobile activePagination={false} />
              <div className="mt-2">
                <Button variant="tertiary" className="!py-3 !text-xs !lg:text-sm flex gap-2">
                  Review more
                  <span className="icon-link"></span> 
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col  gap-3 w-full lg:w-4/5 mt-10 mx-auto">
          <div className="text-white flex justify-between items-center flex-wrap ">
            <p className="flex gap-3 text-lg ms-2">
              Nest 
            </p>
            <Button variant="tertiary" className="flex gap-2 !py-2">
              <span className="icon-logout"></span>My strategies
            </Button>
          </div>
          <div className="box-dashboard p-6">
            <p className="text-white text-sm">No Nest found.</p>
          </div>
        </div>
      )}
    </>
  )
}

export default MyNest
