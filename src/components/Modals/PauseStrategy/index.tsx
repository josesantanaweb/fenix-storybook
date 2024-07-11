'use client'
import { Button, Modal } from '@/src/components/UI'

interface PauseStrategyProps {
  openModal: boolean
  setOpenModal: (openModal: boolean) => void
}
const PauseStrategy = ({ openModal, setOpenModal }: PauseStrategyProps) => {
  const handlerClose = () => setOpenModal(false)

  return (
    <Modal openModal={openModal} setOpenModal={setOpenModal}>
      <div className="common-modal">
      <span className="absolute top-0 right-0 text-2xl cursor-pointer icon-x text-shark-100 p-2 2xl:p-0" onClick={handlerClose} />
        <div className="relative z-10 w-auto h-auto">
          <h1 className="mb-6 text-xl text-center text-white line-clamp-2 md:line-clamp-3">Are you sure you would like to pause your strategy?</h1>
          <div>
            <p className='text-white text-center text-sm px-3 font-light'>
              This will prevent your strategy from being traded against, however you will retain access to any
              associated funds.
            </p>
          </div>
          <div className="mt-10 flex justify-center items-center gap-5">
            <Button className="!py-2 line-clamp-1">Pause Strategy</Button>
            <Button variant='tertiary' className="!py-2 !px-14">Cancel</Button>

          </div>
        </div>
      </div>
    </Modal>
  )
}

export default PauseStrategy
