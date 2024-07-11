/* eslint-disable max-len */
'use client'
import { useState } from 'react'

import { Button } from '@/src/components/UI'
import Image from 'next/image'
import { useCloseBanner, useShowBanner } from '@/src/state/user/hooks'

const LiquidityBanner = () => {
  const showBanner = useShowBanner()
  const setCloseBanner = useCloseBanner()
  const [close, setClose] = useState<boolean>(false)

  if (close) return null

  const handlerClose = () => {
    // setCloseBanner(true)
    // setClose((prevState) => !prevState)
  }

  return (
    <div className="blast-banner max-lg:flex-col overflow-hidden rounded-tl-[26px] rounded-br-[26px] rounded-tr-xl rounded-bl-xl">
      <Image src={'/static/images/blast-point-banner/noise-texture.svg'} alt='Noise Texture' className='max-lg:hidden w-[100%] h-[100%] absolute top-0 left-0px bottom-0 right-0 z-[5] rounded-tl-[26px] rounded-br-[26px] rounded-tr-xl rounded-bl-xl' width={10} height={10}/>
      <Image src={'/static/images/blast-point-banner/noise-texture-mobile.svg'} alt='Noise Texture Mobile' className='lg:hidden w-[100%] h-[100%] absolute top-0 left-0px bottom-0 right-0 z-[5] rounded-tl-[56px] rounded-br-[56px] rounded-tr-xl rounded-bl-xl' width={10} height={10}/>
      <Image src={'/static/images/blast-point-banner/cell.svg'} alt='Cell' className='max-lg:hidden w-[100%] h-[100%] absolute top-0 left-0px bottom-0 right-0 z-[5] rounded-tl-[26px] rounded-br-[26px] rounded-tr-xl rounded-bl-xl' width={10} height={10}/>
      <Image src={'/static/images/blast-point-banner/cell-mobile.svg'} alt='Cell Mobile' className='lg:hidden w-[100%] h-[100%] absolute top-0 left-0px bottom-0 right-0 z-[5] rounded-tl-[56px] rounded-br-[56px] rounded-tr-xl rounded-bl-xl' width={10} height={10}/>
    
      {/* <Image src={'/static/images/blast-point-banner/orange-star.svg'} alt='Orange Star' className='max-lg:hidden w-[310px] h-[228px] absolute -bottom-16 left-[1000px] z-[5] mix-blend-lighten opacity-60' width={10} height={10}/> */}
      <Image src={'/static/images/blast-point-banner/orange-star.png'} alt='Orange Star' className='max-lg:hidden w-[310px] absolute bottom-0 left-[1000px] z-[5] mix-blend-lighten opacity-60' width={310} height={10}/>
      <Image src={'/static/images/blast-point-banner/left-ellipse.svg'} alt='Left Ellipse' className='max-lg:hidden w-[496px] h-[214px] absolute top-0 left-0 z-[8]' width={10} height={10}/>
      <Image src={'/static/images/blast-point-banner/right-ellipse.svg'} alt='Right Ellipse' className='max-lg:hidden w-[496px] h-[214px] absolute top-0 right-0 z-[8]' width={10} height={10}/>
      <Image src={'/static/images/blast-point-banner/mobile-ellipse.svg'} alt='Mobile Ellipse' className='lg:hidden w-[375px] h-[162px] absolute bottom-0 left-0 z-[8]' width={10} height={10}/>
      <div className="relative z-[8] flex flex-col gap-2 max-lg:gap-1">
        <div className='flex items-center gap-2'>
            <Image src={'/static/images/blast-point-banner/fenix-ring-liquidity.svg'} alt='fenix orbit' className='w-[56px] h-[56px] z-[5]' width={10} height={10}/>
            <h5 className="text-white text-base max-lg:text-sm font-normal">By earnings <span className='text-gradient'>Fenix Rings</span>, you will be able to convert them into <span className='text-gradient'>50% FNX</span> and <span className='text-gradient'>50% veFNX</span> at the Fenix TGE.</h5>
        </div>
      </div>
    </div>
  )
}

export default LiquidityBanner
