/* eslint-disable max-len */
import React from 'react'
import Link from 'next/link'
const ShareReferral = () => {
  return (
    <div className="box-referrals-short-invert max-sm:max-w-[372px]">
      <div className="relative z-50 flex items-center justify-between">
        <p className="text-sm sm:text-base font-semibold text-white">Share to your network</p>
        <div className="flex gap-2 items-center">
          <Link
            href={''}
            className="text-white w-9 h-9 flex items-center justify-center border  border-shark-400 rounded-[10px] flex-shrink-0 bg-shark-400 bg-opacity-40 transition-colors hover:border-outrageous-orange-500 hover:bg-button-primary-hover hover:bg-opacity-80"
          >
            <span className="icon-twitter mr-0 text-sm" />
          </Link>
          <Link
            href={''}
            className="text-white w-9 h-9 flex items-center justify-center border  border-shark-400 rounded-[10px] flex-shrink-0 bg-shark-400 bg-opacity-40 transition-colors hover:border-outrageous-orange-500 hover:bg-button-primary-hover hover:bg-opacity-80"
          >
            <span className="icon-telegram mr-0 text-sm" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ShareReferral