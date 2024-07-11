'use client'
import Image from 'next/image'
import { TableCell, TableRow, Button } from '@/src/components/UI'
import { useState } from 'react'
import MobileRowReward from './MobileRowReward'
type IRow = {
  type: string
  APR: string
}

interface RowRewardProps {
  row: IRow
  activeVote: boolean
  activeSlider?: boolean
}

const RowReward = ({ row, activeVote, activeSlider }: RowRewardProps) => {
  const [changeValue, setChangeValue] = useState(0)
  const [openInfo, setOpenInfo] = useState<boolean>(false)
  return (
    <>
      <TableRow className="hidden xl:flex">
        <TableCell className="w-[50%]">
          <div className="flex items-center gap-5">
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
            <div className="flex flex-col">
              <h5 className="text-sm text-white px-2">FNX / ETH</h5>
              <div className="flex items-center gap-2">
                <span className="flex items-center bg-opacity-20 w-[105px] text-xs justify-center px-5 py-2 text-white border border-solid border-green-400 bg-green-500 rounded-xl">
                  Volatile
                </span>
              </div>
            </div>
          </div>
        </TableCell>

        <TableCell className="w-[20%] flex justify-center">
          <div className="relative flex items-center">
            {openInfo && (
              <>
                <div className="absolute z-10 bg-shark-950 rounded-lg border border-shark-300 w-auto lg:w-[230px] top-9 px-5 py-3 gap-y-1">
                  <div className="flex justify-between items-center gap-2">
                    <div className="w-fit flex flex-col justify-center items-start">
                      <p className="text-white text-xs">Bribe</p>
                      <p className="flex items-center gap-2 text-xs text-shark-100">21 FNX</p>
                      <p className="w-full flex items-center gap-2 text-xs text-shark-100">200.2 fnUSDT</p>
                    </div>
                    <div className="flex flex-col justify-center items-start">
                      <p className="text-white text-xs">Fees</p>
                      <p className="flex items-center gap-2 text-xs text-shark-100">21 FNX</p>
                      <p className="flex items-center gap-2 text-xs text-shark-100">200.2 fnUSDT</p>
                    </div>
                  </div>
                </div>
              </>
            )}
            <p className="py-2 px-3  text-xs text-shark-100">$123.32</p>
            <span
              className="icon-info"
              onMouseEnter={() => setOpenInfo(true)}
              onMouseLeave={() => setOpenInfo(false)}
            ></span>
          </div>
        </TableCell>

        <TableCell className="flex items-center justify-end w-[30%]">
          <div>
            <Button variant="primary" className="flex gap-2 items-center !text-xs">
              Claim Rewards
            </Button>
          </div>
        </TableCell>
      </TableRow>
      <MobileRowReward
        changeValue={changeValue}
        activeVote={activeVote}
        activeSlider={activeSlider}
        setChangeValue={setChangeValue}
        row={row}
      />
    </>
  )
}

export default RowReward
