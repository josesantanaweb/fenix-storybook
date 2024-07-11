import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/src/components/UI'

type IRow = {
  type: string
  APR: string
}

interface RowDataProps {
  row: IRow
  changeValue: number
  setChangeValue: (value: number) => void
  activeVote: boolean
  activeSlider?: boolean
}

const MobileRowReward = ({ row, changeValue, setChangeValue, activeVote, activeSlider }: RowDataProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div
        className={`border border-shark-950 px-3 py-5 rounded-[10px] bg-shark-400 ${
          isOpen ? 'bg-opacity-60' : 'bg-opacity-20'
        } ${'xl:hidden'}`}
      >
        <div className="flex gap-[9px] items-center">
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              <Image
                src="/static/images/tokens/FNX.svg"
                alt="token"
                className="rounded-full w-7 h-7"
                width={20}
                height={20}
              />
              <Image
                src="/static/images/tokens/ETH.svg"
                alt="token"
                className="-ml-4 rounded-full w-7 h-7"
                width={20}
                height={20}
              />
            </div>
            <div className="flex items-center">
              <h5 className="text-sm text-white px-2">FNX / ETH</h5>
              <div className="flex items-center gap-2">
                <span className="flex items-center bg-opacity-20 px-4 text-xs justify-center py-2 text-white border border-solid border-green-400 bg-green-500 rounded-xl">
                  Volatile
                </span>
              </div>
            </div>
          </div>
          <button type="button" className="ml-auto" onClick={() => setIsOpen(!isOpen)}>
            <span className={`icon-chevron text-xs leading-[0] block ${isOpen ? 'rotate-180' : ''}`}></span>
          </button>
        </div>

        {isOpen && (
          <>
            <div className="flex  justify-between px-10 mt-[21px] mb-2.5">
              <div className='flex flex-col text-center text-sm'>
                <p className="text-shark-100">Rewards</p>
                <p>$123.32</p>
              </div>
              <Button variant="primary" className="!text-xs !py-1">
                Claim rewards
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default MobileRowReward
