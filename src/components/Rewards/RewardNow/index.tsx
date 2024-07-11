import Link from 'next/link'
import StepBox from '@/src/components/Common/Boxes/StepBox'
import useStore from '@/src/state/zustand'
import ReadMoreModal from '@/src/components/Modals/Liquidity/ReadMore'
import ActiveVote from '@/src/components/Vote/ActiveVote'
import InactiveVote from '@/src/components/Vote/InactiveVote'
import { LockElement } from '@/src/library/structures/lock/LockElement'

interface RewardNowProps {
  openModal: boolean
  activeVote: boolean
  setOpenModal: (parameter: boolean) => void
  lock: LockElement | undefined
}
const RewardNow = ({ openModal, setOpenModal, activeVote, lock }: RewardNowProps) => {
  const { setReadMoreModal } = useStore()
  const handlerChange = () => (openModal ? setOpenModal(false) : setOpenModal(true))

  const handleReadMore = () => setReadMoreModal(true)
  return (
    <StepBox className="xl:min-h-[300px] px-10">
      <div className="flex flex-col justify-center py-6 w-full relative z-10">
        <div className="relative flex flex-col w-auto">
          {/* {activeVote ? (
            <ActiveVote lock={lock} handlerChange={handlerChange} />
          ) : (
            <InactiveVote handlerChange={handlerChange} />
          )} */}
          <ActiveVote lock={lock} handlerChange={handlerChange} />
        </div>
        <div className="flex flex-wrap xl:flex-nowrap gap-3 mt-3  items-center w-full">
          <div className="box-reward-medium xl:w-1/2">
            <div className="flex items-center flex-col p-4 relative z-50">
              <p className="text-shark-100 text-xs">Fenix Balance</p>
              <p className="text-white text-2xl">0</p>
            </div>
          </div>
          <div className="box-reward-medium xl:w-1/2">
            <div className="flex items-center flex-col p-4 relative z-50">
              <p className="text-shark-100 text-xs">Rewards</p>
              <p className="text-2xl text-white">$0</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 py-4">
          <p
            className="flex items-center gap-2 text-xs cursor-pointer text-shark-100 hover:text-outrageous-orange-500"
            onClick={handleReadMore}
          >
            <span className=" icon-link"></span>
            Read More
          </p>
          <Link
            target="_blank"
            href="https://discord.com/invite/fenixfi"
            className="flex items-center text-xs gap-2 text-shark-100 cursor-pointer "
          >
            <span className="icon-discord"></span>Need some help?
          </Link>
        </div>
      </div>
      <ReadMoreModal />
    </StepBox>
  )
}

export default RewardNow
