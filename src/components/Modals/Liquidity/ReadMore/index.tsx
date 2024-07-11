'use client'

import React from 'react'
import Image from 'next/image'
import useStore from '@/src/state/zustand'

import { Modal } from '@/src/components/UI'

const ReadMoreModal = () => {
  const openModal = useStore((state) => state.readMoreModal)
  const { setReadMoreModal } = useStore()

  const handleClose = () => setReadMoreModal(false)

  return (
    <Modal className="xl:!justify-end" openModal={openModal} setOpenModal={setReadMoreModal}>
      <div className="xl:w-[603px] bg-shark-400 bg-opacity-40 text-white py-[70px] relative xl:ml-auto xl:mx-5 rounded-2xl">
        <button
          className="absolute z-10 text-2xl cursor-pointer top-5 right-5 text-shark-100 hover:text-transparent hover:bg-button-primary-hover hover:bg-clip-text"
          type="button"
          aria-label="Close Modal"
          title="Close"
          onClick={handleClose}
        >
          <span className="icon-x"></span>
        </button>

        <div className="pr-1">
          <div className="px-[30px] py-3.5 max-h-[calc(100vh-200px)] overflow-auto flex flex-col gap-[27px]  scroll-box">
            <li className="flex gap-3">
              <div className="w-[57.224px] h-[57.224px] bg-shark-400 bg-opacity-40 rounded-xl flex-shrink-0 hidden xl:flex items-center justify-center">
                <span className="icon-send text-[30px] inline-block text-transparent bg-button-primary-hover bg-clip-text"></span>
              </div>
              <div>
                <div className="inline-block text-transparent bg-button-primary-hover bg-clip-text mb-2.5 font-medium text-[17px]">
                  Liquidity Pools
                </div>

                <div className="[&>p:not(:last-child)]:mb-[22px] [&>div:not(:last-child)]:mb-[22px] text-sm leading-normal ">
                  <p>
                    The core functionality of Fenix Finance is to allow users to exchange tokens in a secure way, with
                    low fees and low slippage.
                  </p>

                  <p>
                    Slippage is the difference between the current market price of an token and the price at which the
                    actual exchange/swap is executed. This difference could result in a smaller amount (higher price
                    paid) or a higher amount (smaller price paid) of desired tokens returned from a swap.
                  </p>

                  <p>To provide access to the best rates on the market, we identified two types of tokens:</p>

                  <div className="flex items-center gap-[27.27px]">
                    <div>correlated - for example stable coins</div>
                    <div className="flex items-center gap-[11.92px]">
                      <Image
                        src="/static/images/tokens/ETH.svg"
                        className="w-6 h-6"
                        alt="logo"
                        width={23.843}
                        height={23.843}
                      />
                      <Image
                        src="/static/images/tokens/BTC.svg"
                        className="w-6 h-6"
                        alt="logo"
                        width={23.843}
                        height={23.843}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-[27.27px]">
                    <div>uncorrelated - for example</div>
                    <div className="flex items-center gap-[11.92px]">
                      <Image
                        src="/static/images/tokens/ETH.svg"
                        className="w-6 h-6"
                        alt="logo"
                        width={23.843}
                        height={23.843}
                      />
                      <Image
                        src="/static/images/tokens/BTC.svg"
                        className="w-6 h-6"
                        alt="logo"
                        width={23.843}
                        height={23.843}
                      />
                    </div>
                  </div>

                  <p>
                    Fenix Finance offers two different liquidity pool types based on token pair needs, Stable Pools and
                    Volatile Pools. Fenix supports custom factories, so that new pool types can always be integrated.
                  </p>

                  <p>
                    The protocol router evaluates both pool types to determine the most efficient price quotation and
                    trade execution route available. To protect against flashloan attacks, the router will use 30-minute
                    TWAPs (time-weighted average prices). The router doesn&apos;t require upkeep (external maintenance).
                  </p>

                  <p>
                    The deeper the liquidity of a given pool (higher value locked), the smaller the slippage it will
                    offer.
                  </p>
                </div>
              </div>
            </li>

            <li className="flex gap-3">
              <div className="w-[57.224px] h-[57.224px] bg-shark-400 bg-opacity-40 rounded-xl flex-shrink-0 hidden xl:flex items-center justify-center">
                <span className="icon-send text-[30px] inline-block text-transparent bg-button-primary-hover bg-clip-text"></span>
              </div>
              <div>
                <div className="inline-block text-transparent bg-button-primary-hover bg-clip-text mb-2.5 font-medium text-[17px]">
                  Stable Pools
                </div>

                <div className="[&>p:not(:last-child)]:mb-[22px] [&>div:not(:last-child)]:mb-[22px] text-sm leading-normal ">
                  <p>
                    Stable pools are designed for tokens which have little to no volatility. This means that the formula
                    used for pricing the tokens allows for low slippage even on large traded volumes.
                  </p>
                  <div className="px-4 py-3 rounded-lg box-small w-[150px] h-[60px] flex items-center justify-center">
                    <h5 className="text-base text-white">x³y + y³x ≥ k</h5>
                  </div>
                </div>
              </div>
            </li>

            <li className="flex gap-3">
              <div className="w-[57.224px] h-[57.224px] bg-shark-400 bg-opacity-40 rounded-xl flex-shrink-0 hidden xl:flex items-center justify-center">
                <span className="icon-send text-[30px] inline-block text-transparent bg-button-primary-hover bg-clip-text"></span>
              </div>
              <div>
                <div className="inline-block text-transparent bg-button-primary-hover bg-clip-text mb-2.5 font-medium text-[17px]">
                  Volatile Pools
                </div>

                <div className="[&>p:not(:last-child)]:mb-[22px] [&>div:not(:last-child)]:mb-[22px] text-sm leading-normal ">
                  <p>
                    Volatile pools are designed for tokens with high price volatility. These pools use a generic AMM
                    formula.
                  </p>
                  <div className="px-4 py-3 rounded-lg box-small w-[150px] h-[60px] flex items-center justify-center">
                    <h5 className="text-base text-white">x × y ≥ k</h5>
                  </div>
                </div>
              </div>
            </li>

            <li className="flex gap-3">
              <div className="w-[57.224px] h-[57.224px] bg-shark-400 bg-opacity-40 rounded-xl flex-shrink-0 hidden xl:flex items-center justify-center">
                <span className="icon-send text-[30px] inline-block text-transparent bg-button-primary-hover bg-clip-text"></span>
              </div>
              <div>
                <div className="inline-block text-transparent bg-button-primary-hover bg-clip-text mb-2.5 font-medium text-[17px]">
                  A visual representation of the formulas
                </div>

                <div className="[&>p:not(:last-child)]:mb-[22px] [&>div:not(:last-child)]:mb-[22px] text-sm leading-normal ">
                  <p>The mathematical formulas are used to keep the total pool liquidity the same at all times.</p>

                  <div>
                    <p>
                      Below, you can find a visual comparison between the stable (red) and volatile (green) AMM pricing
                      equations, where:
                    </p>
                    <ul className="pl-5 list-disc">
                      <li>x is the amount of first token in the pool</li>
                      <li>y is the amount of second token in the same pool</li>
                      <li>k is a fixed constant</li>
                    </ul>
                  </div>

                  <Image src="/static/images/modals/liquidity/hyperbola.png" width={472} height={395} alt="Hyperbola" />
                </div>
              </div>
            </li>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ReadMoreModal
