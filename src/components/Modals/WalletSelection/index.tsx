'use client'

import React, { useState } from 'react'

import { Modal } from '@/src/components/UI'
import ConnectYourWallet from '@/src/components/Modals/WalletSelection/ConnectYourWallet'
import Welcome from '@/src/components/Modals/WalletSelection/Welcome'
import SignIn from '@/src/components/Modals/WalletSelection/SignIn'

import useStore from '@/src/state/zustand'

const WalletSelection = () => {
  const [isConnecting, setIsConnecting] = useState<boolean>(false)
  const openModal = useStore((state) => state.walletSelectionModal)
  const { setWalletSelectionModal } = useStore()

  return (
    <Modal openModal={openModal} setOpenModal={setWalletSelectionModal}>
      {isConnecting ? (
        <div className="flex items-center justify-center gap-10">
          <SignIn setOpenModal={setWalletSelectionModal} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full md:gap-6 xl:flex-row 2xl:w-auto">
          <Welcome />
          <ConnectYourWallet setIsConnecting={setIsConnecting} />
        </div>
      )}
    </Modal>
  )
}

export default WalletSelection
