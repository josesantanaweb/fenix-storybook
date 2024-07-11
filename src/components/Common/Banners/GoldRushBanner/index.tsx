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


const GoldRushBanner = () => {
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
    <div className="blast-banner flex items-center overflow-hidden rounded-tl-[1.625rem] rounded-br-[1.625rem] rounded-tr-xl rounded-bl-xl">
      <Image objectFit='cover' quality={100} src={'/static/images/blast-point-banner/noise-texture.svg'} alt='Noise Texture' className='max-lg:hidden w-[100%] h-[100%] absolute top-0 left-0 bottom-0 right-0 z-[5] rounded-tl-[1.625rem] rounded-br-[1.625rem] rounded-tr-xl rounded-bl-xl' width={10} height={10}/>
      <Image objectFit='cover' quality={100} src={'/static/images/blast-point-banner/noise-texture-mobile.svg'} alt='Noise Texture Mobile' className='lg:hidden w-[100%] h-[100%] absolute top-0 left-0 bottom-0 right-0 z-[5] rounded-tl-[3.5rem] rounded-br-[3.5rem] rounded-tr-xl rounded-bl-xl' width={10} height={10}/>
      <Image objectFit='cover' quality={100} src={'/static/images/blast-point-banner/cell.svg'} alt='Cell' className='max-lg:hidden w-[100%] h-[100%] absolute top-0 left-0 bottom-0 right-0 z-[5] rounded-tl-[1.625rem] rounded-br-[1.625rem] rounded-tr-xl rounded-bl-xl' width={10} height={10}/>
      <Image objectFit='cover' quality={100} src={'/static/images/blast-point-banner/cell-mobile.svg'} alt='Cell Mobile' className='lg:hidden w-[100%] h-[100%] absolute top-0 left-0 bottom-0 right-0 z-[5] rounded-tl-[3.5rem] rounded-br-[3.5rem] rounded-tr-xl rounded-bl-xl' width={10} height={10}/>

      <Image objectFit='cover' quality={100} src={'/static/images/gold-rush-banner/background-star.png'} alt='Background Star' className='max-lg:hidden w-[573px] mix-blend-lighten absolute bottom-[0px] left-[700px] z-[10]' width={570} height={10}/>
      <Image objectFit='cover' quality={100} src={'/static/images/gold-rush-banner/background-star2.png'} alt='Background Star2' className='max-lg:hidden w-[573px] mix-blend-lighten absolute bottom-[0px] left-[1120px] z-[10]' width={570} height={10}/>
      <Image priority objectFit='cover' quality={100} src={'/static/images/gold-rush-banner/masive-star.svg'} alt='Masive Star' className='max-lg:hidden w-[1135px] h-[786px] mix-blend-lighten absolute top-[-350px] left-[440px] z-[10]' width={10} height={10}/>
      {/* <Image objectFit='cover' quality={100} src={'/static/images/gold-rush-banner/masive-star.png'} alt='Masive Star' className='max-lg:hidden w-[1135px] mix-blend-lighten  absolute bottom-[0px] left-[440px] z-[10]' width={1000} height={10}/> */}
      <Image objectFit='cover' quality={100} src={'/static/images/gold-rush-banner/fenix-ring-low-opacity.svg'} alt='Fenix Ring Decorator' className='max-lg:hidden w-[23px] h-[23px] mix-blend-lighten absolute top-[0] left-[860px] z-[10]' width={10} height={10}/>
      <Image objectFit='cover' quality={100} src={'/static/images/gold-rush-banner/fenix-ring.svg'} alt='Fenix Ring Decorator 2' className='max-lg:hidden w-[23px] h-[23px] mix-blend-lighten absolute bottom-[0] left-[1400px] z-[10]' width={10} height={10}/>
      <Image objectFit='cover' quality={100} src={'/static/images/gold-rush-banner/ellipse.svg'} alt='Ellipse' className='max-lg:hidden w-[16px] h-[16px] absolute bottom-[20px]  left-[1070px] z-[10]' width={10} height={10}/>
      <Image objectFit='cover' quality={100} src={'/static/images/gold-rush-banner/ellipse2.svg'} alt='Ellipse 2' className='max-lg:hidden w-[16px] h-[16px] absolute bottom-[30px]  left-[515px] z-[10]' width={10} height={10}/>

      <Image objectFit='cover' quality={100} src={'/static/images/gold-rush-banner/background-star3.svg'} alt='Background Star3' className='lg:hidden w-[198px] h-[134px] mix-blend-lighten absolute top-[0px] right-[0px] z-[10]' width={10} height={10}/>
      <Image priority objectFit='cover' quality={100} src={'/static/images/gold-rush-banner/masive-star2.svg'} alt='Masive Star2' className='lg:hidden w-[1035px] h-[786px] mix-blend-lighten absolute top-[-320px] left-1/2 -translate-x-1/2 z-[10]' width={10} height={10}/>
      <Image objectFit='cover' quality={100} src={'/static/images/gold-rush-banner/fenix-ring2.svg'} alt='Fenix Ring Decorator 2' className='lg:hidden  w-[23px] h-[23px] mix-blend-lighten absolute top-[0] right-[50px] z-[10]' width={10} height={10}/>

      <div className="relative z-[12] flex items-center gap-8 max-lg:gap-1 max-lg:hidden">
        {/* <div className='flex items-center gap-3'>
            <Image src={'/static/images/point-stack/blast-gold.svg'} alt='Blast Gold' className='w-[36px] h-[36px] z-[5]' width={10} height={10}/>
            <div className='h-[50px] border-l border-shark-100'></div>
            <div className='flex flex-col items-start gap-1'>
              <div className='text-white font-bold text-sm'>Join the Gold Rush</div>
              <div className='text-white font-medium text-xs'>Deposit liquidity to earn your share of <span className='text-[#FFEF76] font-semibold'>100K Blast Gold</span></div>
            </div>
        </div> */}
        <div className='flex items-center gap-3'>
            <Image src={'/static/images/blast-point-banner/fenix-ring-liquidity.svg'} alt='Fenix Orbit' className='w-[36px] h-[36px] z-[5]' width={10} height={10}/>
            <div className='h-[50px] border-l border-shark-100'></div>
            <div className='flex flex-col items-start gap-1'>
              <div className='text-white font-bold text-sm'>Earn even more with Fenix Rings</div>
              <div className='text-white font-medium text-xs'>that convert to 50% veFNX and 50% FNX at TGE</div>
            </div>
        </div>
      </div>
      <div className="text-white z-[12] lg:hidden relative w-[70%] h-[135px] my-auto">
        <div className={`slider-container w-full flex flex-col ${settings.slidesToScroll === 0 ? 'justify-center' : 'mt-4 max-sm:mt-2'}  h-full`}>
          <Slider ref={sliderRef} {...settings} beforeChange={(currentSlide: number, nextSlide: number) => setCurrentSlideNumber(nextSlide)}>
            {/* <div className='!flex items-center justify-start gap-3 z-[8] w-full h-full'>
              <Image src={'/static/images/point-stack/blast-gold.svg'} alt='Blast Gold' className='w-[36px] h-[36px] z-[5]' width={10} height={10}/>
              <div className='h-[70px] border-l border-shark-100'></div>
              <div className='flex flex-col items-start gap-1'>
                <div className='text-white font-bold text-sm'>Join the Gold Rush</div>
                <div className='text-white font-medium text-xs'>Deposit liquidity to earn your share of</div>
                <div className='gradient-banner px-3 py-1 font-normal text-white text-xs'>100K Blast Gold</div>
              </div>
            </div> */}
            <div className='!flex items-center justify-start gap-3 z-[8] w-full'>
                <Image src={'/static/images/blast-point-banner/fenix-ring-liquidity.svg'} alt='Fenix Orbit' className='w-[36px] h-[36px] z-[5]' width={10} height={10}/>
                <div className='h-[70px] border-l border-shark-100'></div>
                <div className='flex flex-col items-start gap-1'>
                  <div className='text-white font-bold text-sm'>Earn even more with Fenix Rings</div>
                  <div className='text-white font-medium text-xs'>that convert to</div>
                  <div className='gradient-banner px-3 py-1 font-normal text-white text-xs'>50% veFNX and 50% FNX at TGE</div>
                </div>
            </div>
          </Slider>
        </div>
      </div>
      <Button variant="primary" className={`relative z-[20] max-lg:!px-2 max-lg:!py-1 !flex-shrink-0 max-sm:!text-xs whitespace-nowrap ${pathname === '/liquidity' ? '!hidden' : '!block'}`} href="/liquidity">
        <span>Deposit Now</span>
      </Button>
    </div>
  )
}

export default GoldRushBanner
