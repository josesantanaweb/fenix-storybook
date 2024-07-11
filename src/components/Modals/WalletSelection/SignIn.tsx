'use client'
import React, { useEffect } from 'react'
import useStore from '@/src/state/zustand'
import { useLottie } from 'lottie-react'
import animation from '@/src/assets/lottie/animation.json'
interface SignInProps {
  setOpenModal: (openModal: boolean) => void
}

const SignIn = ({ setOpenModal }: SignInProps) => {
  const { setIsConnected } = useStore()
  const handlerClose = () => setOpenModal(false)
  const options = {
    animationData: animation,
    loop: true,
  }

  const { View } = useLottie(options)
  useEffect(() => {
    setTimeout(() => {
      setOpenModal(false)
      setIsConnected(true)
    }, 3000)
  }, [])

  return (
    <div className="common-modal">
      <span
        className="absolute text-2xl cursor-pointer top-2 right-2 xl:top-0 xl:right-0 icon-x text-shark-100"
        onClick={handlerClose}
      />
      <div className="relative z-10 w-full h-full">
        <div className="flex items-center justify-center w-12 h-12 p-3 rounded-lg bg-shark-400 bg-opacity-40">
          <span className="text-xl text-chilean-fire-600 icon-wallet"></span>
        </div>
        <div className="h-[254px] w-[240px] mx-auto absolute top-0 left-0 right-0">{View}</div>
        <h4 className="mb-3 text-lg text-center mt-[150px] text-white">Approve Signature</h4>
        <p className="text-shark-100 text-sm text-center mb-6 max-w-[300px] mx-auto">
          Please approve the wallet signature in order to log into the Platform.
        </p>
        <div className="flex items-center justify-center gap-2 cursor-pointer text-shark-100 hover:text-outrageous-orange-500">
          <span className="icon-discord"></span>
          <p className="text-sm">Need help?</p>
        </div>
      </div>
    </div>
  )
}

export default SignIn
