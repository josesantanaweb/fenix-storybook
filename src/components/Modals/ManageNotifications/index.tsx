'use client'
import { Button, Modal } from '@/src/components/UI'

interface ManageNotificationsProps {
  openModal: boolean
  setOpenModal: (openModal: boolean) => void
}
const ManageNotifications = ({ openModal, setOpenModal }: ManageNotificationsProps) => {
  const handlerClose = () => setOpenModal(false)

  return (
    <Modal openModal={openModal} setOpenModal={setOpenModal}>
      <div className="common-modal">
      <span className="absolute top-0 right-0 text-2xl cursor-pointer icon-x text-shark-100 p-2 2xl:p-0" onClick={handlerClose} />
        <div className="relative z-10 w-auto h-auto">
          <h1 className="mb-6 text-xl text-center text-white">Strategy Notification</h1>
          <div>
            <p className="text-white text-center text-sm px-2 font-light line-clamp-3">
              Elevate your experience by customizing notifications that keep you in the loop with every trade executed
              against this strategy. A 3rd party service managed by Hal.xyz
            </p>
          </div>
          <div className="mt-10 flex justify-center items-center gap-5">
            <Button className="!py-2">Manage Notification</Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ManageNotifications
