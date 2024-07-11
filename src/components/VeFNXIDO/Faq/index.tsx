'use client'

import { ProgressBar } from '@/src/components/UI'
import FaqItem from './FaqItem'
import FAQS from './data'

const Faq = () => {
  return (
    <div className="relative w-[100%] mx-auto">
      <div className="flex items-center justify-between w-[100%]">
        <div className="text-white text-xl font-semibold">Faq</div>
        <div className="w-[15%]">
          <ProgressBar progress={20} />
        </div>
      </div>
      <div className="flex flex-col my-[20px] gap-4">
        {FAQS.map((faq, index) => {
          return <FaqItem faq={faq} key={index} />
        })}
      </div>
    </div>
  )
}

export default Faq
