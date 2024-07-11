'use client'

interface Items {
  label: string
  amount: string | number
  icon: string
}

interface InfoBoxProps {
  data: Items
  setShowTooltip?: (show: boolean) => void
  hasTooltip?: boolean
}

const InfoBox = ({ data, setShowTooltip, hasTooltip = false }: InfoBoxProps) => {
  const handleShowTooltip = () => setShowTooltip && setShowTooltip(true)

  const handleHiddenTooltip = () => setShowTooltip && setShowTooltip(false)

  return (
    <div className="overflow-hidden relative">
      <div className=" 2xl:min-w-[400px] h-[77px] flex gap-3 items-center p-3 mb-3 relative bg-shark-400 bg-opacity-40 rounded-lg">
        <div className="flex items-center justify-center w-12 h-12 p-3 rounded-lg bg-shark-400 bg-opacity-60">
          <span
            className={`inline-block text-2xl text-transparent bg-gradient-to-r from-outrageous-orange-500 to-festival-500 bg-clip-text ${data.icon}`}
          ></span>
        </div>
        <div className="fw">
          <h5 className="text-xs text-shark-100">{data.label}</h5>
          <div className="flex items-center gap-1">
            <p className="text-white">{data.amount}</p>
            {hasTooltip && (
              <span
                onMouseEnter={handleShowTooltip}
                onMouseLeave={handleHiddenTooltip}
                className="flex items-center justify-center w-5 h-5 text-xs text-white rounded-full cursor-pointer icon-info bg-shark-200 hover:bg-outrageous-orange-500"
              ></span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InfoBox
