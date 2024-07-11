import React from 'react'

interface NotificationLockProps {
  info: string
}

const NotificationLock = ({ info }: NotificationLockProps) => {
  return (
    <div className="box-notification">
      <div className='relative z-10 py-4 px-4'>
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 p-3 rounded-lg bg-shark-400 bg-opacity-60">
            <span className="inline-block text-2xl text-gradient icon-info"></span>
          </div>
          <p className="text-shark-100 text-xs">{info}</p>
        </div>
      </div>
    </div>
  )
}

export default NotificationLock
