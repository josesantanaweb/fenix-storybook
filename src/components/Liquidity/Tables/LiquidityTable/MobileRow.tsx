import { Button } from '@/src/components/UI'
import { formatAmount, formatCurrency, formatDollarAmount, toBN } from '@/src/library/utils/numbers'
import { BasicPool, PoolData } from '@/src/state/liquidity/types'
import Image from 'next/image'
import { useState } from 'react'

interface RowDataProps {
  row: BasicPool
  titleHeader?: string
  titleHeader2?: string
  titleButton?: string
  titleButton2?: string
  activeRange?: boolean
}

export default function MobileRow({
  row,
  titleHeader,
  titleHeader2,
  titleButton,
  titleButton2,
  activeRange,
}: RowDataProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div
        className={`border border-shark-950 px-3 py-2 rounded-[10px] bg-shark-400 ${
          isOpen ? 'bg-opacity-60' : 'bg-opacity-20'
        } ${'lg:hidden'}`}
      >
        <div className="flex gap-[9px] items-center">
          <div className="relative flex items-center">
            <Image
              src={`/static/images/tokens/${row.token0.symbol}.svg`}
              alt="token"
              className="w-8 h-8 rounded-full"
              width={32}
              height={32}
            />
            <Image
              src={`/static/images/tokens/${row.token1.symbol}.svg`}
              alt="token"
              className="w-8 h-8 -ml-5 rounded-full"
              width={32}
              height={32}
            />
          </div>
          <div className="flex flex-col">
            <div>
              <h5 className="text-sm font-semibold leading-normal mb-1.5">
                {row.token0.symbol} / {row.token1.symbol}
              </h5>
              <div className="flex items-center gap-2">
                <span className="text-white py-1 px-3 text-xs rounded-lg border bg-gradient-to-r from-outrageous-orange-500 to-festival-500">
                  Concentrated Pool
                </span>
                <span className="!py-1 px-3  text-xs text-white border border-solid bg-shark-400 rounded-xl bg-opacity-40 border-1 border-shark-300">
                  {formatAmount(toBN(row.fee).div(10000), 3)}%
                </span>
                <Button
                  variant="tertiary"
                  className="!py-1 !text-xs border !border-shark-400 !rounded-[10px] !bg-shark-400 !bg-opacity-40 !h-[30px] !px-[7px]"
                >
                  <span className="icon-info"></span>
                </Button>
              </div>
            </div>
          </div>
          <div className="flex gap-2 ml-auto">
            {titleButton2 === '' ? (
              <Button
                variant="tertiary"
                className="flex items-center gap-2 w-full"
                href={`/liquidity/deposit?type=CONCENTRATED_MANUAL&token0=${row.token0.id}&token1=${row.token1.id}`}
              >
                <span className="icon-circles"></span>
              </Button>
            ) : (
              <Button variant="tertiary" className="flex items-center gap-2 w-full" href="/liquidity/deposit">
                <span className="icon-logout"></span>
                Manage
              </Button>
            )}
            <button type="button" onClick={() => setIsOpen(!isOpen)}>
              <span className={`icon-chevron text-xs leading-[0] block ${isOpen ? 'rotate-180' : ''}`}></span>
            </button>
          </div>
        </div>

        {isOpen && (
          <>
            {activeRange && (
              <div className="flex justify-between border mt-[21px] items-center  mb-2.5 border-shark-300 p-4 rounded-lg">
                <h1 className="text-xs">Range</h1>
                <div className={`flex items-center justify-center`}>
                  <div className="flex gap-2 items-center">
                    <span className="bg-green-600 w-4 h-4 rounded-full border-4 border-black"></span>
                    <div className="text-xs flex flex-col">
                      <p className="text-shark-100 text-xs">Min Price</p>
                      <span className="p-2  text-white border border-solid bg-shark-400 rounded-xl bg-opacity-40 border-1 border-shark-300 text-xs">
                        $0.00
                      </span>
                    </div>
                    <div className="text-xs flex flex-col">
                      <p className="text-shark-100 text-xs">Max Price</p>
                      <span className="p-2 text-xs text-white border border-solid bg-shark-400 rounded-xl bg-opacity-40 border-1 border-shark-300">
                        $0.00
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-2.5  mb-2.5">
              <div
                className="flex items-start justify-between border border-shark-300 p-4 rounded-lg

              "
              >
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium leading-normal">APR</span>
                  {/* <span className="icon-info text-[13px]"></span> */}
                </div>
                <div className="flex gap-[7px]">
                  <div className="ml-auto text-xs leading-normal">
                    {formatAmount(toBN(row.fee).div(10000).div(row.totalValueLockedUSD).multipliedBy(100), 4)}%
                  </div>
                  <div
                    className="flex items-center gap-[5px] cursor-pointer
                     text-shark-100 hover:text-transparent hover:bg-gradient-to-r hover:from-outrageous-orange-500 hover:to-festival-500 hover:bg-clip-text"
                  ></div>
                </div>
              </div>

              <div className="flex items-start justify-between border  border-shark-300 p-4 rounded-lg">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium leading-normal">TVL</span>
                </div>
                <div className="flex flex-col">
                  <div className="ml-auto text-xs leading-normal">
                    {/* TVL AQUI */}
                    {formatDollarAmount(Number(row.totalValueLockedUSD))}
                  </div>
                  <div className="flex gap-2.5 text-shark-100">
                    <div className="flex items-center gap-[5px]"></div>
                    <div className="flex items-center gap-[5px]"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-start justify-between border border-shark-300 p-4 rounded-lg">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium leading-normal">
                    {titleHeader?.length === 0 ? 'Volume' : titleHeader}
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="ml-auto text-xs leading-normal">{formatDollarAmount(Number(row.volumeUSD))}</div>
                  <div className="flex gap-2.5 text-shark-100">
                    <div className="flex items-center gap-[5px]">
                      <Image
                        src={`/static/images/tokens/${row.token0.symbol}.svg`}
                        alt="token"
                        className="w-2.5 h-2.5 rounded-full"
                        width={10}
                        height={10}
                      />
                      <span className="text-xs leading-normal">
                        {formatCurrency(Number(row.volumeToken0) / 2, 2)} {row.token0.symbol}
                      </span>
                    </div>
                    <div className="flex items-center gap-[5px]">
                      <Image
                        src={`/static/images/tokens/${row.token1.symbol}.svg`}
                        alt="token"
                        className="w-2.5 h-2.5 rounded-full"
                        width={10}
                        height={10}
                      />
                      <span className="text-xs leading-normal">
                        {formatCurrency(Number(row.volumeToken1) / 2, 2)} {row.token1.symbol}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start justify-between border border-shark-300 p-4 rounded-lg">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium leading-normal">
                    {titleHeader2 === '' ? 'Fees' : titleHeader2}
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="ml-auto text-xs leading-normal">{formatDollarAmount(row.feesUSD)}</div>
                  <div className="flex gap-2.5 text-shark-100">
                    <div className="flex items-center gap-[5px]">
                      <Image
                        src={`/static/images/tokens/${row.token0.symbol}.svg`}
                        alt="token"
                        className="w-2.5 h-2.5 rounded-full"
                        width={10}
                        height={10}
                      />
                      <span className="text-xs leading-normal">
                        {formatCurrency(toBN(row.feesToken0), 2)} {row.token0.symbol}
                      </span>
                    </div>
                    <div className="flex items-center gap-[5px]">
                      <Image
                        src={`/static/images/tokens/${row.token1.symbol}.svg`}
                        alt="token"
                        className="w-2.5 h-2.5 rounded-full"
                        width={10}
                        height={10}
                      />
                      <span className="text-xs leading-normal">
                        {formatCurrency(toBN(row.feesToken1), 2)} {row.token1.symbol}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
