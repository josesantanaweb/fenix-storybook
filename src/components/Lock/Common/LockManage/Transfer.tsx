import React from 'react'

const Transfer = () => {
  return (
    <div className="flex flex-col relative">
      <div className="rotate-90 mx-auto bg-shark-400 p-1 w-8 h-8 rounded-sm bg-opacity-40 my-1">
        <span className="icon-arrow text-2xl   flex justify-center items-center   text-gradient"></span>
      </div>
      <div className="p-8 exchange-box-x1">
        <p className="text-sm text-white  mb-2">Transfer to</p>
        <input
          type="text"
          placeholder="0e2x"
          className="bg-shark-400 text-sm   rounded-lg bg-opacity-40 outline-none p-4 w-full"
        />
      </div>
    </div>
  )
}

export default Transfer
