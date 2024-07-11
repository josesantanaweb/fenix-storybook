'use client'

interface MainBoxProps {
  children: React.ReactNode
}

const MainBox = ({ children }: MainBoxProps) => {
  return (
    <div className="relative w-full rounded-2xl max-w-[1168px]">
      <div className="main-box-top"></div>
      {children}
      <div className="main-box-bottom"></div>
    </div>
  )
}

export default MainBox
