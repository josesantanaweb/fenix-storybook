import { Button } from '@/src/components/UI'
import InputRange from '@/src/components/UI/SliderRange/InputRange'
import Image from 'next/image'
import { ChangeEventHandler, useState } from 'react'

const Split = () => {
  const [changeValue, setChangeValue] = useState(0)
  const handlerValue: ChangeEventHandler<HTMLInputElement> = (event) => {
    setChangeValue(Number(event.target.value))
  }
  return (
    <div className="flex flex-col">
      <div className="rotate-90 mx-auto w-8 h-8 flex justify-center items-center my-1 bg-shark-400 p-1 rounded-sm bg-opacity-40">
        <span className="icon-arrow text-2xl inline-block  text-gradient"></span>
      </div>
      <div className="flex flex-col gap-3  exchange-box-x1 p-5">
        <div className="text-sm flex justify-between">
          <p className="text-white text-sm text-left">Split in</p>
        </div>
        <div className="flex flex-wrap xl:flex-nowrap justify-between text-white gap-3">
          <div className="flex items-center gap-2 w-full">
            <span className="icon-lock  inline-block text-2xl text-gradient"></span>
            <InputRange
              step={1}
              max={100}
              min={0}
              height={7}
              value={changeValue}
              onChange={setChangeValue}
              thumbSize={18}
              disabled={true}
            />
            <p>{changeValue}</p>
          </div>
          <input
            type="number"
            // value={changeValue}
            onChange={handlerValue}
            placeholder="Enter Amount"
            className="bg-shark-400 text-sm text-center mx-auto rounded-lg bg-opacity-40 outline-none"
          />
        </div>
      </div>
      <div className="flex  flex-col gap-3 text-white mt-5 exchange-box-x1 p-5">
        <div className="flex text-xs justify-between  bg-shark-400 p-2 bg-opacity-40 rounded-xl border-shark-400 border ">
          <div className="flex items-center gap-2">
            <Image src={'/static/images/vote/fenix-logo.svg'} alt="fenix-logo" height={24} width={24} />
            <p>01</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <div className="flex items-center gap-2">
              <Image src={'/static/images/vote/fenix-logo.svg'} alt="fenix-logo" height={14} width={14} />
              <p>744,621.46</p>
            </div>
            <div className="flex gap-2 items-center  w-3/4 xl:w-auto">
              <span className="icon-lock  inline-block text-2xl text-gradient"></span>
              <InputRange
                step={1}
                max={100}
                min={0}
                height={7}
                value={changeValue}
                onChange={setChangeValue}
                thumbSize={18}
                disabled={true}
              />
              <p>{changeValue}%</p>
            </div>
          </div>
        </div>
        <div className="flex text-xs justify-between  bg-shark-400 p-2 bg-opacity-40 rounded-xl border-shark-400 border ">
          <div className="flex items-center gap-2">
            <Image src={'/static/images/vote/fenix-logo.svg'} alt="fenix-logo" height={24} width={24} />
            <p>01</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <div className="flex items-center gap-2">
              <Image src={'/static/images/vote/fenix-logo.svg'} alt="fenix-logo" height={14} width={14} />
              <p>744,621.46</p>
            </div>
            <div className="flex gap-2 items-center w-3/4 xl:w-auto">
              <span className="icon-lock  inline-block text-2xl text-gradient"></span>
              <InputRange
                step={1}
                max={100}
                min={0}
                height={7}
                value={changeValue}
                onChange={setChangeValue}
                thumbSize={18}
                disabled={true}
              />
              <p>{changeValue}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Split
