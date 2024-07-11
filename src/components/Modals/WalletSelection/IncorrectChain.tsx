'use client'
import { Button } from '@/src/components/UI'
import Image from 'next/image'
import { Modal } from '@/src/components/UI'
interface IncorrectChainProps {
  open: boolean
  setOpenModal: (openModal: boolean) => void
}

const IncorrectChain = ({ setOpenModal, open }: IncorrectChainProps) => {
  const handlerClose = () => setOpenModal(false)

  return (
    <Modal className="justify-center" openModal={open} setOpenModal={setOpenModal}>
      <div className="common-modal min-w-[370px]">
        <span
          className="absolute text-2xl cursor-pointer top-5  right-4  2xl:top-0  2xl:right-0  icon-x text-shark-100"
          onClick={handlerClose}
        />
        <div className="absolute top-4 left-4 flex justify-center items-center w-12 h-12 border  border-solid rounded-lg bg-shark-400 border-shark-400">
          <span className="text-lg text-transparent icon-unplug bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text" />
        </div>
        <div className="relative z-10 w-full h-full">
          <div className="flex items-center justify-center mb-3">
            <Image
              src={'/static/images/modals/plug.png'}
              alt=""
              width={512}
              className="h-[128px]  w-[128px]"
              height={512}
            />
          </div>
          <div className="flex flex-col items-center justify-center mb-4">
            <h1 className="mb-2 text-lg font-bold text-center text-white">You are in the wrong network</h1>
            <p className="text-sm font-normal text-shark-100 w-[261px] text-center">
              Please switch to Blast Network to use Fenix Protocol.
            </p>
          </div>
          <div className="flex justify-center">
            <Button variant="primary">
              <span className="text-xs font-normal">Switch to Blast Network</span>
            </Button>
          </div>
          <div className="flex items-center justify-center gap-2 mt-10 cursor-pointer text-shark-100 hover:text-outrageous-orange-500">
            <span className="icon-discord"></span>
            <p className="text-sm">Need help?</p>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default IncorrectChain
