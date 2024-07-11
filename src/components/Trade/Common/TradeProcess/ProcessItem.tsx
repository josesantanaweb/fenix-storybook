'use client'

import { Button } from '@/src/components/UI'
import { IStep } from '@/src/library/types'

interface ProcessItemProps {
  step: IStep
}

const ProcessItem = ({ step }: ProcessItemProps) => {

  const stepActive = step.status === 'active' ? 'opacity-100' : 'opacity-60'

  return (
    <div className={`process-box w-full md:w-[49%] xl:w-1/6 xl:h-[170px] ${stepActive}`}>
      <div className="flex items-center justify-center w-10 h-10 px-2 mb-2 rounded-lg bg-shark-400">
        <span
          className={`inline-block text-lg text-gradient ${step.icon}`}
        ></span>
      </div>
      <p className="mb-2 text-xs text-center text-shark-100 line-clamp-2">{step.description}</p>
      {step.label && (
        <Button variant="tertiary" className="h-10">
          {step.label}
        </Button>
      )}
    </div>
  )
}

export default ProcessItem
