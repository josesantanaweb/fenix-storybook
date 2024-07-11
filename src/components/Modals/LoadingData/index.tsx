'use client'
import { useEffect, useState } from 'react'

// components
import { Modal } from '@/src/components/UI'
import Image from 'next/image'

interface LoadingDataProps {
  openModal: boolean
  setOpenModal: (openModal: boolean) => void
  mainText?: string
  grayText?: string
}

const LoadingData = ({ 
  setOpenModal,
  openModal,
  mainText= 'Loading Data, please stand by...',
  grayText= ''
}: LoadingDataProps) => {
  return (
    <Modal openModal={openModal} setOpenModal={setOpenModal} persist={true}>
      <div className="loading-data-modal w-full flex flex-col h-full max-sm:!h-[300px] justify-between">
        <div className='flex flex-col items-center justify-center mt-16'>
          <div className="relative">
            <Image
              src={'/static/images/modals/loading-data/spinner.svg'}
              alt="Spinner"
              width={153.825}
              height={153.825}
              className='animate-spin'
              />
            <Image
              src={'/static/images/modals/loading-data/gray-fenix.svg'}
              alt="Gray Fenix"
              width={153.825}
              height={153.825}
              className='absolute transform top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'
            />
          </div>
          <div className='text-white text-lg font-semibold text-center mt-2 max-md:text-base max-xs:text-sm'>{mainText}</div>
          <div className='text-shark-100 text-sm font-semibold text-center mt-2 max-md:text-xs w-[80%]'>{grayText}</div>
        </div>
        <div className="flex items-center gap-2 cursor-pointer mb-3 text-shark-100 hover:text-outrageous-orange-500">
          <span className="icon-discord"></span>
          <p className="text-sm">Need help?</p>
        </div>
      </div>
    </Modal>
  )
}

export default LoadingData
