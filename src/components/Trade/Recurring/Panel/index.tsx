'use client'
import { useState } from 'react'

import Separator from '@/src/components/Trade/Common/Separator'
import IWantToAllocate from '@/src/components/Trade/Recurring/Panel/RecurringOrders/IWantToAllocate'
import With from '@/src/components/Trade/Recurring/Panel/RecurringOrders/With'
import PurchasePrice from '@/src/components/Trade/Recurring/Panel/BuyLow/PurchasePrice'
import SetBuyBudget from '@/src/components/Trade/Recurring/Panel/BuyLow/SetBuyBudget'

import { Button } from '@/src/components/UI'

import { IToken } from '@/src/library/types'

const Panel = () => {
  const [tokenSell, setTokenSell] = useState<IToken>({
    name: 'Fenix',
    symbol: 'FNX',
    id: 0,
    decimals: 18,
    address: '0xa12e4649fdddefd0fb390e4d4fb34ffbd2834fa6',
    img: '/static/images/tokens/FNX.svg',
    price: 0,
  })
  const [tokenGet, setTokenGet] = useState<IToken>({
    name: 'Wrapped Ether',
    symbol: 'ETH',
    id: 1,
    decimals: 18,
    address: '0x4300000000000000000000000000000000000004',
    price: 0,
    img: '/static/images/tokens/WETH.svg',
  })
  const [allocateValue, setAllocateValue] = useState<number>(0)
  const [withValue, setWithValue] = useState<number>(0)
  const [purchaseValue, setPurchaseValue] = useState<number>(0)
  const [buyBudgetValue, setBuyBudgetValue] = useState<number>(0)

  return (
    <section className="box-panel-trade">
      <div className="w-full flex flex-col xl:flex-row justify-between gap-12 items-center relative z-10">
        <div className="w-full relative">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <h4 className="text-white font-medium text-lg">Recurring Order</h4>
              <span className="flex items-center justify-center w-5 h-5 text-xs text-white rounded-full cursor-pointer icon-info bg-shark-200 hover:bg-outrageous-orange-500"></span>
            </div>
            <span className="icon-refresh text-shark-100 text-xl cursor-pointer"></span>
          </div>
          <div className="flex flex-col gap-1 mb-5 relative">
            <div className="mb-3">
              <IWantToAllocate
                token={tokenSell}
                setToken={setTokenSell}
                value={allocateValue}
                setValue={setAllocateValue}
              />
              <Separator />
              <With token={tokenGet} setToken={setTokenGet} setValue={setWithValue} value={withValue} />
            </div>
          </div>
          <div className="flex items-center justify-between mb-5">
            <h4 className="text-white font-medium text-lg">Buy Low</h4>
          </div>
          <div className="flex flex-col items-center justify-start w-full gap-2 px-3 py-2 rounded-lg xl:flex-row bg-shark-400 bg-opacity-40 md:gap-5 mb-4">
            <Button className="h-[40px] md:h-auto w-full xl-w-auto">Limit</Button>
            <Button variant="default" className="h-[40px] md:h-auto w-full xl-w-auto">
              Range
            </Button>
          </div>
          <div className="flex flex-col gap-1 mb-5 relative">
            <div className="mb-3">
              <PurchasePrice value={purchaseValue} setValue={setPurchaseValue} />
              <Separator />
              <SetBuyBudget
                token={tokenGet}
                setToken={setTokenGet}
                value={buyBudgetValue}
                setValue={setBuyBudgetValue}
              />
            </div>
          </div>
          <div className="flex items-center justify-between mb-5">
            <h4 className="text-white font-medium text-lg">Sell High</h4>
          </div>
          <div className="flex flex-col items-center justify-start w-full gap-2 px-3 py-2 rounded-lg xl:flex-row bg-shark-400 bg-opacity-40 md:gap-5 mb-4">
            <Button className="h-[40px] md:h-auto w-full xl-w-auto">Limit</Button>
            <Button variant="default" className="h-[40px] md:h-auto w-full xl-w-auto">
              Range
            </Button>
          </div>
          <div className="flex flex-col gap-1 mb-5 relative">
            <div className="mb-3">
              <PurchasePrice value={purchaseValue} setValue={setPurchaseValue} />
              <Separator />
              <SetBuyBudget
                token={tokenGet}
                setToken={setTokenGet}
                value={buyBudgetValue}
                setValue={setBuyBudgetValue}
              />
            </div>
          </div>
          <div className="flex">
            <Button className="w-full" variant="tertiary">
              Start Limit Order
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Panel
