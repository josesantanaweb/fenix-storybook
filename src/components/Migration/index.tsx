'use client'

import Migration from '@/src/components/Migration/Migration'
import Steps from '@/src/components/Common/Steps'
import Overview from '@/src/components/Migration/Overview'
import { STEPS } from './data'
import useStore from '@/src/state/zustand'
import OverviewMobile from './OverviewMobile/OverviewMobile'
import { useState } from 'react'

const Claim = () => {
  const isConnected = useStore((state) => state.isConnected)
  const [migrateStatus, setMigrateStatus] = useState<string | undefined>(undefined)

  return (
    <section>
      <div className="flex flex-col items-center gap-5 py-5 2xl:flex-row">
        <div className="w-full 2xl:w-3/4">
          <Migration isConnected={isConnected} />
        </div>
        <Steps steps={STEPS} />
      </div>
      <div className="hidden lg:block">
        <Overview migrateStatus={migrateStatus} setMigrateStatus={setMigrateStatus} />
      </div>
      <div className="block lg:hidden  xl:hidden">
        <OverviewMobile migrateStatus={migrateStatus} setMigrateStatus={setMigrateStatus} />
      </div>
    </section>
  )
}

export default Claim
