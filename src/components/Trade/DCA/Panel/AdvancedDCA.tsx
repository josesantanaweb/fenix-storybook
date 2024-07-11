'use client'

const AdvancedDCA = () => {
  return (
    <div className="flex items-center justify-between w-full exchange-box-x2">
      <div className="flex flex-col w-[45%]">
        <p className="text-white text-sm mb-1">Set Enter Price</p>
        <input
          type="text"
          placeholder="0"
          className="bg-shark-400 bg-opacity-40 border border-shark-400 h-[50px] w-full rounded-lg outline-none px-3 text-white text-sm"
        />
      </div>
      <span className="icon-swap text-3xl mt-5 w-[10%] text-center text-gradient"></span>

      <div className="flex flex-col w-[45%]">
        <p className="text-white text-sm mb-1">Set Exit Price</p>
        <input
          type="text"
          placeholder="0"
          className="bg-shark-400 bg-opacity-40 border border-shark-400 h-[50px] w-full rounded-lg outline-none px-3 text-white text-sm"
        />
      </div>
    </div>
  )
}

export default AdvancedDCA
