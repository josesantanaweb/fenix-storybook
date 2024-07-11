'use client'
// import React, { useEffect } from 'react'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { ScrollParallax } from 'react-just-parallax'

const Overview = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handlePlayPause = () => {
    if (videoRef.current && videoRef.current.paused) {
      videoRef.current.play()
      setIsPlaying(true)
    } else if (videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  return (
    <div className="relative flex items-center flex-col justify-center mt-[120px]">
      <div className="absolute -z-10 h-[1000px] top-[-200px] max-xl:top-[-100px] max-sm:top-0 left-0 right-0 ">
        <div className="w-full h-full relative overflow-hidden">
          <Image
            src="/static/images/landing/overview/Sun2.svg"
            width={500}
            height={500}
            className="absolute top-0 
            transform left-1/2 
            -translate-x-1/2 
            min-w-[150vw] 
            z-10 
            
            object-center object-cover"
            alt="Sun"
          />
        </div>
      </div>
      <div className="absolute -z-10  h-[1100px] top-[-20rem] left-0 right-0 overflow-hidden">
        <div className="min-w-full min-h-full mx-auto relative">
          {/* <Image
            src="/static/images/landing/main/start.svg"
            width={200}
            height={200}
            className="absolute top-[250px] right-[5rem] z-10 max-lg:hidden"
            alt="start"
          /> */}
          <ScrollParallax isAbsolutelyPositioned>
            <Image
              src="/static/images/landing/main/planet.svg"
              width={60}
              height={60}
              className="absolute top-[300px] right-[20rem] z-10 max-lg:hidden"
              alt="planet"
            />
            <Image
              src="/static/images/landing/main/planet.svg"
              width={60}
              height={60}
              className="absolute top-[300px] left-[20rem] z-10 max-lg:hidden"
              alt="planet"
            />
            <Image
              src="/static/images/landing/main/planet.svg"
              width={60}
              height={60}
              className="absolute top-[300px] right-[100px] z-10 lg:hidden"
              alt="planet"
            />
            <Image
              src="/static/images/landing/main/planet.svg"
              width={60}
              height={60}
              className="absolute top-[300px] left-[100px] z-10 lg:hidden"
              alt="planet"
            />
          </ScrollParallax>
          <Image
            src="/static/images/landing/main/start.svg"
            width={80}
            height={80}
            className="absolute bottom-[300px] max-sm:bottom-[400px] right-[5rem] z-10 lg:hidden"
            alt="start"
          />
        </div>
      </div>
      <div className="container flex flex-col items-center justify-center mx-auto">
        <h2 className="text-shark-100 text-xl max-lg:text-lg font-normal text-center">Overview</h2>
        <h4 className="text-gradient3 text-[40px] font-normal leading-relaxed max-lg:text-2xl text-center">
          Fenix will RISE
        </h4>
      </div>
      <div className="relative mx-auto mt-10 flex justify-center  z-50 w-[80%] sm:w-[70%]  xl:w-[60%]  video-landing p-4 max-lg:p-2 rounded-3xl border backdrop-blur-[74px] border-[#262C33] max-w-[1870px] cursor-pointer ">
        <video ref={videoRef} className="w-[100%] rounded-3xl" onClick={handlePlayPause}>
          <source src="/static/videos/landing-teaser.mp4" type="video/mp4"></source>
        </video>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {isPlaying ? (
            <></>
          ) : (
            <Image
              className=" md:w-[123px] md:h-[123px] w-[50px] h-[50px]"
              src="/static/images/landing/btn-play.svg"
              width={123}
              height={123}
              alt="Play"
              onClick={handlePlayPause}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Overview
