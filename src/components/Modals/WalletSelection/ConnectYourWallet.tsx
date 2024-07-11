import Image from 'next/image'
import WALLETS from './data'

interface ConnectYourWalletProps {
  setIsConnecting: (isConnecting: boolean) => void
}

const ConnectYourWallet = ({ setIsConnecting }: ConnectYourWalletProps) => {
  const handlerSelectWallet = () => setIsConnecting(true)

  return (
    <div className="steps-box">
      <div className="relative z-10">
        <h4 className="mb-4 text-base text-white md:mb-6 md:text-lg">Connaect your Wallet</h4>
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 mb-4 max-h-[400px] md:max-h-auto overflow-y-auto md:overscroll-none">
          {WALLETS.map((wallet, index) => (
            <div
              key={index}
              onClick={handlerSelectWallet}
              className="relative flex items-center justify-between w-full p-3 border cursor-pointer md:p-4 bg-shark-400 border-shark-400 bg-opacity-40 rounded-xl hover:bg-opacity-60"
            >
              <div className="flex items-center gap-2">
                <Image src={wallet.image} alt="wallet" className="w-5 h-5 md:w-8 md:h-8" width={42} height={42} />
                <h5 className="text-xs text-white">{wallet.name}</h5>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 cursor-pointer text-shark-100 hover:text-outrageous-orange-500">
          <span className="icon-discord"></span>
          <p className="text-sm">Need help?</p>
        </div>
      </div>
    </div>
  )
}

export default ConnectYourWallet
