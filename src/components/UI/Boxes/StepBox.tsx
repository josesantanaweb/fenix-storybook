'use client'

interface StepBoxProps {
  children: React.ReactNode
}

const StepBox = ({ children }: StepBoxProps) => {
  return (
    <div className="relative w-full xl:max-w-[615px] xl:w-[50%]">
      <div className="steps-box-top"></div>
      {children}
      <div className="steps-box-bottom"></div>
    </div>
  )
}

export default StepBox
