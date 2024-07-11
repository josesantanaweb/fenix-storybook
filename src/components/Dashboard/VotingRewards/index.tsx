'use client'

import { Button } from '@/src/components/UI'
import HeaderRowVote from '@/src/components/Vote/Tables/HeaderRowVote'

import { PROPS_HEADER_ROW_VOTE } from '../types'
import INFO_API from '../data'


const VotingRewards = () => {
  
  return (
    <>
      {INFO_API.length !== 0 ? (
        <div className="mb-10">
          <div className="flex justify-between mb-4">
            <h1 className="text-white text-xl">Voting Rewards</h1>
          </div>
          <div className="dashboard-box">
            <div className="relative z-10">
              <HeaderRowVote {...PROPS_HEADER_ROW_VOTE} />
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
            <p className="flex gap-3 text-lg ms-2">
              Voting Rewards
            </p>
          </div>
          <div className="box-dashboard p-6 flex gap-8 items-center ">
            <p className="text-white text-sm">No rewards found.</p>
            <div className="flex text-white">
              <span className="icon-refresh cursor-pointer"></span>
              <Button variant="default" className="!py-0  flex gap-2">
                {' '}
                All Relays
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default VotingRewards
