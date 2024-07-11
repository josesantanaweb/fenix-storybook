/* eslint-disable max-len */
'use client'
import { useState, useRef, useEffect } from 'react'

import { Button } from '@/src/components/UI'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useCloseBanner, useShowBanner } from '@/src/state/user/hooks'

import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"


const Blast3XBanner = () => {
  const pathname = usePathname()
  console.log('pathname :>> ', pathname);
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 0,
    arrows: false,

    appendDots: (dots: any) => (
      <div
        className='!w-[300px]'
      >
        <ul className='!w-[35px] mx-auto flex items-center justify-center relative sm:left-[-100px] '> {dots} </ul>
      </div>
    ),
    customPaging: (i: any) => (
      <div
        className={`relative w-[35px] rounded-xl h-2 mt-4 max-sm:mt-2 max-xs:mt-0 ${currentSlideNumber === i ? 'gradient-banner z-10' : 'bg-shark-100'}`}
      >
      </div>
    )
  }
  const sliderRef = useRef(null);
  const [currentSlideNumber, setCurrentSlideNumber] = useState(0);
  console.log('sliderRef :>> ', sliderRef);
  const showBanner = useShowBanner()
  const setCloseBanner = useCloseBanner()
  const [close, setClose] = useState<boolean>(false)
  useEffect(() => {
    console.log('sliderRef.current :>> ', sliderRef.current);
  }, [sliderRef])

  if (close) return null

  const handlerClose = () => {
    // setCloseBanner(true)
    // setClose((prevState) => !prevState)
  }

  return (
    <div className="blast-3x-banner flex items-center rounded-tl-[1.625rem] rounded-br-[1.625rem] justify-between rounded-tr-xl rounded-bl-xl overflow-hidden">
      <Image objectFit='cover' quality={100} src={'/static/images/blast-point-banner/noise-texture.svg'} alt='Noise Texture' className='max-lg:hidden w-[100%] h-[100%] absolute top-0 left-0 bottom-0 right-0 z-[5] rounded-tl-[1.625rem] rounded-br-[1.625rem] rounded-tr-xl rounded-bl-xl' width={10} height={10}/>
      <Image objectFit='cover' quality={100} src={'/static/images/blast-point-banner/noise-texture-mobile.svg'} alt='Noise Texture Mobile' className='lg:hidden w-[100%] h-[100%] absolute top-0 left-0 bottom-0 right-0 z-[5] rounded-tl-[3.5rem] rounded-br-[3.5rem] rounded-tr-xl rounded-bl-xl' width={10} height={10}/>
      <Image objectFit='cover' quality={100} src={'/static/images/blast-point-banner/cell.svg'} alt='Cell' className='max-lg:hidden w-[100%] h-[100%] absolute top-0 left-0 bottom-0 right-0 z-[5] rounded-tl-[1.625rem] rounded-br-[1.625rem] rounded-tr-xl rounded-bl-xl' width={10} height={10}/>
      <Image objectFit='cover' quality={100} src={'/static/images/blast-point-banner/cell-mobile.svg'} alt='Cell Mobile' className='lg:hidden w-[100%] h-[100%] absolute top-0 left-0 bottom-0 right-0 z-[5] rounded-tl-[3.5rem] rounded-br-[3.5rem] rounded-tr-xl rounded-bl-xl' width={10} height={10}/>

      <Image objectFit='cover' quality={100} src={'/static/images/gold-rush-banner/background-star.png'} alt='Background Star' className='max-lg:hidden w-[573px] mix-blend-lighten absolute bottom-[0px] left-[1170px] max-2xl:left-[1070px] z-[10]' width={570} height={10}/>
      <Image objectFit='cover' quality={100} src={'/static/images/gold-rush-banner/background-star2.png'} alt='Background Star2' className='max-lg:hidden w-[573px] mix-blend-lighten absolute bottom-[-10px] left-[490px] max-2xl:left-[440px] z-[10]' width={570} height={10}/>

      <Image priority objectFit='cover' quality={100} src={'/static/images/blast-3x-banner/yellow-fenix.svg'} alt='Yellow Fenix' className='max-lg:hidden w-[557px] h-[557px] absolute top-[-250px] left-[860px] max-2xl:left-[730px] max-xl:left-[680px]  z-[10]' width={557} height={557}/>

      <Image priority objectFit='cover' quality={100} src={'/static/images/blast-3x-banner/yellow-fenix-mobile.svg'} alt='Yellow Fenix' className='lg:hidden w-[98px] h-[113px] absolute bottom-[0px] right-[0px] z-[10]' width={98} height={113}/>
      
      <Image objectFit='cover' quality={100} src={'/static/images/gold-rush-banner/fenix-ring-low-opacity.svg'} alt='Fenix Ring Decorator' className='max-lg:hidden w-[23px] h-[23px] mix-blend-lighten absolute top-[0] left-[600px] max-2xl:left-[500px] z-[10]' width={10} height={10}/>
      <Image objectFit='cover' quality={100} src={'/static/images/blast-3x-banner/fenix-ring-bottom.svg'} alt='Fenix Ring Decorator 2' className='max-lg:hidden w-[23px] h-[23px] mix-blend-lighten absolute bottom-[0] left-[870px] max-2xl:left-[770px] z-[10]' width={10} height={10}/>
      <Image objectFit='cover' quality={100} src={'/static/images/gold-rush-banner/ellipse.svg'} alt='Ellipse' className='max-lg:hidden w-[16px] h-[16px] absolute bottom-[20px]  left-[1070px] z-[10]' width={10} height={10}/>
      <Image objectFit='cover' quality={100} src={'/static/images/gold-rush-banner/ellipse2.svg'} alt='Ellipse 2' className='max-lg:hidden w-[16px] h-[16px] absolute bottom-[30px]  left-[515px] z-[10]' width={10} height={10}/>

      <Image objectFit='cover' quality={100} src={'/static/images/blast-3x-banner/star.svg'} alt='Star' className='lg:hidden w-[198px] h-[134px] mix-blend-lighten absolute top-[-20px] left-1/2 -translate-x-1/2 z-[10]' width={10} height={10}/>
      <Image priority objectFit='cover' quality={100} src={'/static/images/blast-3x-banner/ellipse.svg'} alt='Ellipse' className='lg:hidden w-[48px] h-[48px] mix-blend-lighten absolute bottom-[-10px] left-[150px] z-[10]' width={48} height={48}/>
      <Image objectFit='cover' quality={100} src={'/static/images/gold-rush-banner/fenix-ring-low-opacity.svg'} alt='Fenix Ring Decorator 2' className='lg:hidden  w-[23px] h-[23px] mix-blend-lighten absolute top-[-5px] right-[50px] z-[10]' width={10} height={10}/>

      <div className="relative z-[12] flex max-lg:justify-start max-lg:mx-6 max-xs:mx-0 items-center gap-8 max-lg:gap-1">
        <div className='flex items-center gap-3 max-xs:gap-1'>
            <div className='flex items-center relative'>
              <Image src={'/static/images/blast-3x-banner/circle-blast.svg'} alt='Circle Blast' className='w-[36px] max-xs:w-[36px] h-[30px] max-xs:h-[30px] z-[6]' width={36} height={36}/>
              <Image src={'/static/images/blast-3x-banner/gray-circle.svg'} alt='Gray Circle' className='w-[36px] max-xs:w-[36px] h-[30px] max-xs:h-[30px] z-[5] ml-[-14px]' width={36} height={36}/>
              <Image src={'/static/images/blast-3x-banner/vector.svg'} alt='Gray vector' className='w-[8px] h-[10px] z-[5] absolute left-1/2 -translate-x-1/2 top-[-8px] mix-blend-lighten' width={8} height={10}/>
            </div>
            <div className='flex max-lg:flex-col text-lg max-sm:text-sm max-xxs:text-xs max-lg:text-base items-center max-lg:items-start max-lg:my-4 font-normal leading-none  lg:gap-1'>
              <div className='text-white'>Deposit into <span className='text-chilean-fire-500'>$BLAST Pools</span></div>
              <div className='text-white'>to earn <span className='text-chilean-fire-500'>3x the amount</span></div>
              <div className='text-chilean-fire-500'>of Fenix Rings</div>
            </div>
        </div>
      </div>
      <Button variant="primary" className={`relative z-[20] max-lg:!px-2 max-lg:!py-1 !flex-shrink-0 max-sm:!text-xs whitespace-nowrap ${pathname === '/liquidity' ? '!hidden' : '!block'}`} href="/liquidity">
        <span>Deposit Now</span>
      </Button>
    </div>
  )
}

export default Blast3XBanner
