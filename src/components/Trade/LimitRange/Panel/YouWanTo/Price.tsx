'use client'

interface PriceProps {
  value: number
  setValue: (value: number) => void
}

const Price = ({ setValue, value }: PriceProps) => {

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => setValue(parseFloat(e.target.value))

  return (
    <div className="exchange-box-x1">
      <div className="flex justify-between items-center">
        <div className="flex flex-col w-full px-2">
          <p className="text-white text-sm mb-2">Set Enter Price</p>
          <input
            type="number"
            placeholder="0"
            onChange={onChangeInput}
            value={value}
            className="bg-shark-400 bg-opacity-40 border border-shark-400 h-[50px] w-full rounded-lg outline-none px-3 text-white text-sm"
          />
        </div>
        <span className="icon-swap text-3xl mt-5 w-[10%] text-center text-gradient"></span>
        <div className="flex flex-col w-full px-2">
          <p className="text-white text-sm mb-2">Set Exit Price</p>
          <input
            type="number"
            placeholder="0"
            onChange={onChangeInput}
            value={value}
            className="bg-shark-400 bg-opacity-40 border border-shark-400 h-[50px] w-full rounded-lg outline-none px-3 text-white text-sm"
          />
        </div>
      </div>
    </div>
  )
}

export default Price
