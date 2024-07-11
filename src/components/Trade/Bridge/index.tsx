'use client'
import LoadingData from '@/src/components/Modals/LoadingData'
import { useEffect, useState } from 'react'

const Bridge = () => {
  const [loading, setLoading] = useState<boolean>(true)
  // const [iframeSrc, setIframeSrc] = useState(false)
  const config = {
    companyName: 'Fenix',
    integratorId: 'fenix-97a5564c-a67a-4d0b-8d66-678e8b96d89b',
    slippage: 1.5,
    collectFees: {
      integratorAddress: '0xAC12571907b0aEE0eFd2BC13505B88284d5854db',
      fee: 30,
    },
    infiniteApproval: false,
    priceImpactWarnings: {
      warning: 3,
      critical: 5,
    },
    style: {
      neutralContent: '#BDBDBD',
      baseContent: '#E0E0E0',
      base100: '#424242',
      base200: '#616161',
      base300: '#757575',
      error: '#ED6A5E',
      warning: '#FFB155',
      success: '#8BC34A',
      primary: '#d65936',
      secondary: '#C76609',
      secondaryContent: '#E0E0E0',
      neutral: '#1D1E21',
      roundedBtn: '5px',
      roundedCornerBtn: '999px',
      roundedBox: '13px',
      roundedDropDown: '7px',
    },
    initialToChainId: 81457,
  }

  const buildIframeSrc = () => {
    const baseUrl = 'https://widget.squidrouter.com/iframe'

    const configParam = encodeURIComponent(JSON.stringify(config))
    return `${baseUrl}?config=${configParam}`
  }

  const iframeSrc = buildIframeSrc()
  
  useEffect(() => {
    console.log('iframeSrc :>> ', iframeSrc);
    if(iframeSrc !== undefined) {

    }
  }, [iframeSrc])

  return (
    <div className="flex justify-center mt-4">
      <iframe className="w-[500px]" height="700" src={iframeSrc} onLoad={() => {
        setTimeout(() => {
          setLoading(false)
        }, 5000)
      }}></iframe>
      <LoadingData openModal={loading} setOpenModal={setLoading} />
    </div>
  )
}

export default Bridge
