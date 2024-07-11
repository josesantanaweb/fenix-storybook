'use client'

interface PaneProps {
  children: React.ReactNode
}

const PanelWrapper = ({ children }: PaneProps) => {

  return (
    <section className="box-panel-trade">
      <div className="relative z-10 flex flex-col items-center justify-between w-full gap-12 xl:flex-row">
        <div className="relative w-full">
          {children}
        </div>
      </div>
    </section>
  )
}

export default PanelWrapper
