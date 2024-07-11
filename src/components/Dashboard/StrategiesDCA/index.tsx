'use client'
import { Button } from '@/src/components/UI'
import StrategiesItem from '@/src/components/Dashboard/StrategiesDCA/StrategiesItem'
import INFO_API from '../data'

const StrategiesDCA = () => {
  return (
    <>
      {INFO_API.length !== 0 ? (
        <div className="dashboard-box flex-col xl:flex-row">
          <div className="relative w-full z-10">
            <div className="text-lg text-white mb-2">Active DCAs:</div>
            {Array.from({ length: 4 }).map((_, index) => (
              <StrategiesItem key={index} />
            ))}
            <Button variant="tertiary" className="gap-2 !py-3 !text-xs !lg:text-sm">
              Review more
              <span className="icon-link"></span>
            </Button>
          </div>
          <div className="relative w-full z-10">
            <div className="text-lg text-white mb-2">Past DCAs:</div>
            {Array.from({ length: 2 }).map((_, index) => (
              <StrategiesItem key={index} />
            ))}
            <div className=" mt-2">
              <Button variant="tertiary" className="!py-3 flex gap-2 !text-xs !lg:text-sm">
                Review more
                <span className="icon-link"></span>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col  gap-3 w-full lg:w-4/5 mt-10 mx-auto">
          <div className="text-white flex justify-between items-center">
            <p className="flex gap-3 text-lg ms-2">My Strategies DCA</p>
          </div>
          <div className="box-dashboard p-6 flex gap-8 items-center ">
            <p className="text-white text-sm">You have not created strategies.</p>
          </div>
        </div>
      )}
    </>
  )
}

export default StrategiesDCA
