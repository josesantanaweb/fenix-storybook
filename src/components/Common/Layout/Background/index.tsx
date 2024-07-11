"use client"
/* eslint-disable max-len */

import Image from 'next/image'
import cellImg from '@/public/static/images/cell.png'
import { usePathname } from 'next/navigation'


const Decorator = () => {
  const pathname = usePathname()
  if (pathname === '/') {
    return null
  }

  return (
    <div className="absolute -z-10 h-full min-h-screen top-0 left-0 right-0 bottom-0 overflow-hidden bg-shark-900">
      <div className="w-[715px] h-[715px] rounded-full opacity-20 bg-[linear-gradient(101deg,_#F60202_-4.02%,_#FFB400_94.06%)] blur-[150px] bottom-[calc(100%-115px)] left-[155px] absolute" />

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="959"
        height="432"
        viewBox="0 0 959 432"
        fill="none"
        className="absolute top-0 right-0"
      >
        <g opacity="0.2" filter="url(#filter0_f_215_2030)">
          <path
            d="M706.265 -268.768C884.441 -183.211 990.582 -34.0906 943.336 64.302C896.089 162.695 949.322 145.365 771.145 59.8076C592.968 -25.7494 257.34 136.537 304.586 38.1448C351.832 -60.2478 528.088 -354.325 706.265 -268.768Z"
            fill="url(#paint0_linear_215_2030)"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_215_2030"
            x="0.078125"
            y="-584.18"
            width="1254.49"
            height="1015.46"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="150" result="effect1_foregroundBlur_215_2030" />
          </filter>
          <linearGradient
            id="paint0_linear_215_2030"
            x1="398.141"
            y1="71.1103"
            x2="643.823"
            y2="-321.621"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#51575A" />
            <stop offset="1" stopColor="#6C7C95" />
          </linearGradient>
        </defs>
      </svg>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="431"
        height="1080"
        viewBox="0 0 431 1080"
        fill="none"
        className="absolute top-[70px] right-0"
      >
        <g opacity="0.2" filter="url(#filter0_f_215_2028)">
          <path
            d="M682.471 113.338C876.344 150.703 1003.22 338.159 965.855 532.033C928.489 725.907 981.436 664.883 787.563 627.517C593.689 590.152 266.007 1064.15 303.372 870.273C340.737 676.399 488.597 75.9723 682.471 113.338Z"
            fill="url(#paint0_linear_215_2028)"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_215_2028"
            x="0.433594"
            y="-188.331"
            width="1271.95"
            height="1405.37"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="150" result="effect1_foregroundBlur_215_2028" />
          </filter>
          <linearGradient
            id="paint0_linear_215_2028"
            x1="403.782"
            y1="869.767"
            x2="718.109"
            y2="105.441"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F60202" />
            <stop offset="1" stopColor="#FFB400" />
          </linearGradient>
        </defs>
      </svg>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1593"
        height="451"
        viewBox="0 0 1593 451"
        fill="none"
        className="absolute bottom-0 left-0"
      >
        <g opacity="0.1" filter="url(#filter0_f_215_2029)">
          <path
            d="M582.598 305.019C1002.03 366.251 1318.93 574.268 1290.41 769.639C1261.89 965.01 1357.91 908.344 938.47 847.112C519.034 785.88 -50.1309 1235.82 -21.6094 1040.45C6.9121 845.081 163.162 243.787 582.598 305.019Z"
            fill="url(#paint0_linear_215_2029)"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_215_2029"
            x="-322.641"
            y="0.662918"
            width="1914.84"
            height="1389.31"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="150" result="effect1_foregroundBlur_215_2029" />
          </filter>
          <linearGradient
            id="paint0_linear_215_2029"
            x1="190.456"
            y1="1051.7"
            x2="389.181"
            y2="236.086"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#51575A" />
            <stop offset="1" stopColor="#6C7C95" />
          </linearGradient>
        </defs>
      </svg>

      <Image
        src={cellImg}
        alt="cell"
        className={`absolute -z-10 h-auto w-full ${pathname === "/bribes" ? "bottom-56": 'bottom-0'}  max-w-[1920px] -translate-x-1/2 left-1/2 mix-blend-lighten`}
      />
    </div>
  )
}

export default Decorator
