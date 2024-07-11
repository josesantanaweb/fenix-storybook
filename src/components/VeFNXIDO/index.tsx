'use client'

import Steps from '@/src/components/Common/Steps'
import Offering from '@/src/components/VeFNXIDO/Offering'
import Detail from '@/src/components/VeFNXIDO/Detail'
import Faq from '@/src/components/VeFNXIDO/Faq'
import { STEPS } from './data'

const VeFNXIDO = () => {
  return (
    <section className="relative">
      <div className="flex flex-col items-start gap-5 py-5 2xl:flex-row justify-between">
        <Offering />
        <Detail />
        <Steps steps={STEPS} title="How to take part?" />
      </div>
      <Faq/>
    </section>
  )
}

export default VeFNXIDO
