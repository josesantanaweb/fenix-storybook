import Image from 'next/image'
// import { useEffect, useRef, useState } from 'react'
// import Lottie from 'react-lottie'
// import Animation from '../../../../public/static/images/animation/GalaxyPartnersSlow.json'
// import WindowSize from '../../../hooks/useWindowSize'

import p1 from '../../../../public/static/images/partners/p1.svg'
import p2 from '../../../../public/static/images/partners/p2.svg'
import p3 from '../../../../public/static/images/partners/p3.svg'
import bg from '../../../../public/static/images/partners/bg.svg'

const Diagram = () => {
  // const defaultOptions = {
  //   loop: true,
  //   animationData: Animation,
  // }

  // const { innerWidth } = WindowSize()
  // const [isAnimationPaused, setIsAnimationPaused] = useState<boolean>(false)

  // const handleAnimationClick = (e: React.MouseEvent<HTMLDivElement>) => {
  //   if (isAnimationPaused) {
  //     e.stopPropagation()
  //     setIsAnimationPaused(false)
  //   } else {
  //     setIsAnimationPaused(true)
  //   }
  // }

  // const elementRef = useRef(null)
  // const [isVisible, setIsVisible] = useState(false)

  // useEffect(() => {
  //   const observer = new IntersectionObserver((entries) => {
  //     entries.forEach((entry) => {
  //       if (entry.isIntersecting) {
  //         setIsVisible(true)
  //       } else {
  //         setIsVisible(false)
  //       }
  //     })
  //   })

  //   if (elementRef.current) {
  //     observer.observe(elementRef.current)
  //   }

  //   // Cleanup function
  //   return () => {
  //     if (elementRef.current) {
  //       observer.unobserve(elementRef.current)
  //     }
  //   }
  // }, [])

  return (
    <div className="text-bunker-950" 
    // onClick={handleAnimationClick}
    >
      {/* <div
        className="overflow-hidden 
        flex justify-center max-w-[100vw] 
        object-cover 
        [&>div]:flex-shrink-0 md:[&>div]:!w-[1700px] md:[&>div]:!h-[1200px]

        [&>div]:!w-[800px] 
      "
        ref={elementRef}
      >
        <Lottie options={defaultOptions}  />
      </div> */}
      <div className='flex items-center justify-center mt-5'>
        <div className="relative w-screen max-w-[1000px] overflow-hidden mx-auto flex items-center justify-center max-md:min-w-[950px]">
          <Image src={p2} alt="p2" width={1588} height={1588} className=' w-full h-full'/>
          <Image src={bg} alt="bg" width={1588} height={1588} className=' w-[900px] h-[900px] absolute animate-spin-slow'/>
          <Image src={p1} alt="p1" width={1588} height={1588} className=' w-[900px] h-[900px] absolute animate-spin-slow-reverse'/>
          <Image src={p3} alt="p3" width={1588} height={1588} className=' w-[900px] h-[900px] absolute animate-spin-slow-reverse'/>
        </div>
      </div>
      {/* <div className='flex items-center justify-center'>
        <div className="relative w-screen max-w-[900px] overflow-hidden mx-auto flex items-center justify-center max-md:min-w-[800px]">
          <Image src={p2} alt="p2" width={1588} height={1588} className=' w-full h-full'/>
          <Image src={bg} alt="bg" width={1588} height={1588} className=' w-full h-full absolute animate-spin-slow max-md:w-[800px]'/>
          <Image src={p1} alt="p1" width={1588} height={1588} className=' w-full h-full absolute animate-spin-slow-reverse max-md:w-[800px]'/>
          <Image src={p3} alt="p3" width={1588} height={1588} className=' w-full h-full absolute animate-spin-slow-reverse max-md:w-[800px]'/>
        </div>
      </div> */}
    </div>
  )
}

export default Diagram
