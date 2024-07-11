'use client'
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/src/components/UI'

const NotFound = () => {
  const router = useRouter()

  const hadleGoHome = () => router.push('/')

  return (
    <>
      <div className="relative sm:flex items-center hidden justify-center  py-20 text-white">
        <div className="lg:bg-error-404 sm:bg-error-404-responsive  font-light px-1 sm:w-[650px] lg:w-[960px] sm:h-[660px] flex items-center justify-center z-30  ">
          <div className="pt-10 flex items-center flex-col justify-center ">
            <h1 className="lg:text-[150px] sm:text-[100px] text-white mb-14">
              ERC-
              <span className="text-orange-500">404</span>
            </h1>
            <p className="mt-5 text-2xl text-white font-medium">Oh no, the page is gone!</p>
            <p className="mt-2 text-2xl font-light text-white">{`We’re sorry!`}</p>
            <p className="text-white mt-5 md:text-center sm:text-center text-sm">
              {`Sorry, the page you are looking for doesn't exist or has been moved.`}
            </p>
            <div className="p-5">
              <Button variant="tertiary" className="!py-2 md:w-auto gap-2 !bg-opacity-50" onClick={hadleGoHome}>
                Go to Home <span className="text-lg icon-logout"></span>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute m-0 p-0">
          <Image
            src={'/static/images/404/OQ3D1501.svg'}
            className="mix-blend-lighten w-[2050px] h-[1200px]"
            height={250}
            width={250}
            alt="image"
          />
        </div>

        <div className="absolute z-10 ">
          <Image
            src={'/static/images/404/background.svg'}
            className="w-auto h-[800px]  blur-lg "
            height={800}
            width={800}
            alt="image"
          />
        </div>
        <div className="absolute z-0">
          <Image
            src={'/static/images/404/Ellipse67.svg'}
            className="w-[1046.345px] h-[1046.345px] "
            height={800}
            width={800}
            alt="image"
          />
        </div>
      </div>
      {/* {desktop} */}
      <div className="relative sm:hidden items-center flex justify-center mt-10 mb-20 text-white">
        <div className="z-20 bg-error-404-mobile backdrop-blur-sm w-[350px] h-[570.54px] flex items-center ">
          <div className="flex flex-col items-center ">
            <h1 className="text-white text-[65px] font-bold">
              ERC-
              <span className="text-orange-500">404</span>
            </h1>
            <p className="mt-10  text-white text-2xl font-medium ">Oh no, the page is gone!</p>
            <p className="mt-2 text-2xl font-light text-white">{`We’re sorry!`}</p>
            <p className="text-white mt-5 text-center px-9 text-xs">
              {`Sorry, the page you are looking for doesn't exist or has been moved.`}
            </p>
            <div className="p-5">
              <Button variant="tertiary" className="!py-2 md:w-auto gap-2 !bg-opacity-50" onClick={hadleGoHome}>
                Go to Home <span className="text-lg icon-logout"></span>
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute ">
          <Image
            src={'/static/images/404/OQ3D1501.svg'}
            className="mix-blend-lighten w-[1392px] h-[1392px]   "
            height={800}
            width={800}
            alt="image"
          />
        </div>

        <div className="absolute z-10 ">
          <Image
            src={'/static/images/404/background.svg'}
            className="w-auto h-[800px]  blur-lg "
            height={800}
            width={800}
            alt="image"
          />
        </div>
        <div className="absolute z-0">
          <Image
            src={'/static/images/404/Ellipse67.svg'}
            className="w-[1046.345px] h-[1046.345px] "
            height={800}
            width={800}
            alt="image"
          />
        </div>
      </div>
      {/* {mobile} */}
    </>
  )
}

export default NotFound
