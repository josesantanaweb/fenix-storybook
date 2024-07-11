'use client'
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'

interface ModalProps {
  children: React.ReactNode
  openModal: boolean
  className?: string
  persist?: boolean
  setOpenModal: (openModal: boolean) => void
}

const Modal = ({ children, openModal, className = '', setOpenModal, persist = false }: ModalProps) => {
  useEffect(() => {
    openModal && (document.body.style.overflow = 'hidden')
    !openModal && (document.body.style.overflow = 'unset')
  }, [openModal])

  useEffect(() => {
    if (!persist) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setOpenModal(false)
        }
      }

      window.addEventListener('keydown', handleKeyDown)

      return () => {
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
    return
  }, [])

  if (!openModal) return null

  const handleCloseModal = () => {
    if(!persist) {
      setOpenModal(false)
    }
  }

  return ReactDOM.createPortal(
    <div
      id="modal"
      className={`modal fixed z-[9998] top-0 right-0 w-full h-full bg-black bg-opacity-75 backdrop-blur-sm flex 
      items-center justify-center mx-auto ${className}`}
      onClick={handleCloseModal}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex items-center justify-center"
      >
        {children}
      </div>
    </div>,
    document.body
  )
}

export default Modal
