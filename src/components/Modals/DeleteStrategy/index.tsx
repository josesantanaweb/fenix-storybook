'use client'
import { Button, Modal } from '@/src/components/UI'

interface DeleteStrategyProps {
  openModal: boolean
  setOpenModal: (openModal: boolean) => void
}

const DeleteStrategy = ({ openModal, setOpenModal }: DeleteStrategyProps) => {
  const handlerClose = () => setOpenModal(false)

  return (
    <Modal openModal={openModal} setOpenModal={setOpenModal}>
      <div className="common-modal">
        <span
          className="absolute top-0 right-0 text-2xl cursor-pointer icon-x text-shark-100 p-2 2xl:p-0"
          onClick={handlerClose}
        />
        <div className="relative z-10 w-auto h-auto">
          <h1 className="mb-6 text-xl text-center text-white line-clamp-2 md:line-clamp-3">
            Are you sure you would like to delete your strategy?
          </h1>
          <p className="text-white text-sm text-center px-6 mb-5 line-clamp-2 md:line-clamp-none">
            Deleting your strategy will result in all strategy data being lost and impossible to restore. All funds will
            be withdrawn to your wallet.
          </p>
          <div className="flex items-center justify-between bg-shark-400  bg-opacity-40 p-2 py-4 rounded-xl ">
            <div className="px-3">
              <p className="text-sm text-white font-medium">Did you know?</p>
              <p className="text-xs text-white font-light line-clamp-2 md:line-clamp-none">
                Editing prices is cheaper and keeps your strategy working for you.
              </p>
            </div>
            <div className="">
              <Button variant="tertiary" className="!py-2 w-28 !text-xs">
                Edit Prices
              </Button>
            </div>
          </div>
          <div className="mt-10">
            <Button className="mx-auto !py-2">Delete Strategy</Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteStrategy
