'use client'

const PriceRange = () => {

  return (
    <div className="relative mb-5">
      <p className="text-xs text-white mb-3">Price range</p>
      <div className="bg-shark-400 bg-opacity-40 p-5 rounded-lg">
        <div className="flex w-full gap-5 items-center mb-3">
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between">
              <p className="text-xs text-white mb-3">Min Price</p>
              <p className="text-xs text-shark-100 mb-3">FNX per ETH</p>
            </div>
            <div className="w-full">
              <input
                type="text"
                placeholder="0"
                className="bg-shark-400 bg-opacity-40 border border-shark-400 h-[50px] w-full rounded-lg outline-none px-3 text-white text-sm"
              />
            </div>
          </div>
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between">
              <p className="text-xs text-white mb-3">Max Price</p>
              <p className="text-xs text-shark-100 mb-3">FNX per ETH</p>
            </div>
            <div className="w-full">
              <input
                type="text"
                placeholder="0"
                className="bg-shark-400 bg-opacity-40 border border-shark-400 h-[50px] w-full rounded-lg outline-none px-3 text-white text-sm"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <p className="text-xs text-white mb-3">Current price</p>
            <p className="text-xs text-shark-100 mb-3">FNX per ETH</p>
          </div>
          <div className="w-full">
            <input
              type="text"
              placeholder="0"
              className="bg-shark-400 bg-opacity-40 border border-shark-400 h-[50px] w-full rounded-lg outline-none px-3 text-white text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PriceRange
