/* eslint-disable max-len */
'use client'
import { useState } from 'react'

import { Button } from '@/src/components/UI'
import Image from 'next/image'
import { useCloseBanner, useShowBanner } from '@/src/state/user/hooks'
import useIsMobile from '@/src/library/hooks/useIsMobile'

const BlastBanner = () => {
  const isMobile = useIsMobile()
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
      <Image src={'/static/images/blast-point-banner/fenix-orbit.svg'} alt='fenix orbit' className='max-lg:hidden w-[56px] h-[56px] absolute top-0 xl:left-[550px] lg:left-[500px] z-[5]' width={10} height={10}/>
      <Image src={'/static/images/blast-point-banner/fenix-orbit.svg'} alt='fenix orbit' className='lg:hidden w-[53px] h-[53px] absolute top-0 right-[30px] z-[5]' width={10} height={10}/>
      <Image src={'/static/images/blast-point-banner/noise-texture.svg'} alt='Noise Texture' className='max-lg:hidden w-[100%] h-[100%] absolute top-0 left-0px bottom-0 right-0 z-[5] rounded-tl-[26px] rounded-br-[26px] rounded-tr-xl rounded-bl-xl' width={10} height={10}/>
      <Image src={'/static/images/blast-point-banner/noise-texture-mobile.svg'} alt='Noise Texture Mobile' className='lg:hidden w-[100%] h-[100%] absolute top-0 left-0px bottom-0 right-0 z-[5] rounded-tl-[56px] rounded-br-[56px] rounded-tr-xl rounded-bl-xl' width={10} height={10}/>
      <Image src={'/static/images/blast-point-banner/cell.svg'} alt='Cell' className='max-lg:hidden w-[100%] h-[100%] absolute top-0 left-0px bottom-0 right-0 z-[5] rounded-tl-[26px] rounded-br-[26px] rounded-tr-xl rounded-bl-xl' width={10} height={10}/>
      <Image src={'/static/images/blast-point-banner/cell-mobile.svg'} alt='Cell Mobile' className='lg:hidden w-[100%] h-[100%] absolute top-0 left-0px bottom-0 right-0 z-[5] rounded-tl-[56px] rounded-br-[56px] rounded-tr-xl rounded-bl-xl' width={10} height={10}/>
      <div className='absolute xl:right-[200px] lg:right-[170px] max-lg:right-[10px] -bottom-2 z-[5] w-[140px] h-[100px]'>
        <Image src={'/static/images/blast-point-banner/lingot.svg'} alt='Lingot' className='w-[88px] h-[64px] absolute top-1/2 -translate-y-1/2 transform left-1/2 -translate-x-1/2 z-[6]' width={10} height={10}/>
        <Image src={'/static/images/blast-point-banner/blast.svg'} alt='Blast' className='w-[15px] h-[15px] absolute top-5 left-5 z-[6]' width={10} height={10}/>
        <Image src={'/static/images/blast-point-banner/blast.svg'} alt='Blast' className='w-[28px] h-[28px] absolute top-8 right-2 z-[6]' width={10} height={10}/>
        <Image src={'/static/images/blast-point-banner/planet.svg'} alt='Planet' className='max-lg:hidden w-[16.5px] h-[16.5px] absolute bottom-5 -left-6 z-[6]' width={10} height={10}/>
      </div>
      <Image src={'/static/images/blast-point-banner/white-star.svg'} alt='White Star' className='max-xl:hidden w-[113px] h-[113px] absolute top-1/2 transform -translate-y-1/2 xl:right-[400px] right-[370px] z-[5]' width={10} height={10}/>
      <Image src={'/static/images/blast-point-banner/planet.svg'} alt='White Star' className='max-lg:hidden w-[21px] h-[21px] absolute bottom-3 left-[550px] z-[5]' width={10} height={10}/>
      {/* <Image src={'/static/images/blast-point-banner/orange-star.svg'} alt='Orange Star' className='max-lg:hidden w-[310px] h-[228px] absolute -bottom-16 left-[600px] z-[5] mix-blend-lighten opacity-60' width={10} height={10}/> */}
      <Image src={'/static/images/blast-point-banner/orange-star.png'} alt='Orange Star' className='max-lg:hidden w-[310px] absolute bottom-0 left-[600px] z-[5] mix-blend-lighten opacity-60' width={300} height={10}/>
      <Image src={'/static/images/blast-point-banner/left-ellipse.svg'} alt='Left Ellipse' className='max-lg:hidden w-[496px] h-[214px] absolute top-0 left-0 z-[8]' width={10} height={10}/>
      <Image src={'/static/images/blast-point-banner/right-ellipse.svg'} alt='Right Ellipse' className='max-lg:hidden w-[496px] h-[214px] absolute top-0 right-0 z-[8]' width={10} height={10}/>
      <Image src={'/static/images/blast-point-banner/mobile-ellipse.svg'} alt='Mobile Ellipse' className='lg:hidden w-[375px] h-[162px] absolute bottom-0 left-0 z-[8]' width={10} height={10}/>
      {/* <div className="text-white absolute text-sm right-3 top-2 z-10 cursor-pointer" onClick={handlerClose}>
        <span className="icon-x"></span>
      </div> */}
      <div className="relative z-[8] max-lg:max-w-[75%] flex flex-col gap-2 max-lg:gap-1 max-lg:mt-4">
        <div className='flex flex-col items-start gap-1'>
          <h5 className="text-white text-sm font-normal">Deposit liquidity into USDB/WETH to earn your share of</h5>
          <h3 className="text-gradient max-xs:text-sm xs:text-base md:text-lg xl:text-2xl">
            Blast Gold, Blast Points and Fenix Rings
          </h3>
        </div>
        {/* <div className='text-white max-xs:text-sm'>
          Earn your share in <span className='font-bold text-white text-opacity-20 text-xs hover:text-opacity-100 transition-all hover:delay-[0s] delay-[3s] airdrop-gradient max-lg:text-white max-lg:rounded-none rounded-[100px] py-1 px-2'>ONE OF THE BIGGEST AIRDROPS</span> in crypto history
        </div> */}
      </div>
      <Button variant="primary" className={`relative z-[9] max-lg:!px-2 max-lg:!py-1 max-lg:mb-4 max-md:hidden`} href="/liquidity">
        <span>Deposit Now</span>
      </Button>
    </div>
  )
}

export default BlastBanner
