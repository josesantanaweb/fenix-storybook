'use client'
import MainBox from '@/src/components/Common/Boxes/MainBox'
import InfoBox from '@/src/components/Common/InfoBox'
import { Button } from '@/src/components/UI'
import { EXCHANGE_LIST } from '../data'
import useStore from '@/src/state/zustand'

interface MigrationsProps {
  isConnected: boolean
}

const Migration = ({ isConnected }: MigrationsProps) => {
  const { setWalletSelectionModal } = useStore()

  const handlerConnectWallet = () => !isConnected && setWalletSelectionModal(true)

  return (
    <MainBox>
      <div className="flex flex-col items-center justify-between w-full xl:flex-row relative z-10">
        <div className="lg:ms-5 xl:w-1/2 w-full">
          <h4 className="mb-3 ms-2 text-xl text-white">Migration Claim</h4>
          <p className="mb-4 text-sm text-shark-100 ms-2">Deposit your CHR ecosystem tokens to migrate.</p>
          <div className="flex lg:gap-5 gap-3 box bg-shark-400 bg-opacity-40 2xl:w-[390px] lg:h-auto lg:w-96 rounded-lg mb-5 items-center justify-center lg:justify-normal">
            <div>
              <p className="text-shark-100 font-bold text-[12px]">Migration</p>
              <p className="text-green-400 text-[12px]">Open</p>
            </div>
            <div className="flex items-center flex-col">
              <span className="text-white text-xs bg-shark-300 flex items-center p-2 h-[27px] bg-opacity-30  rounded-md">
                30
              </span>
              <p className="text-shark-100 text-xs lg:text-sm">Days</p>
            </div>
            <div className="flex items-center flex-col">
              <span className="text-white bg-shark-300 text-xs flex items-center p-2 h-[27px] bg-opacity-30  rounded-md">
                30
              </span>
              <p className="text-shark-100 text-xs lg:text-sm">Hours</p>
            </div>
            <div className="flex items-center flex-col">
              <span className="text-white bg-shark-300 text-xs flex items-center p-2 h-[27px] bg-opacity-30  rounded-md">
                30
              </span>
              <p className="text-shark-100 text-xs lg:text-sm">Minutes</p>
            </div>
            <div className="flex items-center flex-col">
              <span className="text-white bg-shark-300 flex text-xs  items-center p-2 h-[27px] bg-opacity-30  rounded-md">
                30
              </span>
              <p className="text-shark-100 text-xs lg:text-sm">Seconds</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 mb-8 xl:mb-14 md:flex-row">
            <Button variant="primary" className="flex gap-3" onClick={handlerConnectWallet}>
              <span className={`text-white ${isConnected ? 'icon-coin-received' : 'icon-wallet'}`}></span>
              {isConnected ? `Check Tokens` : `Connect your Wallet`}
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <p className="flex items-center text-[12px] gap-3 lg:text-sm cursor-pointer text-shark-100 hover:text-outrageous-orange-500">
              <span className="lg:text-lg icon-link"></span>
              About Migration
            </p>
          </div>
        </div>
        <div className="relative overflow-y-auto overflow-x-hidden h-[320px] flex flex-col w-full xl:w-[40%]">
          {EXCHANGE_LIST.map((exchange, index) => (
            <InfoBox key={index} data={exchange} hasTooltip />
          ))}
        </div>
      </div>
    </MainBox>
  )
}

export default Migration
