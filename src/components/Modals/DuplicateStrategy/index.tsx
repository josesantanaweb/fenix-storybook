'use client'

import { Modal, Button } from '@/src/components/UI'

interface DuplicateStrategyProps {
  openModal: boolean
  setOpenModal: (openModal: boolean) => void
}

const DuplicateStrategy = ({ setOpenModal, openModal }: DuplicateStrategyProps) => {
  const handlerClose = () => setOpenModal(false)

  return (
    <Modal openModal={openModal} setOpenModal={setOpenModal}>
      <div className="common-modal">
        <span className="absolute top-0 right-0 text-2xl cursor-pointer icon-x text-shark-100" onClick={handlerClose} />
        <div className="relative z-10 w-full h-full">
          <h1 className="mb-4 text-lg font-medium text-white">Duplicate Strategy</h1>
          <p className="text-sm text-white mb-4">Select your option</p>
          <div className="bg-shark-400 flex items-center justify-between gap-8 rounded-xl py-3 px-4 mb-4">
            <div className="bg-green-500 border bg-opacity-40 px-2 py-1 rounded-lg border-green-500">
              <span className="icon-copy text-sm text-green-200"></span>
            </div>
            <div className="">
              <h6 className="text-white text-xs font-medium">Copy as Is</h6>
              <p className="text-white text-xs font-thin line-clamp-1 xl:line-clamp-2">Duplicate the strategy with the existing values (price, budget).</p>
            </div>
            <Button variant="tertiary">Select</Button>
          </div>
          <div className="bg-shark-400 flex items-center justify-between gap-8 rounded-xl py-3 px-4">
            <div className="bg-green-500 border bg-opacity-40 px-2 py-1 rounded-lg border-green-500">
              <span className="icon-lucide text-sm text-green-200"></span>
            </div>
            <div className="">
              <h6 className="text-white text-xs font-medium">Undercurt the Strategy</h6>
              <p className="text-white text-xs font-thin line-clamp-1 xl:line-clamp-2">Set prices at 0.1% tighter spread and try to get filled ahead.</p>
            </div>
            <Button variant="tertiary">Select</Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default DuplicateStrategy
