/* eslint-disable max-len */

import PointsProgram from '@/src/components/PointsProgram'
import React from 'react'
import Blast3XBanner from '@/src/components/Common/Banners/Blast3XBanner'


export const metadata = {
  title: 'Rings | Fenix Finance',
  description:
    'Fenix Rings will be convertible into the Fenix Airdrop at our token generation event. Take a stake in the main trading and liquidity marketplace for Blast.',
}

const PointsProgramPage = () => {
  return (
    <div className="container pt-5">
      <Blast3XBanner/>
      <PointsProgram />
    </div>
  )
}

export default PointsProgramPage
