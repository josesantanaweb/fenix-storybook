'use client'

import Image from 'next/image'
import HowToEarn from './HowToEarn'
import PointSummary from './PointSummary'
import Leaderboard from './Leaderboard'

const PointsProgram = () => {
  return (
    <section className="relative max-w-7xl mx-auto">
      <div className="py-10">
        <div className="flex items-center justify-center flex-col mb-8">
          <Image src={'/static/images/points-program/orbit.svg'} alt="" height={51} width={52} />
          <h1 className="text-white text-2xl mb-3 font-medium">Fenix Rings</h1>
          <p className="text-white text-sm text-center max-w-[793px] font-normal">
            Fenix Rings are designed to quantify and recognise users for their contributions to Fenix. These Rings will
            be awarded after the program ends, within a maximum of 3 months. Start earning from your activity now.
          </p>
        </div>
        <HowToEarn />
        <PointSummary />
        <Leaderboard />
      </div>
    </section>
  )
}

export default PointsProgram
