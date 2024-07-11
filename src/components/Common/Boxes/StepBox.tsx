'use client'

interface StepBoxProps {
  children: React.ReactNode
  className?: string
}

const StepBox = ({ children, className }: StepBoxProps) => {
  return <div className={`${className} steps-box`}>{children}</div>
}

export default StepBox
