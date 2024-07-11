'use client'
/* eslint-disable max-len */

import Image from 'next/image'
import { useState } from 'react'
import useActiveConnectionDetails from '@/src/library/hooks/web3/useActiveConnectionDetails'
import { usePathname } from 'next/navigation'
import Blast from '@/src/components/UI/Icons/Blast'
import Icon from '@/src/components/V2/UI/Icon'
import ButtonIcon from '@/src/components/Common/ButtonIcon'
import { AnimatePresence, motion } from "framer-motion";


const Sidebar = () => {
  const { isConnected, account } = useActiveConnectionDetails()
  const pathname = usePathname()
  const [goldTooltip, setGoldTooltip] = useState<boolean>(false)
  const [blastTooltip, setBlastTooltip] = useState<boolean>(false)
  const [ringsTooltip, setRingsTooltip] = useState<boolean>(false)
  const [ETHTooltip, setETHTooltip] = useState<boolean>(false)

  return (
    <div
      className={`sticky left-5 container top-1/2 -translate-y-1/2 flex flex-col min-h-[50vh] items-start justify-between gap-4 ${isConnected && pathname !== '/' ? 'block' : 'hidden'}`}
    >
      <div className="flex flex-col gap-4">
        <div
          className={`relative border border-neutral-300 w-[3rem] h-[3rem] bg-neutral-400 rounded-full text-xs flex items-center justify-center hover:bg-primary-200 hover:border-primary-200 transition-all`}
          onMouseOver={() => setGoldTooltip(true)}
          onMouseLeave={() => setGoldTooltip(false)}
        >
          <Image
            src={'/static/images/point-stack/blast-gold.svg'}
            alt="Blast Gold"
            width={20}
            height={20}
            className=""
          />
          <AnimatePresence>
          {goldTooltip && (
            <motion.div
              transition={{ duration: 0.3, ease: "linear" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute -top-[4em] left-14 p-[1.875rem] blast-gold-box overflow-hidden`}
            >
              <div className="relative flex flex-col items-center gap-4 z-50">
                <div className="flex flex-col items-center z-[51] relative">
                  <div className="flex items-center justify-center">
                    <Blast width={80} height={20} />
                  </div>
                  <div className="text-xs font-normal text-white text-center">Gold</div>
                </div>
                <div className="w-full flex items-center justify-between p-[.625rem] z-[51] relative">
                  <div className="text-white text-sm font-normal">Blast Gold</div>
                  <div className="relative border border-tertiary-400 p-[.725rem] bg-neutral-500 rounded-full bg-opacity-60 text-white text-xs font-normal flex items-center">
                    0.0
                  </div>
                </div>
                <div className="flex items-start gap-2 w-full z-[51] relative">
                  <Image src={'/static/images/rewards-sidebar/polygon.svg'} height={14} width={14} alt="polygon" />
                  <div className="text-neutral-200 text-xs font-normal">
                    Blast Gold represents a significant boost of incentives on top of Blast Points, with 100% distributed
                    to users.
                  </div>
                </div>
                <div className="flex items-start gap-2 w-full z-[51] relative">
                  <Image src={'/static/images/rewards-sidebar/polygon.svg'} height={14} width={14} alt="polygon" />
                  <div className="text-neutral-200 text-xs font-normal">
                    Blast Gold is updated periodically based on ensuring long-term growth and alignment with Fenix
                    Finance.
                  </div>
                </div>
                <div className="flex items-start gap-2 w-full z-[51] relative">
                  <Image src={'/static/images/rewards-sidebar/polygon.svg'} height={14} width={14} alt="polygon" />
                  <div className="text-neutral-200 text-xs font-normal">
                    If you deposited your Thruster LP tokens into partners like Hyperlock, Juice, or Particle, Blast Gold
                    will be distributed by them.
                  </div>
                </div>
                <Image
                  src={'/static/images/rewards-sidebar/ellipse.svg'}
                  alt="ellipse"
                  width={119}
                  height={119}
                  className="absolute bottom-[-3rem] left-1/2 -translate-x-1/2 w-[7.4375rem] h-[7.4375rem] z-40 blur-xl"
                />
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
        <div
          className="relative border border-neutral-300 w-[3rem] h-[3rem] bg-neutral-400 rounded-full text-xs flex items-center justify-center hover:bg-primary-200 hover:border-primary-200 transition-all"
          onMouseOver={() => setBlastTooltip(true)}
          onMouseLeave={() => setBlastTooltip(false)}
        >
          <Image src={'/static/images/point-stack/blast.svg'} alt="Blast" width={20} height={20} className="" />

          <AnimatePresence>
            {blastTooltip && (
              <motion.div
                transition={{ duration: 0.3, ease: "linear" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`absolute -top-[5.2rem] left-14 p-[1.875rem] blast-box overflow-hidden`}
              >
                <div className="relative flex flex-col items-center gap-4 z-50">
                  <div className="flex flex-col items-center z-[51] relative">
                    <div className="flex items-center justify-center">
                      <Blast width={80} height={20} />
                    </div>
                    <div className="text-xs font-normal text-white text-center">Points</div>
                  </div>
                  <div className="w-full flex items-center justify-between p-[.625rem] z-[51] relative">
                    <div className="text-white text-sm font-normal">Blast Points</div>
                    <div className="relative border border-tertiary-400 p-[.725rem] bg-neutral-500 rounded-full bg-opacity-60 text-white text-xs font-normal flex items-center">
                      0.0
                    </div>
                  </div>
                  <div className="flex items-start gap-2 w-full z-[51] relative">
                    <Image src={'/static/images/rewards-sidebar/polygon.svg'} height={14} width={14} alt="polygon" />
                    <div className="text-neutral-200 text-xs font-normal">
                      Your TVL in Thruster (USDB and ETH) earns Blast points, these Blast points are updated periodically.
                    </div>
                  </div>
                  <div className="flex items-start gap-2 w-full z-[51] relative">
                    <Image src={'/static/images/rewards-sidebar/polygon.svg'} height={14} width={14} alt="polygon" />
                    <div className="text-neutral-200 text-xs font-normal">
                      Finalized points can be checked on the Blast website.
                    </div>
                  </div>
                  <Image
                    src={'/static/images/rewards-sidebar/ellipse.svg'}
                    alt="ellipse"
                    width={119}
                    height={119}
                    className="absolute bottom-[-3rem] left-1/2 -translate-x-1/2 w-[7.4375rem] h-[7.4375rem] z-40 blur-xl"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div
          className="relative border border-neutral-300 w-[3rem] h-[3rem] bg-neutral-400 rounded-full text-xs flex items-center justify-center hover:bg-primary-200 hover:border-primary-200 group transition-all"
          onMouseOver={() => setRingsTooltip(true)}
          onMouseLeave={() => setRingsTooltip(false)}
        >
          <Image
            src={'/static/images/point-stack/fenix-ring.svg'}
            alt="Fenix Ring"
            width={20}
            height={20}
            className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 group-hover:opacity-0 opacity-100 transition-all"
          />
          <Image
            src={'/static/images/rewards-sidebar/fenix-rings-white.svg'}
            alt="Fenix Ring White"
            width={20}
            height={20}
            className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 group-hover:opacity-100 opacity-0 transition-all"
          />
          <AnimatePresence>
            {ringsTooltip && (
              <motion.div
                transition={{ duration: 0.3, ease: "linear" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`absolute -top-[14.2rem] left-14 p-[1.875rem] fenix-rings-box overflow-hidden`}
              >
                <div className="relative flex flex-col items-center gap-4 z-50">
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center justify-center gap-3 w-full">
                      <Image
                        src={'/static/images/point-stack/fenix-ring.svg'}
                        alt="Fenix Ring"
                        width={14}
                        height={14}
                        className=" "
                      />
                      <div className="text-xs font-bold text-white text-center">Fenix Rings</div>
                      <Image
                        src={'/static/images/point-stack/fenix-ring.svg'}
                        alt="Fenix Ring"
                        width={14}
                        height={14}
                        className=" "
                      />
                    </div>
                    <div className="text-xs font-normal text-white text-center">GOLD</div>
                  </div>
                  <div className="w-full flex items-center justify-between p-[.625rem] z-[51] relative">
                    <div className="text-white text-sm font-normal">Fenix Rings</div>
                    <div className="relative border border-tertiary-400 p-[.725rem] bg-neutral-500 rounded-full bg-opacity-60 text-white text-xs font-normal flex items-center">
                      0.0
                    </div>
                  </div>
                  <div className="flex items-start gap-2 w-full z-[51] relative">
                    <Image src={'/static/images/rewards-sidebar/polygon.svg'} height={14} width={14} alt="polygon" />
                    <div className="text-neutral-200 text-xs font-normal">
                      The Fenix Rings system is a new way to reward users for their contributions to the Fenix ecosystem.
                    </div>
                  </div>
                  <div className="flex items-start gap-2 w-full z-[51] relative">
                    <Image src={'/static/images/rewards-sidebar/polygon.svg'} height={14} width={14} alt="polygon" />
                    <div className="text-neutral-200 text-xs font-normal">
                      Total Fenix Rings (liquidity, trade, and referral & misc.) are displayed on the Fenix UI. Please go to
                      the dashboard to see the precise breakdown. Credits will be weighted based on category.
                    </div>
                  </div>
                  <div className="flex items-start gap-2 w-full z-[51] relative">
                    <Image src={'/static/images/rewards-sidebar/polygon.svg'} height={14} width={14} alt="polygon" />
                    <div className="text-neutral-200 text-xs font-normal">
                      Credits earned on partner protocols are not reflected on the Fenix UI. The credits are accruing to the
                      partner protocols and will be redeemable at the end.
                    </div>
                  </div>
                  <Image
                    src={'/static/images/rewards-sidebar/ellipse.svg'}
                    alt="ellipse"
                    width={119}
                    height={119}
                    className="absolute bottom-[-3rem] left-1/2 -translate-x-1/2 w-[7.4375rem] h-[7.4375rem] z-40 blur-xl"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div
          className="relative border border-neutral-300 w-[3rem] h-[3rem] bg-neutral-400 rounded-full text-xs flex items-center justify-center hover:bg-primary-200 hover:border-primary-200 transition-all"
          onMouseOver={() => setETHTooltip(true)}
          onMouseLeave={() => setETHTooltip(false)}
        >
          <Image src={'/static/images/tokens/ETH.svg'} alt="ETH" width={20} height={20} className="" />
          <AnimatePresence>
            {ETHTooltip && (
              <motion.div
                transition={{ duration: 0.3, ease: "linear" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`absolute top-1/2 -translate-y-1/2 left-14 p-[1.875rem] ethereum-box overflow-hidden`}
              >
                <div className="relative flex flex-col items-center z-50">
                  <Image src={'/static/images/rewards-sidebar/ethereum.svg'} height={121} width={31} alt="ethereum" className='w-[5.0625rem]'/>
                  <div className="w-full flex items-center justify-between p-[.625rem] z-[51] relative">
                    <div className="text-white text-sm font-normal">ETH</div>
                    <div className="relative border border-tertiary-400 p-[.725rem] bg-neutral-500 rounded-full bg-opacity-60 text-white text-xs font-normal flex items-center">
                      0.0
                    </div>
                    <Image
                      src={'/static/images/rewards-sidebar/ellipse.svg'}
                      alt="ellipse"
                      width={119}
                      height={119}
                      className="absolute bottom-[-3rem] left-1/2 -translate-x-1/2 w-[7.4375rem] h-[7.4375rem] z-40 blur-xl"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <ButtonIcon name="arrow-top-right" type="regular" className="text-white !text-xs" />
        <ButtonIcon name="settings" type="regular" className="text-white" />
        <ButtonIcon name="logout" type="regular" className="text-white" />
      </div>
    </div>
  )
}

export default Sidebar
