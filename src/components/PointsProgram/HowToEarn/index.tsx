'use client'

const HowToEarn = () => {
  return (
    <div className="mb-10">
      <h2 className="text-white text-lg mb-3 font-medium">How to earn points</h2>
      <div className="flex items-center justify-between gap-5 relative">
        <div className="your-provide-box py-8">
          <div className="relative flex flex-col items-center z-50">
            <div className="flex items-center justify-center w-10 h-10 px-2 mb-2 rounded-lg bg-shark-400">
              <span className="inline-block text-xl text-gradient icon-coin-received"></span>
            </div>
            <h4 className="text-sm text-white text-center mb-2">Provide Liquidity</h4>
            <p className="text-sm text-shark-100 text-center font-normal">
              Earn Fenix Rings by providing liquidity to specific pools, considering asset type, liquidity
              concentration, duration, and amounts.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HowToEarn
